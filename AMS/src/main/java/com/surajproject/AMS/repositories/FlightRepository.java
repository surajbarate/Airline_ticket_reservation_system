package com.surajproject.AMS.repositories;

import com.surajproject.AMS.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

//Flight is the entity class
//Long is type of primary key that's ID in entity
//JpaRepositoy gives or provides method like CRUD opertions,findall(),saveall() etc..
//so JpaRepositary is better that CRUDrepository that was used in userRepositoy...
public interface FlightRepository extends JpaRepository<Flight,Long> {
    List<Flight> findBySourceAndDestinationAndTravelDate(
            String source,
            String destination,
            LocalDate travelDate
    );
    //this is the meaning of that function means:
    //“Fetch all Flight records where
    //source = ? AND destination = ? AND travelDate = ?”

    //Return only unique values (no duplicates)
    //Flight means class name of entity
    //this crete
    @Query("SELECT DISTINCT f.source FROM Flight f")
    List<String> findDistinctSource();

    @Query("SELECT DISTINCT f.destination FROM Flight f")
    List<String> findDistinctDestination();
}
