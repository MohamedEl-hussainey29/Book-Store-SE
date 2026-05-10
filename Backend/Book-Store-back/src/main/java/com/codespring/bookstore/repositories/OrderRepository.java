package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Find all orders by user
    List<Order> findByUserId(Integer userId);

    // Find all orders by status
    List<Order> findByStatus(String status);

    // Find all orders by user and status
    List<Order> findByUserIdAndStatus(Integer userId, String status);

    List<Order> findByDateAfter(LocalDate date);


}