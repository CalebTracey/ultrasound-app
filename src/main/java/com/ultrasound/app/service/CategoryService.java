package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;

import java.util.List;
import java.util.Set;

public interface CategoryService {

    List<String> saveAllByName(List<String> names, String classificationName);
//    List<Category> findDuplicates(String name);
//    List<String> saveAll(List<Category> categories);
    Category checkIfCategoryExists(String name);
    String getCategoryIdByName(String name);
    List<Category> all();
    Category getCategoryById(String id);
    Category getCategoryByName(String name);
    String save(Category category);


}
