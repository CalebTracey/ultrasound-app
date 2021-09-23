package com.ultrasound.app.controller;

import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.service.ClassificationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/S3")
public class S3Controller {

    @Autowired
    private S3Repository s3Repository;
    @Autowired
    private ClassificationServiceImpl classificationService;


    @GetMapping("/link/{link}")
    public ResponseEntity<?> getPreSignedUrl(@PathVariable String link) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/S3/link/{link}").toUriString());
        return ResponseEntity.created(uri).body(s3Repository.getPreSignedUrl(link));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateBucket() {
        s3Repository.updateS3Bucket();
       return ResponseEntity.ok().build();
    }

//    @PostMapping("/edit/classification/{id}")
//    public ResponseEntity<?> editClassification(@RequestBody Classification classification) {
//
//    }

}
