package com.ultrasound.app.repo;

import com.ultrasound.app.model.data.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepo extends MongoRepository<Category, String> {
    Optional<Category> findByName(String name);
    Optional<Category> findById(String id);
    Boolean existsByName(String name);
    Optional<List<Category>> findAllByName(String name);
}
