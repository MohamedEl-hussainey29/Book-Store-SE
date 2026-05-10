package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // Find all items in a cart
    List<CartItem> findByCartId(Integer cartId);

    // Find a specific book in a cart
    Optional<CartItem> findByCartIdAndBookId(Integer cartId, Integer bookId);

    // Check if a book already exists in a cart
    boolean existsByCartIdAndBookId(Integer cartId, Integer bookId);

    // Delete all items in a cart
    void deleteByCartId(Integer cartId);
}