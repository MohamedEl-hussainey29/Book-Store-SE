package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // Find category by name
    Optional<Category> findByName(String name);

    // Check if category name already exists
    boolean existsByName(String name);
}