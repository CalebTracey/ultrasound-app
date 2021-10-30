package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.ultrasound.app.model.data.*;
import com.ultrasound.app.payload.response.MessageResponse;
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
     * Method called from controller. Initializes file parsing.
     * @return Update information
     */
    @Override
    public MessageResponse initializeMongoDatabase() {
        List<String> s3FileNames = s3FileNames().stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());

        return createAndSaveMongoData(s3FileNames);
    }

    /**
     * TODO: remove empty Classifications / Submenus before upload to mongo
     * Initializes parsing of S3 mp4 file names and uses resulting data to upload to mongo.
     * @return Details of uploaded data info for http response
     */
    private MessageResponse createAndSaveMongoData(List<String> s3FileNames) {
        AtomicInteger classificationCount = new AtomicInteger();
        AtomicInteger subMenuCount = new AtomicInteger();
        AtomicInteger scanCount = new AtomicInteger();

        log.info("Total files from S3: {}\n", s3FileNames.size());
        Map<String, FileStructureDataContainer> fileStructureDataMap = createFileStructureMap(s3FileNames);

        // Use the data map generated from "createFileStructureMap()" to upload data to mongo
        fileStructureDataMap.keySet().forEach(key -> {
            FileStructureDataContainer currentData = fileStructureDataMap.get(key);

            Map<String, String> newClassificationSubMenuMap = new TreeMap<>();
            Boolean hasSubMenus = currentData.getHasSubMenu();
            boolean hasClassificationScans = currentData.getClassificationScans().size() != 0;

            Classification newClassification = new Classification();
            newClassification.setName(key);
            newClassification.setHasSubMenu(hasSubMenus);

            if (hasClassificationScans) {
                FileStructureDataContainer condenseData = condenseDataContainer(currentData);
                currentData.setSubMenus(condenseData.getSubMenus());
                newClassification.setListItems(condenseData.getClassificationScans());
                scanCount.addAndGet(condenseData.getClassificationScans().size());
            }

            if (hasSubMenus) {
                ListIterator<FileStructureSubMenu> subMenuListIterator = currentData.getSubMenus().listIterator();
                subMenuListIterator.forEachRemaining(subMenu -> {
                    SubMenu newSubMenuObj = new SubMenu();
                    newSubMenuObj.setName(subMenu.getName());
                    newSubMenuObj.setItemList(subMenu.getItemList());
                    newSubMenuObj.setClassification(currentData.getClassification());

                    newClassificationSubMenuMap.put(subMenu.getName(), subMenuService.save(newSubMenuObj).get_id());
                    subMenuCount.getAndIncrement();
                    scanCount.addAndGet(subMenu.getItemList().size());
                });
            }
            newClassification.setSubMenus(newClassificationSubMenuMap);


            classificationService.save(newClassification);
            classificationCount.getAndIncrement();
        });
        return new MessageResponse("Added " + classificationCount +
                " Classifications, " + subMenuCount +
                " submenus, and " + scanCount +
                " total scan files.");
    }

    /**
     * TODO: check for/update "scan index" number
     * Creates new SubMenu from frequently occurring classification-level Scans with similar names
     * @return FileStructureDataContainer with new submenus if needed
     */
    private FileStructureDataContainer condenseDataContainer(FileStructureDataContainer dataContainer) {
        List<FileStructureSubMenu> returnSubMenus = new ArrayList<>();
        if (dataContainer.getHasSubMenu()) {
            returnSubMenus.addAll(dataContainer.getSubMenus());
        }
        List<ListItem> startingItems = dataContainer.getClassificationScans();
        Map<String, List<ListItem>> commonScanNames = new TreeMap<>();

        startingItems.forEach(item -> {
            String[] matchValue = StringUtils.strip(item.getName()).split(" ");
            String valueStrip = matchValue[0].replaceAll("[^a-zA-Z0-9\\s]", "");
            List<ListItem> newList = new ArrayList<>();
            List<ListItem> commonScans = commonScanNames.getOrDefault(valueStrip, newList);
            commonScans.add(item);
            commonScanNames.put(valueStrip, commonScans);
        });

        commonScanNames.keySet().forEach(commonName -> {
            List<ListItem> commonScanList = commonScanNames.get(commonName);
            FileStructureSubMenu newSubMenu = new FileStructureSubMenu();

            if (commonScanList.size() > 1) {
                newSubMenu.setName(commonName);
                newSubMenu.setClassification(dataContainer.getClassification());
                newSubMenu.setItemList(commonScanList);

                List<FileStructureSubMenu> subMenuCommonNameMatchList = returnSubMenus.stream().filter(
                        subMenu -> subMenu.getName().contains(commonName)).collect(Collectors.toList());

                if (subMenuCommonNameMatchList.size() > 0) {
                    List<ListItem> combinedScanList = new ArrayList<>(commonScanList);
                    subMenuCommonNameMatchList.forEach(subMenu -> {
                        combinedScanList.addAll(subMenu.getItemList());
                    });
                    newSubMenu.setItemList(combinedScanList);
                    returnSubMenus.removeAll(subMenuCommonNameMatchList);
                }
                startingItems.removeAll(commonScanList);
                returnSubMenus.add(newSubMenu);
            }
        });
        return new FileStructureDataContainer(
                dataContainer.getClassification(),
                returnSubMenus,
                startingItems,
                dataContainer.link,
                !returnSubMenus.isEmpty());
    }

    /**
     * Takes the list of file names from the S3 Bucket and generates a mapping of unique values that
     * will be used to populate the Mongo database. Removes duplicate links and adds incrementing indexes
     * to files with duplicate names.
     * TODO: Code cleanup/ create util methods for duplicated code.
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
            // if the classification object has already been created
            if (fileStructureReturnMap.containsKey(mapKey)) {
                FileStructureDataContainer fileData = fileStructureReturnMap.get(mapKey);
                // if the classification and the new file object both have sub menus
                if (fileData.getHasSubMenu() && newFileStructure.getHasSubMenu()) {
                    FileStructureSubMenu newSubMenu = newFileStructure.getSubMenu();

                    List<FileStructureSubMenu> subMenus = fileData.getSubMenus();
                    List<String> subMenuNames = subMenus.stream()
                            .map(FileStructureSubMenu::getName).collect(Collectors.toList());
                    // predicate for duplicate subMenu names
                    Predicate<FileStructureSubMenu> nameMatch =
                            FileStructureSubMenu ->
                                    FileStructureSubMenu.getName().equals(newSubMenu.getName());
                    // if any duplicate present
                    if (subMenuNames.contains(newSubMenu.getName())) {
                        int index = subMenuNames.indexOf(newSubMenu.getName());

                        FileStructureSubMenu newCombinedSubMenu = generateCombinedSubMenu(subMenus.get(index), newSubMenu);
                        subMenus.set(index, newCombinedSubMenu);
                    } else {
                        subMenus.add(newSubMenu);
                    }
                    fileData.setSubMenus(subMenus);
                    // if the current classification has no submenus but new item does
                } else if (!fileData.getHasSubMenu() && newFileStructure.getHasSubMenu()) {
                    ArrayList<FileStructureSubMenu> newSubMenuList = new ArrayList<>();
                    newSubMenuList.add(newFileStructure.getSubMenu());
                    fileData.setSubMenus(newSubMenuList);
                    fileData.setHasSubMenu(true);
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
                        // and if that scan name is duplicate with the new file scan
                        // -- same as the combineFileStructureListItems util method without the iterator
                        if (fileData.getClassificationScans().get(0).getName()
                                .equals(newFileStructure.getScan().getName())) {
                            ListItem classificationScanItem = fileData.getClassificationScans().get(0);
                            String scanIndex = (classificationScanItem.getName().replaceAll("[^\\d]", ""));
                            if (scanIndex.length() != 0) {
                                log.info("Scan Index Classification: {} Length: {}", scanIndex, scanIndex.length());
                                int scanDigits = Integer.parseInt(scanIndex);
                                String newName = classificationScanItem.getName() + " " + (scanDigits + 1);
                                newFileStructure.getScan().setName(newName);
                            } else {
                                String newName = classificationScanItem.getName() + " " + 2;
                                classificationScanItem.setName(classificationScanItem.getName() + " " + 1);
                                newFileStructure.getScan().setName(newName);
                        }
                            fileData.getClassificationScans().add(newFileStructure.getScan());
                        } else {
                            List<ListItem> newScanList = new ArrayList<>(fileData.getClassificationScans());
                            newScanList.add(newFileStructure.getScan());
                            //remove duplicates
                            fileData.setClassificationScans(new ArrayList<>(new LinkedHashSet<>(newScanList)));
                        }
                    } else {
                        List<ListItem> newScanList = new ArrayList<>(fileData.getClassificationScans());
                        newScanList.add(newFileStructure.getScan());
                        //remove duplicates
                        fileData.setClassificationScans(new ArrayList<>(new LinkedHashSet<>(newScanList)));
                    }
                }
                //TODO Probably remove this. Extra step.
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
     *  Combines a classification's existing list of submenus with a new file object. Checks for duplicate
     *  submenu and list item values and merges/ renames as needed
     *  FIXME: Missing sub menu objects
     *  TODO: Refactor to take a single submenu for both params
     *
     * @param currentSubMenu list of present sub menus within a classification
     * @param newSubMenu new sub menu object that needs merging
     * @return list of submenus with no duplicates
     */
    private FileStructureSubMenu generateCombinedSubMenu(
            FileStructureSubMenu currentSubMenu, FileStructureSubMenu newSubMenu) {

        FileStructureSubMenu returnValue = new FileStructureSubMenu();
        returnValue.setName(currentSubMenu.getName());
        returnValue.setClassification(currentSubMenu.getClassification());

            ListItem newSubMenuItem = newSubMenu.getItemList().get(0);

                Predicate<ListItem> itemNameMatch =
                        ListItem -> ListItem.getName().equals(newSubMenuItem.getName());

                List<ListItem> duplicateItemsByName =
                        currentSubMenu.getItemList().stream().filter(itemNameMatch).collect(Collectors.toList());
                // no duplicate SM item names
                if (duplicateItemsByName.isEmpty()) {
                    List<ListItem> newSubMenuItemList = new ArrayList<>(currentSubMenu.getItemList());
                    newSubMenuItemList.add(newSubMenuItem);
                    returnValue.setItemList(newSubMenuItemList);
                } else {
                    List<ListItem> combinedScanList = combineFileStructureListItems(
                            currentSubMenu.getItemList(), newSubMenuItem);

                    returnValue.setItemList(combinedScanList);
                }
        return returnValue;
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
        List<ListItem> returnList = new ArrayList<>(currentScans);
        String newScanItemName = newScanItem.getName();
        String newScanItemLink = newScanItem.getLink();

        if (currentScans.size() > 1) {
            currentScans.forEach(scan -> {
                String currentScanName = scan.getName();
                String currentScanLink = scan.getLink();
                String scanIndex = (RegExUtils.removeAll(currentScanName, "[A-Za-z]"));
                StringUtils.deleteWhitespace(scanIndex);
                if (!scanIndex.equals(" ") &&
                        NumberUtils.isCreatable(scanIndex) &&
                        !currentScanLink.equals(newScanItemLink)) {

                    if (currentScanName.equals(newScanItemName)) {

                        log.info("Scan Index: {} Length: {}", scanIndex, scanIndex.length());
                        int scanDigits = Integer.parseInt(scanIndex);
                        String newName = scan.getName() + " " + (scanDigits + 1);
                        newScanItem.setName(newName);
                    } else {
                        String newName = scan.getName() + " " + 2;
                        scan.setName(scan.getName() + " " + 1);
                        newScanItem.setName(newName);
                    }
                    returnList.add(newScanItem);
                }
                else if (!NumberUtils.isCreatable(scanIndex) && currentScanName.equals(newScanItemName) && !currentScanLink.equals(newScanItemLink)) {
                    String newName = scan.getName() + " " + 2;
                    scan.setName(scan.getName() + " " + 1);
                    newScanItem.setName(newName);
                    returnList.add(newScanItem);
                } else if (!returnList.contains(newScanItem)){
                    returnList.add((newScanItem));
                }
            });
        } else {
            ListItem singletonCurrentScan = currentScans.get(0);
            if (singletonCurrentScan.getName().equals(newScanItemName) && !checkIfSameLink(singletonCurrentScan, newScanItem)) {
                String scanIndex = (singletonCurrentScan.getName().replaceAll("[^\\d]", ""));
                if (scanIndex.length() != 0 && NumberUtils.isCreatable(scanIndex)) {
                    log.info("Scan Index: {} Length: {}", scanIndex, scanIndex.length());
                    int scanDigits = Integer.parseInt(scanIndex);
                    String newName = singletonCurrentScan.getName() + " " + (scanDigits + 1);
                    newScanItem.setName(newName);

                } else {
                    String newName = singletonCurrentScan.getName() + " " + 2;
                    singletonCurrentScan.setName(singletonCurrentScan.getName() + " " + 1);
                    newScanItem.setName(newName);
                }
            }
            returnList.add(newScanItem);
        }
        return new ArrayList<>(new LinkedHashSet<>(returnList));
    }

    /**
     * Utility method that takes a single file name as an input and creates a new
     * SingleFileStructure object.
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

        } else if (filteredSubParts.size() >= 1) {
            StringBuilder stringBuilder = new StringBuilder(listItem.getTitle());
            stringBuilder.delete(0, classificationName.length());

            String listItemName = stringBuilder.toString();
            StringUtils.deleteWhitespace(listItemName);

            if (stringBuilder.length() >= 2 && !NumberUtils.isCreatable(listItemName)) {
                listItem.setName(listItemName);
            } else {
                listItem.setName(filteredSubParts.get(0));
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

    private Boolean checkIfSameLink(ListItem item1, ListItem item2) {
        return item1.getLink().equals(item2.getLink());
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

//        singleFileTest(s3ServiceTest);

//        multiFileTest(s3ServiceTest);
//        duplicateSubMenuTest(s3ServiceTest);
        duplicateListItems(s3ServiceTest);
    }

    private static void singleFileTest(S3ServiceImpl s3ServiceTest) {
        String testFile ="Echo - MV vegetation - 5751988 - 1_crop.mp4";
//        String testFile = "ECHO-Heart in Zone 8-A4CMild TR-CMG-2890404-4_crop.mp4";
        /*
                   === PRIVATE METHOD TESTS ===
         */
        // SINGLE FILE TEST
        SingleFileStructure fileStructureTest = s3ServiceTest.normalizeFileStructure(testFile);
        log.info("=== SINGLE FILE TEST ===\n");
        log.info("Classification: {}", fileStructureTest.getClassification());
        log.info("== SUB MENU == ");
        log.info("- Has Sub Menu: {}", fileStructureTest.getHasSubMenu());
        if (fileStructureTest.getHasSubMenu()) {
            ListItem subMenuTestItem = fileStructureTest.getSubMenu().getItemList().get(0);

            log.info("- Sub Menu name: {}", fileStructureTest.getSubMenu().getName());
            log.info("- Sub Menu classification: {}", fileStructureTest.getSubMenu().getClassification());
            log.info("- Sub Menu item: {}", subMenuTestItem);
        }
        log.info("== SCAN ITEM ==");
        log.info("-- Has Scan item: {}", fileStructureTest.getHasScan());
        if (fileStructureTest.getHasScan()) {
            log.info("-- Scan item name: {}", fileStructureTest.getScan().getName());
            log.info("-- Scan item title: {}", fileStructureTest.getScan().getTitle());
            log.info("-- Scan item link: {}", fileStructureTest.getScan().getLink());
        }
    }

    private static void multiFileTest(S3ServiceImpl s3ServiceTest) {
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
            log.info("=== SUB MENUS ===");
            log.info("- Has Sub Menus : {}", testFileStructureDataContainer.getHasSubMenu());
            if (testFileStructureDataContainer.getHasSubMenu()) {
                log.info("- Sub Menu Count: {}", testFileSubMenus.size());
                testFileSubMenus.forEach(subMenu -> {
                    List<ListItem> subMenuItems = subMenu.getItemList();
                    log.info("- Name: {}", subMenu.getName());
                    log.info("- Item Count: {}", subMenuItems.size());
                    log.info("- Classification: {}", subMenu.getClassification());
                    subMenuItems.forEach(item -> {
                        log.info("-- Name: {}", item.getName());
                        log.info("-- title: {}", item.getTitle());
                        log.info("-- link: {}", item.getLink());
                        log.info("-- type: {}", item.getType());
                    });
                });
            }
            log.info("=== CLASSIFICATION SCANS ===");
            log.info("--- Classification Scan Count: {}", testClassificationListItems.size());
            testClassificationListItems.forEach(item -> {
                log.info("--- Name: {}", item.getName());
                log.info("--- title: {}", item.getTitle());
                log.info("--- link: {}", item.getLink());
                log.info("--- type: {}", item.getType());
            });
        });
    }

    private static void duplicateSubMenuTest(S3ServiceImpl s3ServiceTest) {
        String name = "Test Sub Menu";
        String classification = "ECHO";
        ListItem l1 = new ListItem("test item", "test item title 1", "aws.test.link.1");
        ListItem l2 = new ListItem("test item", "test item title 2", "aws.test.link.2");
        ListItem l3 = new ListItem("test item", "test item title 3", "aws.test.link.3");
        ListItem l4 = new ListItem("test item", "test item title 4", "aws.test.link.4");
        ListItem l5 = new ListItem("different item", "test item title 5", "aws.test.link.5");
        ListItem l6 = new ListItem("different item", "test item title 6", "aws.test.link.6");

        List<ListItem> testList = new ArrayList<ListItem>(Arrays.asList(l1,l2,l3));
        List<ListItem> testList1 = new ArrayList<ListItem>(Arrays.asList(l4,l5,l6));
        FileStructureSubMenu subMenuTest1 = new FileStructureSubMenu(classification, name, testList);
        FileStructureSubMenu subMenuTest2 = new FileStructureSubMenu(classification, name, testList1);

        FileStructureSubMenu combinedSubMenuTestReturnValue =
                s3ServiceTest.generateCombinedSubMenu(subMenuTest1, subMenuTest2);

//        log.debug("Combined Sub Menu Test: {}", combinedSubMenuTestReturnValue);
//        log.info("Classification: {}\n", key);
        log.info("=== SUB MENUS ===");
//        log.info("- Has Sub Menus : {}", testFileStructureDataContainer.getHasSubMenu());
            log.info("- Sub Menu name: {}", combinedSubMenuTestReturnValue.getName());
            log.info("- Sub Menu classification: {}", combinedSubMenuTestReturnValue.getClassification());

            combinedSubMenuTestReturnValue.getItemList().forEach(item -> {
                    log.info("-- Name: {}", item.getName());
                    log.info("-- title: {}", item.getTitle());
                    log.info("-- link: {}", item.getLink());
                    log.info("-- type: {}", item.getType());
                });
    }

    private static void duplicateListItems(S3ServiceImpl s3ServiceTest) {

        ListItem newItem = new ListItem("test item", "test item title 1", "aws.test.link.1");
        ListItem l1 = new ListItem("test item", "test item title 2", "aws.test.link.2");
        ListItem l2 = new ListItem("test item", "test item title 3", "aws.test.link.3");
        ListItem l3 = new ListItem("test item", "test item title 4", "aws.test.link.4");
        ListItem l4 = new ListItem("different item", "test item title 5", "aws.test.link.5");
        ListItem l5 = new ListItem("different item", "test item title 6", "aws.test.link.6");

        List<ListItem> testList = new ArrayList<ListItem>(Arrays.asList(l1,l2,l3, l4, l5));



        List<ListItem> combinedListTest =
                s3ServiceTest.combineFileStructureListItems(testList, newItem);

//        log.debug("Combined Sub Menu Test: {}", combinedSubMenuTestReturnValue);
//        log.info("Classification: {}\n", key);
        log.info("=== COMBINED ITEMS ===");
//
        combinedListTest.forEach(item -> {
            log.info("-- Name: {}", item.getName());
            log.info("-- title: {}", item.getTitle());
            log.info("-- link: {}", item.getLink());
            log.info("-- type: {}", item.getType());
        });
    }
}

