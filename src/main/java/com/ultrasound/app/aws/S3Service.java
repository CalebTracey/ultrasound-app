package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ObjectListing;
import com.ultrasound.app.payload.response.MessageResponse;

public interface S3Service {

    MessageResponse initializeMongoDatabase();
//    String updateS3Bucket();
    ObjectListing listObjectsV2();
    String getPreSignedUrl(String key);
}
