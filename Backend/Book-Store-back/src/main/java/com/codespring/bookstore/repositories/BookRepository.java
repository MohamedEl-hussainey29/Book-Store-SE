package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    // Find books by category
    List<Book> findByCategoryId(Integer categoryId);

    // Find books by author
    List<Book> findByAuthor(String author);

    // Find books by status (available, out of stock)
    List<Book> findByStatus(String status);


    List<Book> findByTitleContaining(String title);

    boolean existsByTitle(String title);

    int countByCategoryId(Integer categoryId);


}