package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.security.service.UserDetailsServiceImpl;
import com.ultrasound.app.service.AppUserService;
import com.ultrasound.app.service.ClassificationServiceImpl;
import com.ultrasound.app.service.SubMenuService;
import com.ultrasound.app.service.SubMenuServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDate;
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
    private S3Repository s3Repository;
    @Autowired
    private SubMenuServiceImpl subMenuService;

    @GetMapping("/all")
    public String allAccess() {
        return "Total Members: " + (long) userService.all().size();
    }

    @GetMapping("/time")
    public String localTime() {
        LocalDate localDate = LocalDate.now();
        return localDate.getMonthOfYear() + " / " + localDate.getDayOfMonth() + " / " + localDate.getYear();
    }

    @GetMapping("/classifications")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Classification>> classifications() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/classifications").toUriString());
        return ResponseEntity.created(uri).body(classificationService.all());
    }

    @GetMapping("/submenu/{id}")
    public ResponseEntity<SubMenu> subMenu(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/submenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService.getById(id));
    }
}

