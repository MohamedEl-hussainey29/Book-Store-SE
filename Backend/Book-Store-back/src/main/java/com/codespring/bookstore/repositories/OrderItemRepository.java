package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Find all items in an order
    List<OrderItem> findByOrderId(Integer orderId);

    // Find all orders that contain a specific book
    List<OrderItem> findByBookId(Integer bookId);
}