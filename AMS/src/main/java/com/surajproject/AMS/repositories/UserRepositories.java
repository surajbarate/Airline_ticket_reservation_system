package com.surajproject.AMS.repositories;

import com.surajproject.AMS.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepositories extends CrudRepository<User,Long> {
    Optional<User> findByEmail(String email);
}
