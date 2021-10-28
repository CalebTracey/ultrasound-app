package com.ultrasound.app.controller.util;

import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class HealthCheckController {

    @GetMapping(path = "/")
    public String sayHello() {
        return "hello";
    }
}
