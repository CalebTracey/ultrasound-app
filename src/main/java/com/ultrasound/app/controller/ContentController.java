package com.ultrasound.app.controller;

import com.ultrasound.app.aws.S3ServiceImpl;
import com.ultrasound.app.controller.util.ItemLink;
import com.ultrasound.app.controller.util.Name;
import com.ultrasound.app.controller.util.NewEmptySubMenu;
import com.ultrasound.app.controller.util.NewItemName;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.service.*;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Slf4j
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
        return ResponseEntity.created(uri)
                .body(classificationService.all());
    }

    @GetMapping("/classifications/{id}")
    public ResponseEntity<?> getClassification(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/classification/{id}").toUriString());
        return  ResponseEntity.created(uri).body(classificationService.getById(id));
    }

    @GetMapping("/subMenu/{id}")
    public ResponseEntity<?> subMenu(@PathVariable String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/subMenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService.getById(id));
    }

    @PostMapping("/edit/classification/name/{id}")
    public ResponseEntity<?> editClassificationName(@PathVariable String id,
                                                    @RequestBody @NotNull Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/classification/name/{id}").toUriString());
        Classification classification = classificationService.getById(id);
        return ResponseEntity.created(uri).body(classificationService.editName(classification, name.getName()));

    }

    @PostMapping("/edit/subMenu/name/{classificationId}/{subMenuId}")
    public ResponseEntity<?> editSubMenuName(@PathVariable String classificationId,
                                             @PathVariable String subMenuId,
                                             @RequestBody @NotNull Name name) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/subMenu/name/{id}/{subMenuId}").toUriString());
        Classification classification = classificationService.getById(classificationId);
        SubMenu subMenu = subMenuService.getById(subMenuId);
        return ResponseEntity.created(uri).body(subMenuService
                .editName(classification, subMenu, subMenuId, name.getName()));
    }

    @PostMapping("/edit/subMenu/item/name/{id}")
    public ResponseEntity<?> editSubmenuItemName(@PathVariable String id,
                                                 @RequestBody @NotNull NewItemName item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/edit/subMenu/item/name/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService
                .editItemName(id, item.getName(), item.getNewName(), item.getLink()));
    }

    @PostMapping("/edit/classification/item/name/{id}")
    public ResponseEntity<?> editClassificationItemName(@PathVariable String id,
                                                        @RequestBody @NotNull NewItemName item) {
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
                .deleteById(id));
    }

    @DeleteMapping("/delete-data/subMenu/{classificationId}/{subMenuId}")
    public ResponseEntity<?> deleteSubmenu(@PathVariable String classificationId,
                                           @PathVariable String subMenuId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-data/subMenu/{id}").toUriString());
        return ResponseEntity.created(uri).body(subMenuService
                .deleteByIdClassification(classificationId, subMenuId));
    }

    @PostMapping("/delete-item/classification/{classificationId}")
    public ResponseEntity<?> deleteItemClassification(@PathVariable String classificationId,
                                                      @RequestBody @NotNull ItemLink item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/classification/{classificationId}").toUriString());
        Classification classification = classificationService.getById(classificationId);
        return ResponseEntity.created(uri).body(
                itemService.deleteItem(classification, item.getLink(), item.getName(), classificationId));
    }

    @PostMapping("/delete-item/subMenu/{subMenuId}")
    public ResponseEntity<?> deleteItemSubmenu(@PathVariable String subMenuId,
                                               @RequestBody @NotNull ItemLink item) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/delete-item/subMenu/{subMenuId}").toUriString());
        SubMenu subMenu = subMenuService.getById(subMenuId);
        return ResponseEntity.created(uri).body(
                itemService.deleteItem(subMenu, item.getLink(), item.getName(), subMenuId));
    }

    @PostMapping("/subMenu/create")
    public ResponseEntity<?> createSubMenu(@RequestBody @NotNull NewEmptySubMenu emptySubMenu) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/subMenu/create").toUriString());
        return ResponseEntity.created(uri).body(
                subMenuService.createNew(emptySubMenu.getClassification(), emptySubMenu.getName()));
    }

    @DeleteMapping("/tables/clear")
    public ResponseEntity<?> deleteTables() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/tables/clear").toUriString());
        subMenuService.deleteTableEntities();
        classificationService.deleteTableEntities();
        return ResponseEntity.created(uri).body("Database table entities deleted");
    }
}

