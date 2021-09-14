package com.ultrasound.app.aws;

import com.amazonaws.services.s3.AmazonS3Client;
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
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Slf4j
@Repository
public class S3Repository implements S3Service {

    private Integer index;

    @Autowired
    private ClassificationServiceImpl classificationService;

    @Autowired
    private CategoryServiceImpl categoryService;

    private final AmazonS3Client s3Client;
    private final String BUCKET_NAME = "ultrasound-test";

    public S3Repository(AmazonS3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public Boolean stringContainsItemsFromString(String input, List<String> items) {
        return items.stream().allMatch(input::contains);
    }

    @Override
    public void updateS3Bucket() {

        ObjectListing objectListing = listObjectsV2();
        List<S3ObjectSummary> summaries = objectListing.getObjectSummaries();
        List<String> keys = summaries.stream().map(S3ObjectSummary::getKey)     // keys = title of file
                .collect(Collectors.toList());
        Map<URL, String[]> urlAndFileData = new HashMap<>();                    // file name and list of data
        Map<String, Map<String, String>> bigDataMap = new HashMap<>();          // map using classification as key

        // split the list of keys by " - "
        keys.forEach( key -> {
                  String[] fileParts = key.split(" - ");
            urlAndFileData.put(s3Client.getUrl(BUCKET_NAME, key), fileParts);    // (url, String[])
            });
        // trim all whitespace
        urlAndFileData.keySet().forEach(key -> {
//            List<String> retVal = new ArrayList<>();
            Arrays.stream(urlAndFileData.get(key)).forEach(StringUtils::trimAllWhitespace);
        });
        // get rid of the useless bits of the filename
        urlAndFileData.keySet().forEach(key -> {
            Predicate<String> noMp4 = String -> !String.contains(".mp4");
            Predicate<String> noNumber = String -> !NumberUtils.isCreatable(String);

            // filter out chunks that contain numbers and ".mp4"
            List<String> cleanList = Arrays.stream(urlAndFileData.get(key))
                    .filter(noNumber.and(noMp4)).collect(Collectors.toList());
            String localClassification = cleanList.get(0);                        // current data based on the key iteration
            List<String> localCategories = cleanList.subList(1, cleanList.size());
//            List<String> localFileUrls = Arrays.stream(urlAndFileData.get(key)).collect(Collectors.toList());
            String localUrl = key.toString();
            Set<String> currentCategorySet = new LinkedHashSet<>(localCategories);
            Set<String> currentUrlSet = new LinkedHashSet<>();
            currentUrlSet.add(localUrl);

            if (bigDataMap.get(localClassification) != null) {
                Set<String> globalCategorySet = bigDataMap.get(localClassification).keySet();
                Set<String> globalUrlSet = new HashSet<>(bigDataMap.get(localClassification).values());
                currentCategorySet.addAll(globalCategorySet);
                currentUrlSet.addAll(globalUrlSet);
            }
            List<String> updatedCategoryList = new ArrayList<>(currentCategorySet);
            List<String> updatedUrlList = new ArrayList<>(currentUrlSet);
            int fillLength = updatedCategoryList.size() - updatedUrlList.size();
            String[] fill;
            if (fillLength >= 0) {
                fill = new String[fillLength];
            } else {
                fill = new String[0];
            }
            updatedUrlList.addAll(new ArrayList<>(Arrays.asList(fill)));
//            List<String> updatedUrlList = new ArrayList<>(Arrays.asList(new String[currentUrlSet.size() - updatedCategoryList.size()]));
//            updatedUrlList.addAll(new ArrayList<>(currentUrlSet));
            Map<String, String> updatedMap = IntStream.range(0, updatedCategoryList.size())
//                    .boxed().collect(Collectors.toMap(updatedCategoryList::get, updatedUrlList::get));
                    .collect(HashMap::new, (m, i) -> m.put(
                                    updatedCategoryList.get(i),
                                    updatedUrlList.get(i)),
                            Map::putAll);
            bigDataMap.put(localClassification, updatedMap);
        });
        // create a list of Classifications with a list of category names
        List<String> classificationNames = new ArrayList<>(bigDataMap.keySet());
        List<Classification> classifications = new ArrayList<>();

        classificationNames.forEach(name -> classifications.add(            // new classification with name,
                new Classification(name,
                        new ArrayList<>(bigDataMap.get(name).keySet()),     // add list of category names,
                        new ArrayList<>(bigDataMap.get(name).values()))     // add list of urls
        ));
        classificationService.saveAll(classifications);
        // create a list of categories
        classifications.forEach(classification -> {
            List<Category> categories = new ArrayList<>();
            List<String> categoryNames = classification.getCategoryNames();

            categoryNames.forEach(name -> {
                Category category = new Category(name, classification.getName());
                Set<String> relevantUrls = classification.getUrls().stream()
                        .filter(url -> url.contains(category.getName())).collect(Collectors.toSet());
                categories.add(new Category(name, new ArrayList<>(relevantUrls), classification.getName()));
            });
            categoryService.saveAll(categories);
            });
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
