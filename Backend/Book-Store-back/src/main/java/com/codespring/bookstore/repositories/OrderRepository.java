package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserId(Integer userId);

    List<Order> findByStatus(String status);

    List<Order> findByUserIdAndStatus(Integer userId, String status);

    List<Order> findByDateAfter(LocalDate date);


}