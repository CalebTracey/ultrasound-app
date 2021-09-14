package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Category;

import java.net.URL;
import java.util.List;
import java.util.Map;

public interface CategoryService {

    void saveAll(List<Category> categories);
    List<Category> removeDuplicates(List<Category> categories);
    List<Category> getDuplicates(List<Category> categories);
    Map<String, List<Category>> getDuplicatesMap(List<Category> categories);
//    List<String> saveAllByName(List<String> names, String classificationName, List<URL> urls);
    Category checkIfCategoryExists(String name);
    String getCategoryIdByName(String name);
    List<Category> all();
    Category getCategoryById(String id);
    Category getCategoryByName(String name);
    String save(Category category);


}
