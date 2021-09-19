package com.ultrasound.app.aws;

import com.amazonaws.services.cloudformation.model.Output;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.ultrasound.app.model.data.*;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
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
//        Predicate<URL> urlPredicate = URL -> URL.
        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries();
        List<String> keys = summaries.stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());
        Map<URL, List<String>> urlAndFileData = new HashMap<>();                    // file name and list of data
        LocalDate date = LocalDate.now().plusDays(2);

        // split the list of keys
        keys.forEach(key -> {

//            S3Object object =  s3Client.getObject(BUCKET_NAME, key);
//            keys.forEach(str -> StringUtils.replace(str,"w","with"));

            String[] fileParts = key.toLowerCase().split("[-.+ ]+\\s");

            if (fileParts.length == 1) {
                fileParts = key.split("-");
            }
            if (fileParts.length == 1) {
                fileParts = key.split("_");
            }
            List<String> filePartsFinal = Arrays.stream(fileParts).collect(Collectors.toList());
            urlAndFileData.put(s3Client.generatePresignedUrl(BUCKET_NAME, key, date.toDate()), filePartsFinal);    // (url, String[])
        });

        urlAndFileData.values().forEach(dataArray -> dataArray.forEach(StringUtils::deleteWhitespace));

        // get rid of the useless bits of the filename
        urlAndFileData.keySet().forEach(key -> {
            List<ListItem> itemList = new ArrayList<>();
            Map<String, String> subMenus = new HashMap<>();
            Predicate<String> noMp4 = String -> !String.contains(".mp4");
            Predicate<String> noPng = String -> !String.contains(".png");
            Predicate<String> noJpg = String -> !String.contains(".jpg");
            Predicate<String> noWmv = String -> !String.contains(".wmv");
            Predicate<String> noBmp = String -> !String.contains(".bmp");
            Predicate<String> noAvi = String -> !String.contains(".avi");
            Predicate<String> noMov = String -> !String.contains(".mov");
            Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String) && String.length() > 2;

            urlAndFileData.get(key).forEach(StringUtils::strip);
            // filter out chunks that contain numbers and ".mp4"
            List<String> cleanList = urlAndFileData.get(key).stream()
                    .filter(noNumber.and(noMp4).and(noPng).and(noJpg).and(noWmv).and(noBmp).and(noAvi).and(noMov))
                    .collect(Collectors.toList());
//            cleanList.forEach(StringUtils::strip);
//            cleanList.forEach(org.springframework.util.StringUtils::trimAllWhitespace);
//            cleanList.forEach(term -> StringUtils.replace(term, "w", "with"));
            cleanList.forEach(term -> StringUtils.replace(term, " w-", "with"));
            cleanList.forEach(term -> StringUtils.replace(term, " w ", "with"));
                                 // classification name
//            if (cleanList.size() > 1) {
//
//                subMenuName= cleanList.get(1);
//                currentClassificationName = cleanList.get(0);
//            } else if (cleanList.size() == 1){
//                subMenuName= cleanList.get(0);
//                currentClassificationName= cleanList.get(0);
//            } else {
//                log.error("Key produces a list of size 0: {}", key);
//            }
            String subMenuName = "";
            String currentClassificationName = "";
            String listItemName = "";
            boolean hasSubList = false;

            if (cleanList.size() >= 3) {
                subMenuName= cleanList.get(1);
                currentClassificationName = cleanList.get(0);
                StringBuilder str = new StringBuilder();
                hasSubList = true;
                List<String> remaining = cleanList.subList(2, cleanList.size());
                remaining.forEach(s -> str.append(" ").append(s));
                listItemName = str.toString();
            } else if (cleanList.size() == 2) {
//                subMenuName = cleanList.get(0);
                currentClassificationName = cleanList.get(0);
                listItemName = cleanList.get(1);
                hasSubList = false;
            } else if (cleanList.size() == 1) {
                subMenuName = cleanList.get(0);
                currentClassificationName = cleanList.get(0);
                listItemName = cleanList.get(0);
                hasSubList = false;
            }
//            } else if (cleanList.size() == 0){
////                listItemName = cleanList.get(cleanList.size() - 1);
//                hasSubList = false;
//            }
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
                Predicate<ListItem> itemMatch = ListItem -> ListItem.getName().equals(listItem.getName());
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
