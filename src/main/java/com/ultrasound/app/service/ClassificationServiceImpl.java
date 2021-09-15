package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ClassificationNotFoundException;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.repo.ClassificationRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;

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

    public String save(Classification classification) {
        log.info("Saving classification: {}", classification.getName());
        return classificationRepo.save(classification).get_id();
    }

}