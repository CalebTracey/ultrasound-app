package com.ultrasound.app.service;

import com.ultrasound.app.model.user.AppUser;
import com.ultrasound.app.repo.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    @Autowired
    private AppUserRepo userRepo;

    public List<AppUser> all(){
        return userRepo.findAll();
    }
    public void save(AppUser user) {
        userRepo.save(user);
    }

}
