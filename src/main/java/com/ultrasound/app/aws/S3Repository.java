package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.ultrasound.app.model.data.*;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class S3Repository implements S3Service {

    private final AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-files";

    @Autowired
    private ClassificationServiceImpl classificationService;

    @Autowired
    private SubMenuService subMenuService;

    public S3Repository(AmazonS3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public void updateS3Bucket() {

        ObjectListing objectListing = listObjectsV2();

        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries().stream()
                .filter(sums -> sums.getKey().contains(".mp4")).collect(Collectors.toList());
        List<String> fileMapKeys = summaries.stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());

        Map<String, List<String>> urlAndFileDataMap = new TreeMap<>();                    // file name and list of data
        LocalDate date = LocalDate.now().plusDays(2);

        // split the list of keys
        fileMapKeys.forEach(key -> {

            String[] fileParts = key.toLowerCase().split("[-.+ ]+\\s");
            if (fileParts.length > 2) {
                List<String> remainingList = new ArrayList<>();
                List<String> filePartList = Arrays.stream(fileParts).collect(Collectors.toList());
                List<String> newFilePartList = new ArrayList<>();
                newFilePartList.add(fileParts[0]);
                List<String> subMenuList = Arrays.stream(fileParts[1].split(" ")).collect(Collectors.toList());

                if (subMenuList.size() > 2) {
                    StringBuilder str = new StringBuilder();
                    str.append(subMenuList.get(0)).append(" ").append(subMenuList.get(1));
                    List<String> remainingSubMenu = subMenuList.subList(2, subMenuList.size());
                    newFilePartList.add(str.toString());
                    newFilePartList.addAll(remainingSubMenu);
                    if (filePartList.size() >= 3) {
                        remainingList = filePartList.subList(2, filePartList.size());
                    }
                    newFilePartList.addAll(remainingList);
                    fileParts = newFilePartList.toArray(new String[0]);
                }
            }
            List<String> filePartsFinal = Arrays.stream(fileParts).collect(Collectors.toList());
//            urlAndFileDataMap.put(s3Client.generatePresignedUrl(BUCKET_NAME, key, date.toDate()).toString(), filePartsFinal);
//            urlAndFileDataMap.put(s3Client.getUrl(BUCKET_NAME, key).toString(), filePartsFinal);
            urlAndFileDataMap.put(key, filePartsFinal);

        });

        // get rid of the useless bits of the filename
        urlAndFileDataMap.keySet().forEach(key -> {
            List<ListItem> itemList = new ArrayList<>();
            Map<String, String> subMenus = new TreeMap<>();
            Predicate<String> noMp4 = String -> !String.contains(".mp4");
            Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String) && String.length() > 2;

            List<String> cleanList = urlAndFileDataMap.get(key).stream()
                    .filter(noNumber.and(noMp4))
                    .map(String::strip)
                    .collect(Collectors.toList());

            cleanList.forEach(term -> StringUtils.replace(term, "w", "with"));
            cleanList.forEach(term -> StringUtils.replace(term, " w-", "with"));
            cleanList.forEach(term -> StringUtils.replace(term, " w ", "with"));

            StringBuilder listItemVideoTitle = new StringBuilder();
            cleanList.forEach(str -> listItemVideoTitle.append(str).append(" "));

            String subMenuName = "uncategorized";
            String currentClassificationName = "uncategorized";
            String listItemName = "uncategorized";
            boolean currentListHasSubMenu = false;

            if (cleanList.size() >= 3) {
                subMenuName = cleanList.get(1);
                currentClassificationName = cleanList.get(0);
                StringBuilder str = new StringBuilder();
                currentListHasSubMenu = true;
                List<String> remaining = cleanList.subList(2, cleanList.size());
                remaining.forEach(s -> str.append(" ").append(s));
                listItemName = str.toString();
            } else if (cleanList.size() == 2) {
                currentClassificationName = cleanList.get(0);
                listItemName = cleanList.get(1);
                currentListHasSubMenu = false;
            } else if (cleanList.size() == 1) {
                subMenuName = cleanList.get(0);
                currentClassificationName = cleanList.get(0);
                listItemName = cleanList.get(0);
                currentListHasSubMenu = false;
            }

            ListItem listItem = new ListItem(listItemName, listItemVideoTitle.toString(), key);
            itemList.add(listItem);
            SubMenu subMenu = new SubMenu(subMenuName, itemList);

            boolean classificationExists = classificationService.classificationExists(currentClassificationName.toLowerCase());

            if (!classificationExists) {
                if (currentListHasSubMenu) {
                    subMenus.put(subMenuName, subMenuService.insert(subMenu));
                    classificationService.insert(
                            new Classification(currentClassificationName.toLowerCase(), true, new ArrayList<>(), subMenus));
                } else {
                    classificationService.insert(
                            new Classification(currentClassificationName.toLowerCase(), false, itemList, new TreeMap<>()));
                }
                // if the classification does already exists
            } else {
                Classification classification = classificationService.getClassificationByName(currentClassificationName.toLowerCase());
                List<ListItem> presentItems = classification.getListItems();
                Predicate<ListItem> itemMatch = ListItem -> ListItem.getName().equals(listItem.getName());
                Predicate<ListItem> listItemMatch = ListItem -> ListItem.getLink().equals(listItem.getLink());

                // if our current set of data is sub menu length and the classification has submenus present
                if (classification.getHasSubMenu()) {
                    Map<String, String> currentSubMenus = classification.getSubMenus();
                    if (currentListHasSubMenu) {
                        // check to see if the current submenu name is already there. if so, add a list item to it.
                        if (classificationService.subMenuExists(classification.get_id(), subMenuName)) {

                            SubMenu match = subMenuService.getById(currentSubMenus.get(subMenuName));
                            List<ListItem> matchList = match.getItemList();
                            if (matchList.stream().noneMatch(listItemMatch.and(itemMatch))) {

                                matchList.add(listItem);
//                                matchList.addAll(itemList);
                                match.setItemList(matchList);
                                currentSubMenus.put(subMenuName, subMenuService.save(match));
                            }
                            // if not, create a new sublist, and save it to the classification, and save it to the db.
                        } else {
                            // if there are no instances of the current link or item name
                            List<ListItem> items = classification.getListItems();
                            if (items.stream().noneMatch(listItemMatch.and(itemMatch))) {
                                items.add(listItem);
//                                items.addAll(itemList);
                                SubMenu additionalSubMenu = new SubMenu(subMenuName, items);
                                String newId = subMenuService.insert(additionalSubMenu);
                                currentSubMenus.put(subMenuName, newId);
                            }
                        }
                        classification.setSubMenus(currentSubMenus);
                        classificationService.save(classification);
                    } else {
                        if (presentItems.stream().noneMatch((listItemMatch.and(itemMatch)))) {
                            presentItems.add(listItem);
                            classification.setListItems(presentItems);
                            classificationService.save(classification);
                        }
                    }
                } else if (!classification.getHasSubMenu()) {
                    // if current data is submenu size add a new submenu
                    if (currentListHasSubMenu) {
//                        itemList.add(listItem);
                        subMenus.put(subMenuName, subMenuService.insert(subMenu));
                        classification.setSubMenus(subMenus);
                        classification.setHasSubMenu(true);
                    } else {
                        if (presentItems.stream().noneMatch((listItemMatch.and(itemMatch)))) {
                            presentItems.add(listItem);
                            classification.setListItems(presentItems);
                        }
                    }
                    classificationService.save(classification);

                }
            }
        });
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

}
