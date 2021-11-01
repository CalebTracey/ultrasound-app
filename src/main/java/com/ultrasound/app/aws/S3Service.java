package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;
import com.ultrasound.app.payload.response.MessageResponse;

import java.util.List;

public interface S3Service {

    MessageResponse initializeMongoDatabase();
    MessageResponse updateMongoDatabase();
//    String updateS3Bucket();
    ObjectListing listObjectsV2();
    String getPreSignedUrl(String key);
}
