package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCartId(Integer cartId);

    Optional<CartItem> findByCartIdAndBookId(Integer cartId, Integer bookId);

    boolean existsByCartIdAndBookId(Integer cartId, Integer bookId);

    void deleteByCartId(Integer cartId);
}