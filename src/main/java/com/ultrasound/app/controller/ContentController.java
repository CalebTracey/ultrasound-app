package com.ultrasound.app.controller;

import com.ultrasound.app.security.service.UserDetailsServiceImpl;
import com.ultrasound.app.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ContentController {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private AppUserService userService;

    @GetMapping("/all")
    public String allAccess() {
        return "Total Members: " + (long) userService.users().size();
    }

//    @GetMapping("/classifications")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    public ResponseEntity<List<VideoClassification>> userAccess() {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/classifications").toUriString());
//        return ResponseEntity.created(uri).body(classificationService.getClassifications());
//    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }

}
