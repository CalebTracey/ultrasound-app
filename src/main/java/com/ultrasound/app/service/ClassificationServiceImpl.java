package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ClassificationNotFoundException;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.repo.ClassificationRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;

@Slf4j
@Service
public class ClassificationServiceImpl implements ClassificationService {

    @Autowired
    private ClassificationRepo classificationRepo;


    @Override
    public Map<String, List<Classification>> getDuplicatesMap(List<Classification> classifications) {
        return classifications.stream().collect(groupingBy(Classification::uniqueAttributes));
    }

    @Override
    public List<Classification> getDuplicates(List<Classification> classifications) {
        return getDuplicatesMap(classifications).values().stream()
                .filter(duplicates -> duplicates.size() > 1)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    @Override
    public void saveAll(List<Classification> classifications) {
        log.info("Saving all classifications");
        classificationRepo.saveAll(classifications);
    }

    @Override
    public Classification checkIfClassificationExists(String classificationName) {
        Classification classification;
        if (classificationRepo.existsByName(classificationName)) {
            String classificationId = getClassificationIdByName(classificationName);
            classification = getClassificationById(classificationId);

        } else {
            classification = new Classification();
            classification.setName(classificationName);

        }

        return classification;
    }

    public List<Classification> all(){
        return classificationRepo.findAll();
    }

    @Override
    public List<Classification> getAllByName(String name) {
        return classificationRepo.findAllByName(name);
    }

    public Classification getClassificationById(String id) {
        return classificationRepo.findById(id).orElseThrow(
                () -> new ClassificationNotFoundException(id)
        );
    }

    @Override
    public Classification getClassificationByName(String name) {
        return classificationRepo.findByName(name).orElseThrow(
                ()-> new ClassificationNotFoundException(name)
        );
    }

    @Override
    public String getClassificationIdByName(String name) {
        Classification classification = classificationRepo.findByName(name).orElseThrow(
                () -> new ClassificationNotFoundException(name)
        );
        return classification.getId();
    }

    public String save(Classification classification){
        log.info("Saving classification: {}", classification.getName());
        return classificationRepo.save(classification).getId();
    }

//    @Override
//    public List<String> getCategories(String id) {
//        Classification classification = getClassificationById(id);
//        log.info("Getting categories for: {}", classification.getName());
//
//
//        return classification.getCategoryNames();
//    }
//
//    @Override
//    public void addCategories(String id, List<String> categories) {
//        Classification classification = getClassificationById(id);
//        log.info("Classification: {}\nAdding categories: {}", classification.getName(), categories);
//
//        classification.setCategoryNames(categories);
//    }

}
