package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.ultrasound.app.model.data.*;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class S3Repository implements S3Service {

    private final AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-test";

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
        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries();
        List<String> keys = summaries.stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());
        Map<URL, String[]> urlAndFileData = new HashMap<>();                    // file name and list of data

        // split the list of keys
        keys.forEach(key -> {
            String[] fileParts = key.split("[-.+ ]+\\s");
            urlAndFileData.put(s3Client.getUrl(BUCKET_NAME, key), fileParts);    // (url, String[])
        });
        // get rid of the useless bits of the filename
        urlAndFileData.keySet().forEach(key -> {
            List<ListItem> itemList = new ArrayList<>();
            Map<String, String> subMenus = new HashMap<>();
            Predicate<String> noMp4 = String -> !String.contains(".mp4");
            Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String);

            // filter out chunks that contain numbers and ".mp4"
            List<String> cleanList = Arrays.stream(urlAndFileData.get(key))
                    .filter(noNumber.and(noMp4)).collect(Collectors.toList());

            String currentClassificationName = cleanList.get(0);                            // classification name
            String subMenuName = cleanList.get(1);
            String listItemName;
            boolean hasSubList;

            if (cleanList.size() >= 3) {
                StringBuilder str = new StringBuilder();
                hasSubList = true;
                List<String> remaining = cleanList.subList(2, cleanList.size());
                remaining.forEach(s -> str.append(" ").append(s));
                listItemName = str.toString();
            } else {
                listItemName = cleanList.get(cleanList.size() - 1);
                hasSubList = false;
            }
            ListItem listItem = new ListItem(listItemName, key.toString());
            itemList.add(listItem);
            SubMenu subMenu = new SubMenu(subMenuName, itemList);

            boolean classificationExists = classificationService.classificationExists(currentClassificationName);

            if (!classificationExists) {
                if (hasSubList) {
                    subMenus.put(subMenuName, subMenuService.insert(subMenu));
                    classificationService.insert(
                            new Classification(currentClassificationName, true, new ArrayList<>(), subMenus));
                } else {
                    classificationService.insert(
                            new Classification(currentClassificationName, false, itemList, new HashMap<>()));
                }
                // if the classification does already exists
            } else {
                Classification classification = classificationService.getClassificationByName(currentClassificationName);
                List<ListItem> presentItems = classification.getListItems();
                Predicate<ListItem> itemMatch = ListItem -> ListItem.getName().equals(listItemName);
                // if our current set of data is sub menu length and the classification has submenus present
                if (classification.getHasSubMenu()) {
                    Map<String, String> currentSubMenus = classification.getSubMenus();
                    if (hasSubList) {
                        // check to see if the current submenu name is already there. if so, add a list item to it.
                        if (classificationService.subMenuExists(classification.get_id(), subMenuName)) {
                            SubMenu match = subMenuService.getById(currentSubMenus.get(subMenuName));
                            List<ListItem> matchList = match.getItemList();
                            matchList.add(listItem);
                            match.setItemList(matchList);
                            currentSubMenus.put(subMenuName, subMenuService.save(match));
                            // if not, create a new sublist, and save it to the classification, and save it to the db.
                        } else {
                            List<ListItem> items = classification.getListItems();
                            items.add(listItem);
                            SubMenu additionalSubMenu = new SubMenu(subMenuName, items);
                            String newId = subMenuService.insert(additionalSubMenu);
                            currentSubMenus.put(subMenuName, newId);
                        }
                        classification.setSubMenus(currentSubMenus);
                        classificationService.save(classification);
                    } else {
                        if (presentItems.stream().noneMatch(itemMatch)) {
                            presentItems.add(listItem);
                            classification.setListItems(presentItems);
                            classificationService.save(classification);
                        }
                    }
                } else if (!classification.getHasSubMenu()) {
                    // if current data is submenu size add a new submenu
                    if (hasSubList) {
                        itemList.add(listItem);
                        subMenus.put(subMenuName, subMenuService.insert(subMenu));
                        classification.setSubMenus(subMenus);
                        classification.setHasSubMenu(true);
                    } else {
                        if (presentItems.stream().noneMatch(itemMatch)) {
                            presentItems.add(new ListItem(listItemName, key.toString()));
                            classification.setListItems(presentItems);
                        }
                    }
                    classificationService.save(classification);

                }
            }
        });
    }

    @Override
    public String getObjectId(String name) {

        return s3Client.getObject(BUCKET_NAME, name).getKey();
    }

    @Override
    public ObjectListing listObjectsV2() {
        return s3Client.listObjects(BUCKET_NAME);
    }

    @Override
    public S3Object getObject(String key) {
        return s3Client.getObject(BUCKET_NAME, key);
    }

}
