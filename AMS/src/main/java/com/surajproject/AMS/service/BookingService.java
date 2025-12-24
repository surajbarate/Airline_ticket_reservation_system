package com.surajproject.AMS.service;


import com.surajproject.AMS.entity.Booking;
import com.surajproject.AMS.entity.Flight;
import com.surajproject.AMS.entity.User;
import com.surajproject.AMS.repositories.BookingRepository;
import com.surajproject.AMS.repositories.FlightRepository;
import com.surajproject.AMS.repositories.UserRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepositories userRepository;

    public Booking createBooking(Long flightId) {



        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        System.out.println("Authenticated email: '" + email + "'");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));



        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingTime(LocalDateTime.now());
        booking.setPrice(flight.getPrice());
        booking.setStatus("CREATED");

        return bookingRepository.save(booking);

    }

    public Booking confirmBooking(Long id){
        Booking booking=bookingRepository.findById(id)
                .orElseThrow(()->new RuntimeException("booking not found"));

        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id){
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();


        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        Booking booking=bookingRepository.findById(id)
                .orElseThrow(()->new RuntimeException("booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        if("CANCELLED".equals(booking.getStatus())){
            throw new RuntimeException("ticket is already cancelled");
        }

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}
