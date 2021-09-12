package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.CategoryNotFoundException;
import com.ultrasound.app.exceptions.ClassificationNotFoundException;
import com.ultrasound.app.model.data.Category;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public List<String> saveAllByName(List<String> names, String classificationName) {

        List<String> retVal = names.stream().map(name ->
                categoryRepo.save(new Category(name, classificationName)).getId()).collect(Collectors.toList());

        return retVal;
    }

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
        return category.getId();
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
        return categoryRepo.save(category).getId();
    }
}
