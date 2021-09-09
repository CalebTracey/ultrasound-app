package com.ultrasound.app.service;

import com.ultrasound.app.model.AppUser;
import com.ultrasound.app.repo.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    @Autowired
    private AppUserRepo userRepo;

    public List<AppUser> users(){
        return userRepo.findAll();
    }
}
