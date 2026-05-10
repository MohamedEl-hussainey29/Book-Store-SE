package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Favourite;
import com.codespring.bookstore.entities.FavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, FavouriteId> {

    // Find all favourites by user
    List<Favourite> findByUserId(Integer userId);

    // Find all favourites by book
    List<Favourite> findByBookId(Integer bookId);

    // Check if a book is already in user's favourites
    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);

    // Delete a favourite by user and book
    void deleteByUserIdAndBookId(Integer userId, Integer bookId);
}