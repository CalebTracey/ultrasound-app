package com.ultrasound.app.controller;

import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.ultrasound.app.aws.S3Repository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/S3")
public class S3Controller {

    @Autowired
    private S3Repository s3Repository;

    @GetMapping
    public ObjectListing getAll() {
        return s3Repository.listObjectsV2();
    }

    @GetMapping("/{key}")
    public S3Object getObject(@PathVariable String key) {
        log.info("Fetching object: {}", key);
        return s3Repository.getObject(key);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateBucket() {
        s3Repository.updateS3Bucket();
       return ResponseEntity.ok().build();
    }

}
