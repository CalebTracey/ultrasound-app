package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.List;

public interface S3Service {

    Boolean stringContainsItemsFromString(String input, List<String> items);
    void updateS3Bucket();
    String getObjectId(String name);
    Boolean existsByKey(String key);
    ObjectListing listObjectsV2();
    S3Object getObject(String key);
    URL getObjectUrl(String key);
    String saveObject(MultipartFile file) throws IOException;
}
