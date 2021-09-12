package com.ultrasound.app.controller;

import com.amazonaws.Response;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.service.CategoryServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/S3")
public class S3Controller {


    @Autowired
    private CategoryServiceImpl categoryService;

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

    @GetMapping("/url/category/{name}")
    public URL getObjectUrl(@PathVariable String name) {
        log.info("Fetching object URL: {}", name);
        Category category = categoryService.getCategoryByName(name);
        String fileKey = "";
        try {
            fileKey = category.getFileId();
        } catch (Exception e) {
            throw e;
        }
        return s3Repository.getObjectUrl(fileKey);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateBucket() {
        s3Repository.updateS3Bucket();
       return ResponseEntity.ok().build();
    }
//
//    @PostMapping("/upload")
//    public ResponseEntity<?> addObject(@RequestBody MultipartFile file) throws IOException {
//
//        Category category = categoryService.getCategoryByName(name);
//        String fileId = s3Repository.saveObject(BUCKET_NAME, file);
//        category.setFileId(fileId);
//        categoryService.save(category);
//        return ResponseEntity.ok().build();
//    }
}
