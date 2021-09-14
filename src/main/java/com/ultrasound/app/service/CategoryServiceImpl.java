package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.CategoryNotFoundException;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    private CategoryRepo categoryRepo;


    @Override
    public Map<String, List<Category>> getDuplicatesMap(List<Category> categories) {
        return categories.stream().collect(groupingBy(Category::uniqueAttributes));
    }

    @Override
    public List<Category> getDuplicates(List<Category> categories) {
        return getDuplicatesMap(categories).values().stream()
                .filter(duplicates -> duplicates.size() > 0)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    @Override
    public void saveAll(List<Category> categories) {
        categories.stream().forEach(category -> {
            if (categoryRepo.existsByName(category.getName())) {

            }
        });
        categoryRepo.saveAll(categories);
    }

    @Override
    public List<Category> removeDuplicates(List<Category> categories) {
        return getDuplicatesMap(categories).values().stream()
                .filter(duplicates -> duplicates.size() == 1)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }
//

    @Override
    public Category checkIfCategoryExists(String name) {
        Category category;
        if (categoryRepo.existsByName(name)) {
            String categoryId = getCategoryIdByName(name);
            category = getCategoryById(categoryId);

        } else {
            category = new Category();
            category.setName(name);
        }

        return category;
    }

    @Override
    public String getCategoryIdByName(String name) {
        Category category = categoryRepo.findByName(name).orElseThrow(
                () -> new CategoryNotFoundException(name)
        );
        return category.get_id();
    }

    @Override
    public List<Category> all() {
        return categoryRepo.findAll();
    }

    @Override
    public Category getCategoryById(String id) {
        return categoryRepo.findById(id).orElseThrow(
                () -> new CategoryNotFoundException(id));
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepo.findByName(name).orElseThrow(
                () -> new CategoryNotFoundException(name)
        );
    }

    @Override
    public String save(Category category) {
        return categoryRepo.save(category).get_id();
    }
}
