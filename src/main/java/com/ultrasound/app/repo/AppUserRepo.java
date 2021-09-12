package com.ultrasound.app.repo;

import com.ultrasound.app.model.user.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AppUserRepo extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
