package com.example.backend;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    private static final String BASE64_SECRET = "c2RoZnUyMyomJSheJiQlIyReJSZeKiYoKSYqXiYlXiRvZ2Zkc2hqZ2V3ZmhxZ2V3b2ZnaGdoZzEyM2gxMmdoM2cya2poNGcK"; // replace with your generated key
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(BASE64_SECRET));

    public String generateToken(String email, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(SECRET_KEY)
                .compact();
    }

    public String validateTokenAndRetrieveSubject(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
