package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.service.AppUserService;
import com.ultrasound.app.service.ClassificationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
}

