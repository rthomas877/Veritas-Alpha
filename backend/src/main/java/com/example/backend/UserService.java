package com.example.backend;

import com.example.backend.*;
import com.example.backend.User;
import com.example.backend.UserRepository;
import com.example.backend.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired private UserRepository repo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwt;

    public ResponseEntity<?> register(UserDTO dto) {
        if (repo.findByEmail(dto.email).isPresent())
            return ResponseEntity.badRequest().body("Email already exists");

        // creates new user instance
        User user = new User();
        user.setName(dto.name);
        user.setEmail(dto.email);
        user.setPassword(encoder.encode(dto.password));
        repo.save(user); // saves user to db

        return ResponseEntity.ok("User registered");
    }

    public ResponseEntity<?> login(LoginDTO dto) {
        Optional<User> user = repo.findByEmail(dto.email);
        if (user.isPresent() && encoder.matches(dto.password, user.get().getPassword())) { // if user entered correct password for this email
            String token = jwt.generateToken(user.get().getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login");
    }
}
