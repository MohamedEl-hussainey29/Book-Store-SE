package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrderId(Integer orderId);

    List<OrderItem> findByBookId(Integer bookId);
}