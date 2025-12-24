package com.surajproject.AMS.controller;

import com.surajproject.AMS.entity.User;
import com.surajproject.AMS.jwt.JwtUtil;
import com.surajproject.AMS.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authservice;

    @Autowired
    private JwtUtil jwtutil;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return authservice.Register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> request){
        String email=request.get("email");
        String pass=request.get("password");

        if (email == null || pass == null) {
            return ResponseEntity.badRequest().body(null);
        }

        User user=authservice.Login(email,pass);

        String token=jwtutil.generateToken(user.getEmail());
        user.setPassword(null);

        Map<String, Object> response=new HashMap<>();
        response.put("user",user);
        response.put("token",token);

        return ResponseEntity.ok(response);
    }


}
