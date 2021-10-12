package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;

public interface S3Service {

    String updateS3Bucket();
    ObjectListing listObjectsV2();
    String getPreSignedUrl(String key);
}
