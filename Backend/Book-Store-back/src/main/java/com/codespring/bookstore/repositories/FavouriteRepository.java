package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.Favourite;
import com.codespring.bookstore.entities.FavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, FavouriteId> {

    List<Favourite> findByUserId(Integer userId);

    List<Favourite> findByBookId(Integer bookId);

    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);

    void deleteByUserIdAndBookId(Integer userId, Integer bookId);
}