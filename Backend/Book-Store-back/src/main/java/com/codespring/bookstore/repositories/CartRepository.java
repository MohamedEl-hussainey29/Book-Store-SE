package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    // Find cart by user id
    Optional<Cart> findByUserId(Integer userId);

    // Check if user already has a cart
    boolean existsByUserId(Integer userId);
}