package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3ServiceImpl;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.service.*;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Slf4j
//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ContentController  {

    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private SubMenuServiceImpl subMenuService;
    @Autowired
    private ItemServiceImpl itemService;
    @Autowired
    private AppUserService userService;
    @Autowired
    private S3ServiceImpl s3Repository;

    @GetMapping("/all")
    public String allAccess() {
        return "Total Members: " + (long) userService.all().size();
    }

    @GetMapping("/date")
    public String localDate() {
        LocalDate localDate = LocalDate.now();
        return localDate.getMonthOfYear() + " / " + localDate.getDayOfMonth() + " / " + localDate.getYear();
    }

    @GetMapping("/classifications")
    public ResponseEntity<?> classifications() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/classifications").toUriString());

        return ResponseEntity.ok()
                .body(classificationService.all());
    }

    @GetMapping("/submenu/{id}")
    public ResponseEntity<?> subMenu(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/submenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService.getById(id));
    }

    @PostMapping("/edit/classification/name/{id}")
    public ResponseEntity<?> editClassificationName(@PathVariable String id,
                                                    @RequestBody Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/classification/name/{id}").toUriString());
        Classification classification = classificationService.getById(id);
        return ResponseEntity.created(uri).body(classificationService.editName(classification, name.getName()));

    }

    @PostMapping("/edit/submenu/name/{classificationId}/{subMenuId}")
    public ResponseEntity<?> editSubMenuName(@PathVariable String classificationId,
                                             @PathVariable String subMenuId,
                                             @RequestBody Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/submenu/name/{id}/{subMenuId}").toUriString());
        Classification classification = classificationService.getById(classificationId);
        SubMenu subMenu = subMenuService.getById(subMenuId);
        return ResponseEntity.created(uri).body(subMenuService
                .editName(classification, subMenu, subMenuId, name.getName()));
    }

    @PostMapping("/edit/submenu/item/name/{id}")
    public ResponseEntity<?> editSubmenuItemName(@PathVariable String id,
                                                 @RequestBody NewItemName item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/submenu/item/name/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService
                .editItemName(id, item.getName(), item.getNewName(), item.getLink()));
    }

    @PostMapping("/edit/classification/item/name/{id}")
    public ResponseEntity<?> editClassificationItemName(@PathVariable String id,
                                                        @RequestBody NewItemName item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/classification/item/name/{id}").toUriString());
        return ResponseEntity.created(uri).body(classificationService
                .editItemName(id, item.getName(), item.getNewName(), item.getLink()));

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

    @PostMapping("/delete-item/classification/{classificationId}")
    public ResponseEntity<?> deleteItemClassification(@PathVariable String classificationId,
                                                      @RequestBody ItemLink item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/classification/{classificationId}").toUriString());
        Classification classification = classificationService.getById(classificationId);
        return ResponseEntity.created(uri).body(itemService.deleteItem(classification, item.getLink(), item.getName()));
    }

    @PostMapping("/delete-item/submenu/{subMenuId}")
    public ResponseEntity<?> deleteItemSubmenu(@PathVariable String subMenuId,
                                               @RequestBody ItemLink item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/submenu/{subMenuId}").toUriString());
        SubMenu subMenu = subMenuService.getById(subMenuId);
        return ResponseEntity.created(uri).body(itemService.deleteItem(subMenu, item.getLink(), item.getName()));
    }

    @DeleteMapping("/tables/clear")
    public ResponseEntity<?> deleteTables() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/tables/clear").toUriString());
        subMenuService.deleteTableEntities();
        classificationService.deleteTableEntities();

        return ResponseEntity.created(uri).body("Database table entities deleted");
    }

    private HttpHeaders resHeaders() {
        HttpHeaders resHeaders = new HttpHeaders();
        resHeaders.set("Access-Control-Allow-Origin", "localhost:8080");
        resHeaders.set("Access-Control-Allow-Methods:", "GET, DELETE, HEAD, OPTIONS");

        return resHeaders;
    }
}

@Getter
class Name {
    private String name;
}
@Getter
class ItemLink {
    private String name;
    private String link;
}
@Getter
class NewItemName {
    private String newName;
    private String link;
    private String name;
}



