package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.BookDto;
import com.codespring.bookstore.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }



    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> searchBooks(@RequestParam String title) {
        return ResponseEntity.ok(bookService.searchBooks(title));
    }
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<BookDto>> getBooksByCategory(@PathVariable String categoryName) {
        return ResponseEntity.ok(bookService.getBooksByCategory(categoryName));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookDto> createBook(
            @ModelAttribute BookDto bookDto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        BookDto savedBook = bookService.createBook(bookDto, file);
        return ResponseEntity.ok(savedBook);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookDto> updateBook(
            @PathVariable Integer id,
            @ModelAttribute BookDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        return ResponseEntity.ok(bookService.updateBook(id, dto, file));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }




}