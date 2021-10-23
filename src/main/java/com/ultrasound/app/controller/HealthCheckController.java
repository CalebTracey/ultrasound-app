package com.ultrasound.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class HealthCheckController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String sayHello() {
        return "hello";
    }
}
