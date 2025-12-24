package com.surajproject.AMS.service;

import com.surajproject.AMS.entity.Booking;
import com.surajproject.AMS.entity.Passenger;
import com.surajproject.AMS.repositories.BookingRepository;
import com.surajproject.AMS.repositories.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PassengerService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    public Passenger addPassenger(Long booking_id,Passenger passenger){

        Booking booking=bookingRepository.findById(booking_id)
                .orElseThrow(()->new RuntimeException("Booking not found"));

        passenger.setBooking(booking);

        return passengerRepository.save(passenger);
    }
}
