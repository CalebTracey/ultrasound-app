package com.ultrasound.app.controller;

import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class HealthCheckController {

    @GetMapping(path = "/")
    public String sayHello() {
        return "hello";
    }
}
