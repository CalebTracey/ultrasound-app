package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.service.AppUserService;
import com.ultrasound.app.service.CategoryServiceImpl;
import com.ultrasound.app.service.ClassificationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.management.Query;
import java.io.IOException;
import java.net.URI;
import java.util.*;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ContentController {

    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private CategoryServiceImpl categoryService;
    @Autowired
    private AppUserService userService;
    @Autowired
    S3Repository s3Repository;

    @GetMapping("/all")
    public String allAccess() {
        return "Total Members: " + (long) userService.all().size();
    }

    @GetMapping("/classifications")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Classification>> classifications() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/classifications").toUriString());
        return ResponseEntity.created(uri).body(classificationService.all());
    }

//    @GetMapping("/categories/{classification}")
//    public ResponseEntity<Set<String>> classificationCategories(@PathVariable String id){
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/api/categories/{classification}").toUriString());
//        return ResponseEntity.created(uri).body(classificationService);
//    }

//    @GetMapping("/category/url/{id}")
//    public ResponseEntity<URL> categoryUrl(@PathVariable String name) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/api/category/url/{id}").toUriString());
//        Category category = categoryService.getCategoryByName(name);
//        return ResponseEntity.created(uri).body(
//                .getObjectUrl(category.getFileId()));
//    }

//    @PostMapping("/category/add")
//    public ResponseEntity<?> addCategory(@RequestBody Category category) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/api/category/add").toUriString());
//        Classification classification = classificationService.getClassificationByName(category.getClassification());
//        Set<String> categories = classification.getCategories();
//        categories.add(category.getName());
//        classification.setCategories(categories);
//        classificationService.save(classification);
//        return ResponseEntity.created(uri).body(categoryService.save(category));
//    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadData(@RequestPart("file") MultipartFile file,
                                        @RequestPart UploadData data) throws IOException {

        String fileId;
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/upload").toUriString());

        Category category = categoryService.checkIfCategoryExists(data.getCategory());
        Classification classification = classificationService
                .checkIfClassificationExists(data.getCategory());

        if (!file.isEmpty() && category.getFileId().isEmpty()) {
            log.info("File detected and the category {} has no file", category.getName());
            fileId = s3Repository.saveObject(file);
            category.setFileId(fileId);
        } else if (!category.getFileId().isEmpty()){
            log.info("The category {} already has an associated file key", category.getFileId());
            if (!s3Repository.existsByKey(category.getFileId())) {
                log.info("The Uploaded file is not already present in the S3 Bucket");
               fileId = s3Repository.saveObject(file);
               category.setFileId(fileId);
               log.info("the category {} has a new file id: {}", category.getName(), fileId);
            }
        }
        categoryService.save(category);
        classificationService.save(classification);

        Map<String, List<?>> returnData = new HashMap<>();
        returnData.put("classifications", classificationService.all());
        returnData.put("categories", categoryService.all());

        return ResponseEntity.created(uri).body(returnData);
    }

    @PostMapping("/classification/add")
    public ResponseEntity<?> addClassification(@RequestBody Classification classification) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/category/add").toUriString());
        return ResponseEntity.created(uri).body(classificationService.save(classification));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }

}

