package com.surajproject.AMS.controller;

import com.surajproject.AMS.entity.Passenger;
import com.surajproject.AMS.repositories.PassengerRepository;
import com.surajproject.AMS.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private PassengerRepository passengerRepository;

    @PostMapping("/booking/{bookingId}/passenger")
    public Passenger addpassenger(@PathVariable Long bookingId, @RequestBody Passenger passenger){
        return passengerService.addPassenger(bookingId,passenger);
    }

    @GetMapping("/booking/{bookingId}/passenger")
    public List<Passenger> getpassenger(@PathVariable Long bookingId){
        return passengerRepository.findByBookingId(bookingId);
    }
}
