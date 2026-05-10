package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.FavouriteDto;
import com.codespring.bookstore.services.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    // GET /api/favourites/user/1
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FavouriteDto>> getFavouritesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(favouriteService.getFavouritesByUser(userId));
    }

    // POST /api/favourites/1/books/2
    @PostMapping("/{userId}/books/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FavouriteDto> addFavourite(
            @PathVariable Integer userId,
            @PathVariable Integer bookId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(favouriteService.addFavourite(userId, bookId));
    }

    // DELETE /api/favourites/1/books/2
    @DeleteMapping("/{userId}/books/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> removeFavourite(
            @PathVariable Integer userId,
            @PathVariable Integer bookId) {
        favouriteService.removeFavourite(userId, bookId);
        return ResponseEntity.noContent().build();
    }
}