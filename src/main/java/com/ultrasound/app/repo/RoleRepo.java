package com.ultrasound.app.repo;

import com.ultrasound.app.model.user.ERole;
import com.ultrasound.app.model.user.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepo extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);

}
