package com.surajproject.AMS.controller;


import com.surajproject.AMS.entity.Booking;
import com.surajproject.AMS.entity.User;
import com.surajproject.AMS.repositories.BookingRepository;
import com.surajproject.AMS.repositories.UserRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepositories userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/profile")
    public User getprofile(){
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

    }

    @GetMapping("/showticket")
    public List<Booking> showticket(){
        String email=SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserAndStatus(user,"CONFIRMED");
    }

    @GetMapping("/showticket/cancel")
    public List<Booking> showcancelticket(){
        String email=SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("user not found"));

        return bookingRepository.findByUserAndStatus(user,"CANCELLED");
    }

}
