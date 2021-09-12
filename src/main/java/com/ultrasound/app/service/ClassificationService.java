package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;
import org.springframework.data.mongodb.core.MongoOperations;

import javax.management.Query;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface ClassificationService {

    Map<String, List<Classification>> getDuplicatesMap(List<Classification> personList);
    List<Classification> getDuplicates(List<Classification> classifications);
    void saveAll(List<Classification> classifications);
    Classification checkIfClassificationExists(String classificationName);
    List<Classification> all();
    List<Classification> getAllByName(String name);
    Classification getClassificationById(String id);
    Classification getClassificationByName(String name);
    String getClassificationIdByName(String name);
    String save(Classification classification);
//    Set<String> getCategories(String id);
//    void addCategories(String id, Set<String> categories);

}
