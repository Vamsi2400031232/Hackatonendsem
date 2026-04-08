package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/test")
    public Map<String, String> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Spring Boot backend is up and running!");
        response.put("status", "success");
        return response;
    }
}
