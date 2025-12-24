package com.surajproject.AMS.repositories;

import com.surajproject.AMS.entity.Booking;
import com.surajproject.AMS.entity.Passenger;
import com.surajproject.AMS.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking,Long> {
    Optional<Booking> findById(Long id);

    List<Booking> findByUserAndStatus(User user,String status);

}
