package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;

public interface S3Service {

    void updateS3Bucket();
    String getObjectId(String name);
    Boolean existsByKey(String key);
    ObjectListing listObjectsV2();
    S3Object getObject(String key);
    URL getObjectUrl(String key);
    String saveObject(MultipartFile file) throws IOException;
}
