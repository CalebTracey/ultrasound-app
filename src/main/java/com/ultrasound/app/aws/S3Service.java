package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;

public interface S3Service {

    void updateS3Bucket();
    ObjectListing listObjectsV2();
    String getPreSignedUrl(String key);
}
