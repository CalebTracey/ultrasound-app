package com.ultrasound.app.aws;

import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.ObjectListing;
import com.ultrasound.app.payload.response.MessageResponse;

import java.util.List;
import java.util.Optional;

public interface S3Service {

    MessageResponse initializeMongoDatabase();
    MessageResponse updateMongoDatabase();
//    String updateS3Bucket();
    ListObjectsV2Result listObjectsV2();
    String getPreSignedUrl(String key);
}
