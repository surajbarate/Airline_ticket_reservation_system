package com.surajproject.AMS.service;


import com.surajproject.AMS.entity.User;
import com.surajproject.AMS.repositories.UserRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {
    @Autowired
    private UserRepositories userRepositoy;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User Register(User user){
        if(userRepositoy.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already exist");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }


        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepositoy.save(user);
    }

    public User Login(String email,String password){
        User user=userRepositoy.findByEmail(email)
                .orElseThrow(()->new RuntimeException("user not found"));

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Wrong password");
        }
        return user;
    }

}
