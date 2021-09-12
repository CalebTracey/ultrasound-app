package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectMetadataRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.service.CategoryServiceImpl;
import com.ultrasound.app.service.ClassificationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Array;
import java.net.URL;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Repository
public class S3Repository implements S3Service {

    private Integer index;

    @Autowired
    private ClassificationServiceImpl classificationService;

    @Autowired
    private CategoryServiceImpl categoryService;

    private AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-test";

    public S3Repository(AmazonS3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public void updateS3Bucket() {
        index = -1;
        ObjectListing objectListing = listObjectsV2();
        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries();

        List<String> keys = summaries.stream().map(S3ObjectSummary::getKey)
                .collect(Collectors.toList()); // keys = title of file

        Map<String, List<String>> keyMap = new HashMap<>(); // map of (classification-name, category-name array)
        // split filenames by "-"
        List<String[]> deconstructedKeys = keys.stream().map(
                (key) -> key.split("-")).collect(Collectors.toList());

        // trim all whitespace
        List<List<String>> keyList = deconstructedKeys.stream().map(arrays -> {
            List<String> retVal = new ArrayList<>();
            Arrays.stream(arrays).forEach(str -> retVal.add(StringUtils.trimAllWhitespace(str)));
            return retVal;
        }).collect(Collectors.toList());

        // get rid of the useless bits from the filename that cant be categorized
        keyList.forEach(List -> {
            Predicate<String> noMp4 = String -> !String.contains(".mp4");
            Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String);

            List<String> res = List.stream().filter(noNumber.and(noMp4)).collect(Collectors.toList());
//            res.stream().filter(string -> )
            keyMap.put(res.get(0), res.subList(1, res.size()));
        });
        // create a list of Classifications with a list of category names
        List<Classification> classifications = keyMap.keySet().stream().map(String ->
                new Classification(String, keyMap.get(String))).collect(Collectors.toList());

        // update the list of Classifications with a list of category Ids.
        // At the same time save the categories to the database.
        classifications.forEach(Classification -> {
            List<String> categoryIds = categoryService
                    .saveAllByName(Classification.getCategoryNames(), Classification.getName());
                Classification.setCategoryIds(categoryIds);
                });

        classificationService.saveAll(classifications);
    }

    @Override
    public String getObjectId(String name) {

        return s3Client.getObject(BUCKET_NAME, name).getKey();
    }

    @Override
    public Boolean existsByKey(String key) {

        return s3Client.doesObjectExist(BUCKET_NAME, key);
    }

    @Override
    public ObjectListing listObjectsV2() {
        return s3Client.listObjects(BUCKET_NAME);
    }

    @Override
    public S3Object getObject(String key) {
        return s3Client.getObject(BUCKET_NAME, key);
    }

    @Override
    public URL getObjectUrl(String key) {
        return s3Client.getUrl(BUCKET_NAME,key);
    }

    @Override
    public String saveObject(MultipartFile file) throws IOException {

        File convFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();

        UUID key = UUID.randomUUID();
        s3Client.putObject(BUCKET_NAME, key.toString(), convFile);

        return key.toString();
    }


}
