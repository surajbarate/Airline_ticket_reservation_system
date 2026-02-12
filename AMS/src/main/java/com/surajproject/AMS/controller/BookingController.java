package com.surajproject.AMS.controller;

import com.surajproject.AMS.entity.Booking;
import com.surajproject.AMS.entity.Passenger;
import com.surajproject.AMS.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/booking/{flight_id}")
    public Booking booking(@PathVariable Long flight_id, @RequestBody List<Passenger> passengers){
        return bookingService.createBooking(flight_id,passengers);
    }

//    @PutMapping("/booking/{booking_id}/confirm")
//    public Booking confbooking(@PathVariable Long booking_id){
//        return bookingService.confirmBooking(booking_id);
//    }

    @PutMapping("/booking/{booking_id}/cancel")
    public Booking cancelbooking(@PathVariable Long booking_id){
        return bookingService.cancelBooking(booking_id);
    }
}
