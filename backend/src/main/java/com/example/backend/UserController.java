package com.example.backend;

import com.example.backend.*;
import com.example.backend.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired private UserService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO dto) {
        return service.register(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        return service.login(dto);
    }
}
