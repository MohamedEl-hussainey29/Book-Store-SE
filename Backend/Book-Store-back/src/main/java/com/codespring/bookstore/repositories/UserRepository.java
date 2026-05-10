package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByEmail(String email);


    boolean existsByEmail(String email);


    java.util.List<User> findByRole(String role);

    long countByRole(String role);
}