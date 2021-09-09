package com.ultrasound.app.repo;

import com.ultrasound.app.model.ERole;
import com.ultrasound.app.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface RoleRepo extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);

}
