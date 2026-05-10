package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.FavouriteDto;
import com.codespring.bookstore.entities.Book;
import com.codespring.bookstore.entities.Favourite;
import com.codespring.bookstore.entities.FavouriteId;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.mappers.FavouriteMapper;
import com.codespring.bookstore.repositories.BookRepository;
import com.codespring.bookstore.repositories.FavouriteRepository;
import com.codespring.bookstore.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final FavouriteMapper favouriteMapper;

    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public List<FavouriteDto> getFavouritesByUser(Integer userId) {
        return favouriteRepository.findByUserId(userId)
                .stream()
                .map(favouriteMapper::toDto)
                .toList();
    }

    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public FavouriteDto addFavourite(Integer userId, Integer bookId) {
        if (favouriteRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new RuntimeException("Book already in favourites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));

        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(userId, bookId));
        favourite.setUser(user);
        favourite.setBook(book);

        return favouriteMapper.toDto(favouriteRepository.save(favourite));
    }

    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public void removeFavourite(Integer userId, Integer bookId) {
        if (!favouriteRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new RuntimeException("Favourite not found");
        }
        favouriteRepository.deleteByUserIdAndBookId(userId, bookId);
    }
}