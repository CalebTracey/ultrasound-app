package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.ultrasound.app.model.data.*;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.RegExUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.event.ItemListener;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Service
public class S3ServiceImpl implements S3Service {

    private final AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-files";

    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private SubMenuService subMenuService;

    public S3ServiceImpl(AmazonS3Client s3Client) {
        this.s3Client = s3Client;
    }

    private List<S3ObjectSummary> s3FileNames() {
        ObjectListing objectListing = listObjectsV2();
        return objectListing.getObjectSummaries().stream()
                .filter(sums -> sums.getKey().contains(".mp4")).collect(Collectors.toList());
    }

    /**
     * Parse filenames from S3 and upload to Mongo database.
     * TODO: Create new sub menu when duplicated name detected.
     * FIXME: The Create sub menu method not being called.
     *
     * @return Update information
     */
    private String createAndSaveMongoData(List<String> s3FileNames) {
        AtomicInteger classificationCount = new AtomicInteger();
        AtomicInteger subMenuCount = new AtomicInteger();
        AtomicInteger scanCount = new AtomicInteger();

        log.info("Total files from S3: {}\n", s3FileNames.size());
        Map<String, FileStructureDataContainer> fileStructureDataMap = createFileStructureMap(s3FileNames);

        fileStructureDataMap.keySet().forEach(key -> {
            FileStructureDataContainer currentData = fileStructureDataMap.get(key);
            Map<String, String> newClassificationSubMenuMap = new TreeMap<>();
            Boolean hasSubMenus = currentData.getHasSubMenu();
            boolean hasClassificationScans = currentData.getClassificationScans().size() != 0;

            Classification newClassification = new Classification();
            newClassification.setName(key);
            newClassification.setHasSubMenu(hasSubMenus);

            if (hasSubMenus) {
                ListIterator<FileStructureSubMenu> subMenuListIterator = currentData.getSubMenus().listIterator();
                subMenuListIterator.forEachRemaining(subMenu -> {
                    SubMenu newSubMenuObj = new SubMenu();
                    newSubMenuObj.setName(subMenu.getName());
                    newSubMenuObj.setItemList(subMenu.getItemList());

                    newClassificationSubMenuMap.put(subMenu.getName(), subMenuService.save(newSubMenuObj).get_id());
                    subMenuCount.getAndIncrement();
                    scanCount.addAndGet(subMenu.getItemList().size());
                });
            }
            newClassification.setSubMenus(newClassificationSubMenuMap);

            if (hasClassificationScans) {
                newClassification.setListItems(currentData.getClassificationScans());
                scanCount.addAndGet(currentData.getClassificationScans().size());
            }
            classificationService.save(newClassification);
            classificationCount.getAndIncrement();
        });
        return "Added " + classificationCount +
                " Classifications, " + subMenuCount +
                " sub-menus, and " + scanCount +
                " total scan files.";
    }

    /**
     * Takes the list of file names from the S3 Bucket and generates a mapping of unique values that
     * will be used to populate the Mongo database.
     *
     * @param fileMapKeys list of file names.
     * @return A map with a key set of Classification names and values of FileStructureDataContainer
     * objects that represent the MongoDB data model.
     */
    private Map<String, FileStructureDataContainer> createFileStructureMap(List<String> fileMapKeys) {
        Map<String, FileStructureDataContainer> fileStructureReturnMap = new TreeMap<>();
        fileMapKeys.forEach(key -> {
            SingleFileStructure newFileStructure = normalizeFileStructure(key);
            String mapKey = newFileStructure.getClassification();
            if (fileStructureReturnMap.containsKey(mapKey)) {
                FileStructureDataContainer fileData = fileStructureReturnMap.get(mapKey);
                // if the classification and the new file object both have sub menus
                if (fileData.getHasSubMenu() && newFileStructure.getHasSubMenu()) {
                    FileStructureSubMenu newSubMenu = newFileStructure.getSubMenu();
                    List<FileStructureSubMenu> subMenus = fileData.getSubMenus();
                    // predicate for duplicate subMenu names
                    Predicate<FileStructureSubMenu> nameMatch =
                            FileStructureSubMenu ->
                                    FileStructureSubMenu.getName().equals(newSubMenu.getName());
                    // if any duplicates present
                    if (subMenus.stream().anyMatch(nameMatch)) {
                        List<FileStructureSubMenu> duplicateSubMenus =
                                subMenus.stream().filter(Predicate.isEqual(nameMatch)).collect(Collectors.toList());
                        List<FileStructureSubMenu> uniqueSubMenus =
                                subMenus.stream().filter(Predicate.not(nameMatch)).collect(Collectors.toList());
                        // if more than one duplicate
                        if (duplicateSubMenus.size() > 1) {
                            uniqueSubMenus.addAll(generateCombinedSubMenus(duplicateSubMenus, newSubMenu));
                        // if one duplicate
                        } else if (duplicateSubMenus.size() == 1) {
                            FileStructureSubMenu duplicate = duplicateSubMenus.get(0);
                            List<ListItem> combinedItems = combineFileStructureListItems(duplicate.getItemList(),
                                    newSubMenu.getItemList().get(0));
                            duplicate.setItemList(combinedItems);
                            uniqueSubMenus.add(duplicateSubMenus.get(0));
                        }
                        fileData.setSubMenus(uniqueSubMenus);
                    } else {
                        subMenus.add(newSubMenu);
                        fileData.setSubMenus(subMenus);
                    }
                // if the current classification has no submenus but new item does
                } else if (!fileData.getHasSubMenu() && newFileStructure.getHasSubMenu()) {
                    ArrayList<FileStructureSubMenu> newSubMenuList = new ArrayList<>();
                    newSubMenuList.add(newFileStructure.getSubMenu());
                    fileData.setSubMenus(newSubMenuList);
                    // if the current classification object
                    fileStructureReturnMap.replace(mapKey, fileData);
                }
                // if new file has scan object, add to existing list
                if (newFileStructure.getHasScan()) {
                    // check if there are more than one scan. Needed because the util method
                    // creates a list iterator.
                    if (fileData.getClassificationScans().size() > 1) {
                        List<ListItem> combinedClassificationScans =
                            combineFileStructureListItems(fileData.getClassificationScans(), newFileStructure.getScan());
                        fileData.setClassificationScans(combinedClassificationScans);
                        // if the subMenu has only one classification scan
                    } else if (fileData.getClassificationScans().size() == 1) {
                        // and if that scan has the same name as the new file scan
                        // -- same as the combineFileStructureListItems util method without the iterator
                        if (fileData.getClassificationScans().get(0).getName()
                                .equals(newFileStructure.getScan().getName())) {
                            ListItem classificationScanItem = fileData.getClassificationScans().get(0);
                            String scanSuffix = (classificationScanItem.getName().replaceAll("[^\\d]", ""));
                            if (scanSuffix.length() != 0) {
                                log.info("Scan Suffix Classification: {} Length: {}", scanSuffix, scanSuffix.length());
                                int scanDigits = Integer.parseInt(scanSuffix);
                                String newName = classificationScanItem.getName() + " " + (scanDigits + 1);
                                newFileStructure.getScan().setName(newName);
                            } else {
                                String newName = classificationScanItem.getName() + " " + 2;
                                classificationScanItem.setName(classificationScanItem.getName() + " " + 1);
                                newFileStructure.getScan().setName(newName);
                        }
                            fileData.getClassificationScans().add(newFileStructure.getScan());
                        }
                    } else {
                        List<ListItem> newScanList = new ArrayList<>();
                        newScanList.add(newFileStructure.getScan());
                        fileData.setClassificationScans(newScanList);
                    }
                }
                fileStructureReturnMap.replace(mapKey, fileData);
                // if the classification is NOT already present in the map, initialize a new one with
                // the new file data.
            } else {
                FileStructureDataContainer newDataContainer = new FileStructureDataContainer();
                newDataContainer.setClassification(newFileStructure.getClassification());
                if (newFileStructure.getHasSubMenu()) {
                    ArrayList<FileStructureSubMenu> newSubMenuList = new ArrayList<>();
                    newSubMenuList.add(newFileStructure.getSubMenu());
                    newDataContainer.setSubMenus(newSubMenuList);
                    newDataContainer.setHasSubMenu(true);
                } else {
                    newDataContainer.setHasSubMenu(false);
                }
                if (newFileStructure.getHasScan()) {
                    List<ListItem> newScanList = new ArrayList<>();
                    newScanList.add(newFileStructure.getScan());
                    newDataContainer.setClassificationScans(newScanList);
                    newDataContainer.setHasSubMenu(false);
                } else {
                    List<ListItem> emptyScanList = new ArrayList<>();
                    newDataContainer.setClassificationScans(emptyScanList);
                }
                fileStructureReturnMap.put(newDataContainer.getClassification(), newDataContainer);
            }
        });
        return fileStructureReturnMap;
    }

    /**
     *
     * @param currentSubMenus
     * @param newSubMenu
     * @return
     */
    private List<FileStructureSubMenu> generateCombinedSubMenus(
            List<FileStructureSubMenu> currentSubMenus, FileStructureSubMenu newSubMenu) {

        List<FileStructureSubMenu> returnValueList = new ArrayList<>();
        FileStructureSubMenu combinedSubMenuReturnValue = new FileStructureSubMenu();
        combinedSubMenuReturnValue.setName(newSubMenu.getName());
        combinedSubMenuReturnValue.setClassification(newSubMenu.getClassification());

        currentSubMenus.forEach(subMenu -> {
            int index = currentSubMenus.indexOf(subMenu);
            ListItem newSubMenuItem = newSubMenu.getItemList().get(0);

            if (subMenu.getName().equals(newSubMenu.getName())) {
                Predicate<ListItem> itemNameMatch =
                        ListItem -> ListItem.getName().equals(newSubMenuItem.getName());

                List<ListItem> duplicateItemsByName =
                        subMenu.getItemList().stream().filter(itemNameMatch).collect(Collectors.toList());
                // no duplicate SM item names
                if (duplicateItemsByName.isEmpty()) {
                    List<ListItem> newSubMenuItemList = new ArrayList<>(subMenu.getItemList());
                    newSubMenuItemList.add(newSubMenuItem);
                    subMenu.setItemList(newSubMenuItemList);
                    returnValueList.add(index, subMenu);
                } else {
                    List<ListItem> combinedScanList = combineFileStructureListItems(
                            subMenu.getItemList(), newSubMenuItem);

                    subMenu.setItemList(combinedScanList);
                    returnValueList.add(index, subMenu);
                }
            } else {
                returnValueList.add(newSubMenu);
            }
        });
        return returnValueList;
    }
    /**
     * Utility method used for combining SubMenu objects and Classification level ListItems.
     * The names for duplicate values are appended with an increasing index.
     *
     * @param currentScans The existing list of scan objects.
     * @param newScanItem The new scan item being integrated.
     * @return The combined list.
     */
    private List<ListItem> combineFileStructureListItems(List<ListItem> currentScans, ListItem newScanItem) {
        List<ListItem> returnList = new ArrayList<>();
        String newScanItemName = newScanItem.getName();
        if (currentScans.size() > 1) {
            currentScans.forEach(scan -> {
                String currentScanName = scan.getName();
                Predicate<ListItem> nameMatch = ListItem -> ListItem.getName().equals(currentScanName);

                if (currentScanName.equals(newScanItemName)) {
                    String scanSuffix = (RegExUtils.removeAll("[^\\d]", currentScanName));

                    if (scanSuffix.length() != 0) {
                        log.info("Scan Suffix: {} Length: {}", scanSuffix, scanSuffix.length());
                        int scanDigits = Integer.parseInt(scanSuffix);
                        String newName = scan.getName() + " " + (scanDigits + 1);
                        newScanItem.setName(newName);
                    } else {
                        String newName = scan.getName() + " " + 2;
                        scan.setName(scan.getName() + " " + 1);
                        newScanItem.setName(newName);
                    }
                    returnList.add(newScanItem);
                }
                returnList.add(scan);
            });
        } else {
            ListItem singletonCurrentScan = currentScans.get(0);
            if (singletonCurrentScan.getName().equals(newScanItemName)) {
                String scanSuffix = (singletonCurrentScan.getName().replaceAll("[^\\d]", ""));
                if (scanSuffix.length() != 0) {
                    log.info("Scan Suffix: {} Length: {}", scanSuffix, scanSuffix.length());
                    int scanDigits = Integer.parseInt(scanSuffix);
                    String newName = singletonCurrentScan.getName() + " " + (scanDigits + 1);
                    newScanItem.setName(newName);

                } else {
                    String newName = singletonCurrentScan.getName() + " " + 2;
                    singletonCurrentScan.setName(singletonCurrentScan.getName() + " " + 1);
                    newScanItem.setName(newName);
                }
                returnList.add(newScanItem);
            }
            returnList.add(singletonCurrentScan);
        }
        return returnList;
    }

    /**
     *
     * @param newItems
     * @param name
     * @param classification
     * @return
     */
    private FileStructureSubMenu createSubMenu(List<ListItem> newItems, String name, String classification) {
        FileStructureSubMenu subMenu = new FileStructureSubMenu();
        subMenu.setName(name);
        subMenu.setItemList(newItems);
        subMenu.setClassification(classification);

        return subMenu;
    }

    /**
     * Utility method that takes a single file name as an input and creates a new
     * SingleFileStructure object.
     * //TODO Remove the useless bits from the Scan item title.
     *
     * @param file The original file name. Also the key for file in S3 Bucket.
     * @return A new SingleFileStructure object.
     */
    private SingleFileStructure normalizeFileStructure(String file) {
        SingleFileStructure fileStructure = new SingleFileStructure();
        ListItem listItem = new ListItem();
        ArrayList<ListItem> subMenuItems = new ArrayList<>();
        FileStructureSubMenu subMenu = new FileStructureSubMenu();

        String fileNoDash = StringUtils.replaceChars(file, "-", " ");
        String fileNoDashNormalized = StringUtils.normalizeSpace(fileNoDash);
        StringUtils.replace(" w ", fileNoDashNormalized, "with", -1);
        String[] splitFile = StringUtils.split(fileNoDashNormalized, null);
        String[] splitFileSubParts = ArrayUtils.subarray(splitFile, 1, splitFile.length);
        String classificationName = ArrayUtils.get(splitFile, 0);
        // filter predicates
        Predicate<String> noMp4 = String -> !String.contains("mp4");
        Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String) && String.length() > 2;
        Predicate<String> noNumberLong = String -> !NumberUtils.isCreatable(String);

        List<String> filteredSubParts = Arrays.stream(splitFileSubParts)
                .filter(noMp4.and(noNumber)).collect(Collectors.toList());
        List<String> titleParts = Arrays.stream(splitFile)
                .filter(noMp4.and(noNumberLong)).collect(Collectors.toList());
        int subPartsLength = filteredSubParts.size();

        fileStructure.setClassification(classificationName);
        listItem.setTitle(StringUtils.join(titleParts, " "));
        listItem.setLink(file);

        if (subPartsLength >= 4) {
            int halfLength = subPartsLength / 2;
            List<String> subMenuNameParts = filteredSubParts.subList(0, 2);
            List<String> scanNameParts = filteredSubParts.subList(2,
                    subPartsLength).stream().filter(noNumber).collect(Collectors.toList());

            String scanName = StringUtils.join(scanNameParts, " ");
            String subMenuName = StringUtils.join(subMenuNameParts, " ");

            listItem.setType(EType.TYPE_SUB_MENU);
            listItem.setName(scanName);
            subMenu.setName(subMenuName);
            subMenuItems.add(listItem);
            subMenu.setItemList(subMenuItems);
            subMenu.setClassification(classificationName);
            fileStructure.setSubMenu(subMenu);
            fileStructure.setHasSubMenu(true);
            fileStructure.setHasScan(false);

        } else if (filteredSubParts.size() > 1) {
            List<String> scanNameParts = filteredSubParts.subList(1,
                    subPartsLength).stream().filter(noNumber).collect(Collectors.toList());
            String scanName = StringUtils.join(scanNameParts, " ");

            if (scanNameParts.size() >= 2 && !NumberUtils.isCreatable(scanName)) {
                listItem.setName(scanName);
            } else if (!filteredSubParts.isEmpty() && !NumberUtils.isCreatable(filteredSubParts.get(0))) {
                listItem.setName(filteredSubParts.get(0));
            } else {
                listItem.setName(classificationName + " scan");
            }
            listItem.setType(EType.TYPE_CLASSIFICATION);
            fileStructure.setScan(listItem);
            fileStructure.setHasSubMenu(false);
            fileStructure.setHasScan(true);
        } else {
            listItem.setName(classificationName + " scan");
            listItem.setType(EType.TYPE_CLASSIFICATION);
            fileStructure.setScan(listItem);
            fileStructure.setHasSubMenu(false);
            fileStructure.setHasScan(true);
        }
        fileStructure.setLink(file);
        return fileStructure;
    }

    @Override
    public String getPreSignedUrl(String link) {
        log.info("Getting pre-signed URL for: {}", link);
        LocalDate date = new LocalDate().plusDays(1);
        return s3Client.generatePresignedUrl(BUCKET_NAME, link, date.toDate()).toString();
    }

    @Override
    public String initializeMongoDatabase() {
        List<String> s3FileNames = s3FileNames().stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());

        return createAndSaveMongoData(s3FileNames);
    }

    @Override
    public ObjectListing listObjectsV2() {
        return s3Client.listObjects(BUCKET_NAME);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static
    class SingleFileStructure {
        private String classification;
        private FileStructureSubMenu subMenu;
        private ListItem scan;
        private String link;
        private Boolean hasSubMenu;
        private Boolean hasScan;

        public SingleFileStructure(String classification, ListItem scan, String link, Boolean hasSubMenu, Boolean hasScan) {
            this.classification = classification;
            this.scan = scan;
            this.link = link;
            this.hasSubMenu = hasSubMenu;
            this.hasScan = hasScan;
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static
    class FileStructureDataContainer {
        private String classification;
        private List<FileStructureSubMenu> subMenus;
        private List<ListItem> classificationScans;
        private String link;
        private Boolean hasSubMenu;

        public FileStructureDataContainer(String classification, List<ListItem> classificationScans, String link, Boolean hasSubMenu) {
            this.classification = classification;
            this.classificationScans = classificationScans;
            this.link = link;
            this.hasSubMenu = hasSubMenu;
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static
    class FileStructureSubMenu {
        private String classification;
        private String name;
        private List<ListItem> itemList;
    }

    public static void main(String[] args) {
        AmazonS3Client s3Client = S3Config.amazonS3Client();
        S3ServiceImpl s3ServiceTest = new S3ServiceImpl(s3Client);
        String testFile ="Echo - MV vegetation - 5751988 - 1_crop.mp4";
//        String testFile = "ECHO-Heart in Zone 8-A4CMild TR-CMG-2890404-4_crop.mp4";
        /*
                   === PRIVATE METHOD TESTS ===
         */
        // SINGLE FILE TEST
        SingleFileStructure fileStructureTest = s3ServiceTest.normalizeFileStructure(testFile);
//        ListItem subMenuTestItem = fileStructureTest.getSubMenu().getItemList().get(0);
        log.info("=== SINGLE FILE TEST ===");
        log.info("Classification: {}", fileStructureTest.getClassification());
        log.info("== SUB MENU");
        log.info("Has Sub Menu: {}", fileStructureTest.getHasSubMenu());
        if (fileStructureTest.getHasSubMenu()) {
            ListItem subMenuTestItem = fileStructureTest.getSubMenu().getItemList().get(0);

            log.info("Sub Menu name: {}", fileStructureTest.getSubMenu().getName());
            log.info("Sub Menu classification: {}", fileStructureTest.getSubMenu().getClassification());
            log.info("Sub Menu item: {}", subMenuTestItem);
        }
        log.info("== SCAN ITEM");
        log.info("Has Scan item: {}", fileStructureTest.getHasScan());
        if (fileStructureTest.getHasScan()) {
            log.info("-- Scan item name: {}", fileStructureTest.getScan().getName());
            log.info("-- Scan item title: {}", fileStructureTest.getScan().getTitle());
            log.info("-- Scan item link: {}", fileStructureTest.getScan().getLink());
        }
//
//        String[] testArray = new String[]{
//                "DVT - Subclavian_Axillary DVT - 5783980 - 1_crop.mp4",
//                "LUNG - consolidation 2 - 2890404_crop.mp4",
//                "ECHO - Heart in Zone 8 - A4CMild TR- CMG - 2890404-4_crop.mp4",
//                "ECHO - Heart in Zone 8 - A4CMod MR- CMG - 2890404-3_crop.mp4",
//                "ECHO - Heart in Zone 8 - PSSA - CMG - 2890404-2_crop.mp4",
//                "DVT - Subclavian_Axillary DVT - Neg Augmentation - 5783980 - 1_crop.mp4"
//        };
//
//        List<String> testList = new ArrayList<>(Arrays.asList(testArray));
//
//        // MULTI FILE TEST -- RETURNS MAP
//        Map<String, FileStructureDataContainer> testFileStructureDataContainerMap = s3ServiceTest.createFileStructureMap(testList);
//        testFileStructureDataContainerMap.keySet().forEach(key -> {
//            FileStructureDataContainer testFileStructureDataContainer = testFileStructureDataContainerMap.get(key);
//            List<FileStructureSubMenu> testFileSubMenus = testFileStructureDataContainer.getSubMenus();
//            List<ListItem> testClassificationListItems = testFileStructureDataContainer.getClassificationScans();
//
//            log.info("=== MULTI FILE TEST ===\n");
//            log.info("Classification: {}\n", key);
//            log.info("=== SUB MENUS ===\n");
//            log.info("Has Sub Menus : {}", testFileStructureDataContainer.getHasSubMenu());
//            if (testFileStructureDataContainer.getHasSubMenu()) {
//                log.info("Sub Menu Count: {}", testFileSubMenus.size());
//                testFileSubMenus.forEach(subMenu -> {
//                    List<ListItem> subMenuItems = subMenu.getItemList();
//                    log.info("Name: {}", subMenu.getName());
//                    log.info("Item Count: {}", subMenuItems.size());
//                    log.info("Classification: {}", subMenu.getClassification());
//                    subMenuItems.forEach(item -> {
//                        log.info("Name: {}", item.getName());
//                        log.info("title: {}", item.getTitle());
//                        log.info("link: {}", item.getLink());
//                        log.info("type: {}", item.getType());
//                    });
//                });
//            }
//            log.info("\n");
//            log.info("=== CLASSIFICATION SCANS ===");
//            log.info("Classification Scan Count: {}\n", testClassificationListItems.size());
//            testClassificationListItems.forEach(item -> {
//                log.info("Name: {}", item.getName());
//                log.info("title: {}", item.getTitle());
//                log.info("link: {}", item.getLink());
//                log.info("type: {}", item.getType());
//            });
//        });
    }
}

