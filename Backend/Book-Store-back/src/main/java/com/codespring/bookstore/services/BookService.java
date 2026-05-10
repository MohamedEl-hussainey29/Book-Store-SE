package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.BookDto;
import com.codespring.bookstore.entities.Book;
import com.codespring.bookstore.entities.Category;
import com.codespring.bookstore.mappers.BookMapper;
import com.codespring.bookstore.repositories.BookRepository;
import com.codespring.bookstore.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    public BookDto getBookById(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return bookMapper.toDto(book);
    }

    public List<BookDto> getBooksByCategory(Integer categoryId) {
        return bookRepository.findByCategoryId(categoryId)
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    public List<BookDto> searchBooks(String title) {
        return bookRepository.findByTitleContaining(title)
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    public BookDto createBook(BookDto dto, MultipartFile file) {

        if (bookRepository.existsByTitle(dto.getTitle())) {
            throw new RuntimeException("Book with this title already exists!");
        }

        Category category = categoryRepository.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found : " + dto.getCategoryName()));

        Book book = bookMapper.toEntity(dto);
        book.setCategory(category);
        book.setDate(LocalDate.now());

        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDirectory = Paths.get("uploads/books");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }

                String originalFilename = file.getOriginalFilename();
                String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                book.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            book.setImage(null);
        }

        return bookMapper.toDto(bookRepository.save(book));
    }

    public List<BookDto> getBooksByCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryName));
        return bookRepository.findByCategoryId(category.getId())
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }
    public BookDto updateBook(Integer id, BookDto dto, MultipartFile file) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        String oldImage = book.getImage();

        bookMapper.updateEntity(dto, book);

        if (dto.getCategoryName() != null) {
            Category category = categoryRepository.findByName(dto.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found : " + dto.getCategoryName()));
            book.setCategory(category);
        }

        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDirectory = Paths.get("uploads/books");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                book.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            book.setImage(oldImage);
        }

        return bookMapper.toDto(bookRepository.save(book));
    }

    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }






}