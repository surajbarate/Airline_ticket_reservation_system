package com.surajproject.AMS.controller;

import com.surajproject.AMS.entity.Flight;
import com.surajproject.AMS.repositories.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/flight")
public class FlightController {

    @Autowired
    private FlightRepository flightRepository;


    @GetMapping("/search")
    public List<Flight> searchflight(@RequestParam String source,@RequestParam String destination, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate travelDate){
        //RequestParam is used when we need to get data from URL and then pass to method that data contain after ?
        //pathvariable is used when we want direct data
        return flightRepository.findBySourceAndDestinationAndTravelDate(source,destination, travelDate);
    }

    @GetMapping("/source")
    public List<String> getsource(){
        return flightRepository.findDistinctSource();
    }

    @GetMapping("/destination")
    public List<String> getdestination(){
        return flightRepository.findDistinctDestination();
    }





}
