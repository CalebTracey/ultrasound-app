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

    @Override
    public String updateS3Bucket() {
        AtomicInteger classificationCount = new AtomicInteger();
        AtomicInteger subMenuCount = new AtomicInteger();
        AtomicInteger scanCount = new AtomicInteger();

        ObjectListing objectListing = listObjectsV2();

        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries().stream()
                .filter(sums -> sums.getKey().contains(".mp4")).collect(Collectors.toList());
        List<String> fileMapKeys = summaries.stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());

        Map<String, FileStructureDataContainer> fileStructureDataMap = createFileStructureMap(fileMapKeys);

        fileStructureDataMap.keySet().forEach(key -> {

            FileStructureDataContainer currentData = fileStructureDataMap.get(key);

            Map<String, String> newClassificationSubMenuMap = new TreeMap<>();

            Boolean hasSubMenus = currentData.getHasSubMenu();
            boolean hasClassificationScans = currentData.getClassificationScans().size() != 0;

            Classification newClassification = new Classification();
            newClassification.setName(key);
            newClassification.setHasSubMenu(hasSubMenus);

            if (hasSubMenus) {
                currentData.getSubMenus().forEach(subMenu -> {
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
                    // TODO Need to create new list objects ?
                    FileStructureSubMenu newSubMenu = newFileStructure.getSubMenu();
                    List<FileStructureSubMenu> subMenus = fileData.getSubMenus();

                    // check for matching sub menu names. If found, combine the scans into a single
                    // sub menu object and append the names of scans that are duplicates with an index value.
                    subMenus.forEach(subMenu -> {
                        int index = subMenus.indexOf(subMenu);
                        if (subMenu.getName().equals(newSubMenu.getName())) {
                            Predicate<ListItem> nameMatch = ListItem -> ListItem.getName().equals(newSubMenu.getName());
                            List<ListItem> duplicateNames = subMenu.getItemList().stream().filter(nameMatch).collect(Collectors.toList());

                            if (duplicateNames.isEmpty()) {
                                subMenu.setItemList(newSubMenu.getItemList());
                            } else if (duplicateNames.size() > 2){
                                combineFileStructureListItems(
                                        subMenu.getItemList(), newSubMenu.getItemList());
                                FileStructureSubMenu createdSubMenu = createSubMenu(subMenu.getItemList(), newSubMenu.getName());

                                fileData.getSubMenus().add(createdSubMenu);

                            } else{
//                                List<ListItem> combinedSubMenuScans =
                                    combineFileStructureListItems(subMenu.getItemList(), newSubMenu.getItemList());
//                                subMenus.get(index).setItemList(combinedSubMenuScans);
                            }
                        }
                    });

                    fileData.setSubMenus(subMenus);
                    // if the existing classification doesn't have any sub menus but the new one does,
                    // initialize the existing with a new list containing the new submenu
                } else if (!fileData.getHasSubMenu() && newFileStructure.getHasSubMenu()) {
                    ArrayList<FileStructureSubMenu> newSubMenuList = new ArrayList<>();
                    newSubMenuList.add(newFileStructure.getSubMenu());
                    fileData.setSubMenus(newSubMenuList);
                }
                // if new file has scan object, add to existing list
                if (newFileStructure.getHasScan()) {

                    List<ListItem> newScanList = new ArrayList<>();
                    newScanList.add(newFileStructure.getScan());
                    if (fileData.getClassificationScans().isEmpty()) {
                        fileData.setClassificationScans(newScanList);
                    } else {
//                        List<ListItem> combinedClassificationScans =
                                combineFileStructureListItems(fileData.getClassificationScans(), newScanList);
//                        fileData.setClassificationScans(combinedClassificationScans);
                    }
                }
                fileStructureReturnMap.replace(mapKey, fileData);
                // if the classification is NOT already present in the map, initialize a new one with
                // the new file data.
                //TODO: initialize new fileStructureData object
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
     * Utility method used for combining SubMenu objects and Classification level ListItems.
     * The names for duplicate values are appended with an increasing index.
     * @param currentScans The existing list of scan objects.
     * @param newScans     The new list of scan objects.
     * @return The combined list.
     */
    private void combineFileStructureListItems(List<ListItem> currentScans, List<ListItem> newScans) {
//        Iterator<ListItem> itemIterator = currentScans.listIterator();
        List<ListItem> returnList = new ArrayList<>(currentScans);
        List<String> currentScanNames = new ArrayList<>();
        currentScans.forEach(scan -> currentScanNames.add(scan.getName()));

        ListIterator<ListItem> listIterator = newScans.listIterator();

        listIterator.forEachRemaining(newScan -> {
            Predicate<ListItem> nameMatch = ListItem -> ListItem.getName().equals(newScan.getName());
            List<ListItem> duplicateNames = currentScans.stream().filter(nameMatch).collect(Collectors.toList());

            if (duplicateNames.size() > 2) {

            }
            if (currentScanNames.contains(newScan.getName())) {
                int nameIndex = currentScanNames.indexOf(newScan.getName());
                String scanSuffix= (currentScanNames.get(nameIndex).replaceAll("[^0-9]", ""));

                    if (scanSuffix.length() != 0) {
                        int scanDigits = Integer.parseInt(scanSuffix) + 1;
                        String newName = newScan.getName() + " " + scanDigits;
                        newScan.setName(newName);
                    } else {
                        String newName = newScan.getName() + " " + 1;
                        newScan.setName(newName);
                    }
            }
            currentScans.add(newScan);
//            });
//            }
        });
//        return returnList;
    }

    private FileStructureSubMenu createSubMenu(List<ListItem> newItems, String name) {
        FileStructureSubMenu subMenu = new FileStructureSubMenu();
        subMenu.setName(name);
        subMenu.setItemList(newItems);

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
        Predicate<String> noMp4 = String -> !String.contains("mp4");
        Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String) && String.length() > 2;

        List<String> filteredSubParts = Arrays.stream(splitFileSubParts).filter(noMp4).collect(Collectors.toList());
        int subPartsLength = filteredSubParts.size();

        List<String> scanNameParts = filteredSubParts.subList(subPartsLength / 2,
                subPartsLength).stream().filter(noNumber).collect(Collectors.toList());
        fileStructure.setClassification(classificationName);

        String scanName = StringUtils.join(scanNameParts, " ");
        listItem.setTitle(StringUtils.join(filteredSubParts, " "));
        listItem.setLink(file);

        if (subPartsLength >= 4) {
            int halfLength = subPartsLength / 2;
            List<String> subMenuNameParts = filteredSubParts.subList(0, halfLength);
            String subMenuName = StringUtils.join(subMenuNameParts, " ");
            if (!NumberUtils.isCreatable(scanName)) {
                listItem.setName(scanName + " scan");
            } else {
                listItem.setName(classificationName);
            }

            listItem.setType(EType.TYPE_SUB_MENU);

            subMenu.setName(subMenuName);
            subMenuItems.add(listItem);
            subMenu.setItemList(subMenuItems);
            fileStructure.setSubMenu(subMenu);
            fileStructure.setHasSubMenu(true);
            fileStructure.setHasScan(false);

        } else {
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
    public ObjectListing listObjectsV2() {
        return s3Client.listObjects(BUCKET_NAME);
    }

    public static void main(String[] args) {
        AmazonS3Client s3Client = S3Config.amazonS3Client();
        S3ServiceImpl s3ServiceTest = new S3ServiceImpl(s3Client);

//        String testFile = "ECHO-Heart in Zone 8-A4CMild TR-CMG-2890404-4_crop.mp4";
//        /*
//                   === PRIVATE METHOD TESTS ===
//         */
//        // SINGLE FILE TEST
//        SingleFileStructure fileStructureTest = s3ServiceTest.normalizeFileStructure(testFile);
//        ListItem subMenuTestItem = fileStructureTest.getSubMenu().getItemList().get(0);
//        log.info("=== SINGLE FILE TEST ===");
//        log.info("Classification: {}", fileStructureTest.getClassification());
//        log.info("== SUB MENU");
//        log.info("Has Sub Menu: {}", fileStructureTest.getHasSubMenu());
//        if (fileStructureTest.getHasSubMenu()) {
//            log.info("Sub Menu name: {}", fileStructureTest.getSubMenu().getName());
//            log.info("Sub Menu classification: {}", fileStructureTest.getSubMenu().getClassification());
//            log.info("Sub Menu item: {}", subMenuTestItem);
//        }
//        log.info("== SCAN ITEM");
//        log.info("Has Scan item: {}", fileStructureTest.getHasScan());
//        if (fileStructureTest.getHasScan()) {
//            log.info("-- Scan item name: {}", fileStructureTest.getScan().getName());
//            log.info("-- Scan item name: {}", fileStructureTest.getScan().getTitle());
//            log.info("-- Scan item name: {}", fileStructureTest.getScan().getLink());
//        }

        String[] testArray = new String[]{
                "DVT - Subclavian_Axillary DVT - 5783980 - 1_crop.mp4",
                "LUNG - consolidation 2 - 2890404_crop.mp4",
                "ECHO - Heart in Zone 8 - A4CMild TR- CMG - 2890404-4_crop.mp4",
                "ECHO - Heart in Zone 8 - A4CMod MR- CMG - 2890404-3_crop.mp4",
                "ECHO - Heart in Zone 8 - PSSA - CMG - 2890404-2_crop.mp4",
                "DVT - Subclavian_Axillary DVT - Neg Augmentation - 5783980 - 1_crop.mp4"
        };

        List<String> testList = new ArrayList<>(Arrays.asList(testArray));

        // MULTI FILE TEST -- RETURNS MAP
        Map<String, FileStructureDataContainer> testFileStructureDataContainerMap = s3ServiceTest.createFileStructureMap(testList);
        testFileStructureDataContainerMap.keySet().forEach(key -> {
            FileStructureDataContainer testFileStructureDataContainer = testFileStructureDataContainerMap.get(key);
            List<FileStructureSubMenu> testFileSubMenus = testFileStructureDataContainer.getSubMenus();
            List<ListItem> testClassificationListItems = testFileStructureDataContainer.getClassificationScans();

            log.info("=== MULTI FILE TEST ===\n");
            log.info("Classification: {}\n", key);
            log.info("=== SUB MENUS ===\n");
            log.info("Has Sub Menus : {}", testFileStructureDataContainer.getHasSubMenu());
            if (testFileStructureDataContainer.getHasSubMenu()) {
                log.info("Sub Menu Count: {}", testFileSubMenus.size());
                testFileSubMenus.forEach(subMenu -> {
                    List<ListItem> subMenuItems = subMenu.getItemList();
                    log.info("Name: {}", subMenu.getName());
                    log.info("Item Count: {}", subMenuItems.size());
                    log.info("Classification: {}", subMenu.getClassification());
                    subMenuItems.forEach(item -> {
                        log.info("Name: {}", item.getName());
                        log.info("title: {}", item.getTitle());
                        log.info("link: {}", item.getLink());
                        log.info("type: {}", item.getType());
                    });
                });
            }
            log.info("\n");
            log.info("=== CLASSIFICATION SCANS ===");
            log.info("Classification Scan Count: {}\n", testClassificationListItems.size());
            testClassificationListItems.forEach(item -> {
                log.info("Name: {}", item.getName());
                log.info("title: {}", item.getTitle());
                log.info("link: {}", item.getLink());
                log.info("type: {}", item.getType());
            });
        });
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
}

