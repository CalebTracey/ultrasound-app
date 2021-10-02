package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3Repository;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.security.service.UserDetailsServiceImpl;
import com.ultrasound.app.service.*;
import lombok.Getter;
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
    private SubMenuServiceImpl subMenuService;
    @Autowired
    private ItemServiceImpl itemService;
    @Autowired
    private AppUserService userService;
    @Autowired
    private S3Repository s3Repository;


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
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/classifications").toUriString());
        return ResponseEntity.created(uri).body(classificationService.all());
    }

    @GetMapping("/submenu/{id}")
    public ResponseEntity<SubMenu> subMenu(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/submenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService.getById(id));
    }

    @PostMapping("/edit/classification/name/{id}")
    public ResponseEntity<?> editClassificationName(@PathVariable String id,
                                                    @RequestBody Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/classification/name/{id}").toUriString());
        return ResponseEntity.created(uri).body(classificationService.updateClassificationName(id, name.getName()));

    }

    @PostMapping("/edit/submenu/name/{classificationId}/{subMenuId}")
    public ResponseEntity<?> editSubMenuName(@PathVariable String classificationId,
                                             @PathVariable String subMenuId,
                                             @RequestBody Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/submenu/name/{id}").toUriString());
        return ResponseEntity.created(uri).body(classificationService
                .updateSubMenuName(classificationId, subMenuId, name.getName()));
    }

    @DeleteMapping("/delete-data/classification/{id}")
    public ResponseEntity<?> deleteClassification(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-data/classification/{id}").toUriString());
        return ResponseEntity.created(uri).body(classificationService
                .delete(id));
    }

    @DeleteMapping("/delete-data/submenu/{classificationId}/{subMenuId}")
    public ResponseEntity<?> deleteSubmenu(@PathVariable String classificationId,
                                           @PathVariable String subMenuId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-data/submenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService
                .deleteByIdClassification(classificationId, subMenuId));
    }

    @DeleteMapping("/delete-item/classification/{classificationId}/{title}/{name}")
    public ResponseEntity<?> deleteItemClassification(@PathVariable String classificationId,
                                                      @PathVariable String title,
                                                      @PathVariable String name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/classification/{classificationId}/{title}/{name}").toUriString());
        return ResponseEntity.created(uri).body(itemService.deleteItemClassification(classificationId, title, name));
    }

    @DeleteMapping("/delete-item/submenu/{classificationId}/{title}/{name}")
    public ResponseEntity<?> deleteItemSubmenu(@PathVariable String classificationId,
                                                      @PathVariable String title,
                                                      @PathVariable String name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/submenu/{classificationId}/{title}/{name}").toUriString());
        return ResponseEntity.created(uri).body(itemService.deleteItemSubMenu(classificationId, title, name));
    }
}

@Getter
class Name {
    private String name;
}

