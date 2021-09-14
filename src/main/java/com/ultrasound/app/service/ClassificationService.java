package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;

import java.util.List;
import java.util.Map;

public interface ClassificationService {

    List<Classification> removeDuplicates(List<Classification> classifications);
    Map<String, List<Classification>> getDuplicatesMap(List<Classification> personList);
    List<Classification> getDuplicates(List<Classification> classifications);
    void saveAll(List<Classification> classifications);
    Classification checkIfClassificationExists(String classificationName);
    List<Classification> all();
    Classification getClassificationById(String id);
    String getClassificationIdByName(String name);
    String save(Classification classification);

}
