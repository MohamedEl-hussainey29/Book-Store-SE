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

    // Get all books
    public List<BookDto> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    // Get book by id
    public BookDto getBookById(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return bookMapper.toDto(book);
    }

    // Get books by category
    public List<BookDto> getBooksByCategory(Integer categoryId) {
        return bookRepository.findByCategoryId(categoryId)
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    // Search books by title
    public List<BookDto> searchBooks(String title) {
        return bookRepository.findByTitleContaining(title)
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    // Create book
    public BookDto createBook(BookDto dto, MultipartFile file) {

        // 1. نتأكد إن مفيش كتاب بنفس الاسم
        if (bookRepository.existsByTitle(dto.getTitle())) {
            throw new RuntimeException("Book with this title already exists!");
        }

        // 2. نجيب الكاتيجوري
        Category category = categoryRepository.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found : " + dto.getCategoryName()));

        Book book = bookMapper.toEntity(dto);
        book.setCategory(category);
        book.setDate(LocalDate.now());

        // 3. معالجة وحفظ الصورة (لو الفرونت إند باعتها)
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

                // نحفظ اسم الصورة الجديد في الأوبجيكت
                book.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            // لو مبعتش صورة، ممكن نسيبها فاضية
            book.setImage(null);
        }

        // 4. حفظ الكتاب بالصورة في الداتا بيز
        return bookMapper.toDto(bookRepository.save(book));
    }

    // Get books by category name
    public List<BookDto> getBooksByCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryName));
        return bookRepository.findByCategoryId(category.getId())
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }
    // Update book
    public BookDto updateBook(Integer id, BookDto dto, MultipartFile file) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        // 1. نحتفظ بالصورة القديمة في متغير عشان مضعش
        String oldImage = book.getImage();

        // 2. المابر بيحدث البيانات النصية
        bookMapper.updateEntity(dto, book);

        if (dto.getCategoryName() != null) {
            Category category = categoryRepository.findByName(dto.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found : " + dto.getCategoryName()));
            book.setCategory(category);
        }

        // 3. نعالج الصورة لو رفع صورة جديدة
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDirectory = Paths.get("uploads/books");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                book.setImage(uniqueFileName); // نحط الصورة الجديدة
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            // لو مرفعش صورة، نرجع الصورة القديمة مكانها
            book.setImage(oldImage);
        }

        return bookMapper.toDto(bookRepository.save(book));
    }

    // Delete book
    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }



// جوه الـ BookService:

//    public BookDto uploadBookImage(Integer bookId, MultipartFile file) {
//        try {
//            // 1. نتأكد إن الكتاب موجود أصلاً
//            Book book = bookRepository.findById(bookId)
//                    .orElseThrow(() -> new RuntimeException("Book not found"));
//
//            // 2. نعمل فولدر اسمه uploads/books لو مش موجود
//            Path uploadDirectory = Paths.get("uploads/books");
//            if (!Files.exists(uploadDirectory)) {
//                Files.createDirectories(uploadDirectory);
//            }
//
//            // 3. نولد اسم فريد للصورة علشان مفيش صورة تمسح التانية
//            String originalFilename = file.getOriginalFilename();
//            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;
//
//            // 4. نحفظ الملف الحقيقي في الفولدر
//            Path filePath = uploadDirectory.resolve(uniqueFileName);
//            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // 5. نحفظ اسم الصورة كـ String في الداتا بيز
//            book.setImage(uniqueFileName);
//            bookRepository.save(book);
//
//            return bookMapper.toDto(book);
//
//        } catch (Exception e) {
//            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
//        }
//    }


}