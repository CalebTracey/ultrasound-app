package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ClassificationNotFoundException;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.repo.ClassificationRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Slf4j
@Service
public class ClassificationServiceImpl implements ClassificationService {

    @Autowired
    private ClassificationRepo classificationRepo;

    @Autowired
    private SubMenuServiceImpl subMenuService;

    @Override
    public Boolean subMenuExists(String id, String subMenu) {
        Predicate<String> matchThisSubMenu = String -> String.equals(subMenu);
        Classification classification = classificationRepo.findById(id).orElseThrow(
                () -> new ClassificationNotFoundException(id));
        return classification.getSubMenus().keySet().stream().anyMatch(matchThisSubMenu);
    }

    @Override
    public void insert(Classification classification) {
        classificationRepo.insert(classification);
    }

    @Override
    public Classification getClassificationByName(String name) {
        return classificationRepo.findByName(name).orElseThrow(
                () -> new ClassificationNotFoundException(name));
    }

    @Override
    public Boolean classificationExists(String classification) {
        return classificationRepo.existsByName(classification);
    }

    public List<Classification> all() {
        return classificationRepo.findAll();
    }

    @Override
    public Classification getById(String id) {
        return classificationRepo.findById(id)
                .orElseThrow(() -> new ClassificationNotFoundException(id));
    }

    public String save(Classification classification) {
        log.info("Saving classification: {}", classification.getName());
        return classificationRepo.save(classification).get_id();
    }

    @Override
    public String updateClassificationName(String id, String name) {
        Classification classification = getById(id);
        String origName = classification.getName();
        classification.setName(name);
        log.info("Changing Classification name {} to {}",origName, name);
        classificationRepo.save(classification);
        return "Changed Classification name " + origName + " to " + name;
    }

    @Override
    public String updateSubMenuName(String classificationId, String subMenuId, String name) {
        Classification classification = getById(classificationId);
        SubMenu subMenu = subMenuService.getById(subMenuId);
        String origName = subMenu.getName();
        // update the name of the submenu in the classification
        Map<String, String> subMenus = classification.getSubMenus();
        subMenus.put(name, subMenuId);
        subMenus.remove(origName);
        classification.setSubMenus(subMenus);
        classificationRepo.save(classification);
        // update the name of the submenu object in the database
        StringBuilder stringBuilder = new StringBuilder();
        subMenu.setName(name);
        // update item titles
        subMenu.getItemList().forEach(listItem -> {
            stringBuilder.setLength(0);
            stringBuilder.append(classification.getName()).append(" ").append(name).append(" ").append(listItem.getName());
            listItem.setTitle(stringBuilder.toString());
        });
        stringBuilder.setLength(0);
        log.info("Changing Submenu name {} to {} in Classification: {}",origName, name, classification.getName());
        subMenuService.saveReturnName(subMenu);
        stringBuilder.append("Changed Submenu name ").append(origName).append(" to ").append(name);
        return stringBuilder.toString();
    }

    @Override
    public String delete(String id) {
        AtomicInteger count = new AtomicInteger(0);
        Classification classification = getById(id);
        String name = classification.getName();
        Map<String, String> subMenus = classification.getSubMenus();
        subMenus.values().forEach(key -> {
            subMenuService.deleteById(key);
            count.getAndIncrement();
        });
        log.info("Deleting Classification {} and {} submenus", name, count);
        classificationRepo.delete(classification);
        return "Deleted Classification " + name + " and " + count + "submenus";
    }

    @Override
    public void deleteSubMenu(String classificationId, String subMenuId) {
        Classification classification = getById(classificationId);
        String name = classification.getName();
        String subName = subMenuService.getById(subMenuId).getName();
        Map<String, String> subMenus = classification.getSubMenus();
        try {
            subMenus.remove(subName, subMenuId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}