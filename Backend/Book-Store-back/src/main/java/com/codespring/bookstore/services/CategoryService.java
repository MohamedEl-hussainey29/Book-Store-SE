package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.CategoryDto;
import com.codespring.bookstore.entities.Category;
import com.codespring.bookstore.mappers.CategoryMapper;
import com.codespring.bookstore.repositories.BookRepository;
import com.codespring.bookstore.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Autowired
    private BookRepository bookRepository;

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // Get all categories
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> {
                    // 1. نحول الـ Entity لـ DTO باستخدام المابر بتاعك
                    CategoryDto dto = categoryMapper.toDto(category);

                    // 2. نجيب عدد الكتب للقسم ده ونحطه في الـ DTO
                    int count = bookRepository.countByCategoryId(category.getId());
                    dto.setBookCount(count);

                    // 3. نرجع الـ DTO النهائي
                    return dto;
                })
                .toList();
    }
    // Get category by id
    public CategoryDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));


        CategoryDto dto = categoryMapper.toDto(category);

        int count = bookRepository.countByCategoryId(category.getId());
        dto.setBookCount(count);

        return dto;
    }

    // Create category
    public CategoryDto createCategory(CategoryDto dto, MultipartFile file) {
        // 1. نتأكد إن مفيش قسم بنفس الاسم
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Category already exists: " + dto.getName());
        }

        // 2. نحول الـ DTO لـ Entity
        Category category = categoryMapper.toEntity(dto);

        // 3. نعالج الصورة لو الفرونت إند باعتها
        if (file != null && !file.isEmpty()) {
            try {
                // صلحنا اسم الفولدر لـ categories
                Path uploadDirectory = Paths.get("uploads/categories");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }

                String originalFilename = file.getOriginalFilename();
                String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // نحفظ اسم الصورة في الأوبجيكت
                category.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            // لو مبعتش صورة
            category.setImage(null);
        }

        // 4. نحفظ في الداتا بيز ونرجع الـ DTO
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    // Update category
    public CategoryDto updateCategory(Integer id, CategoryDto dto, MultipartFile file) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        String oldImage = category.getImage();

        categoryMapper.updateEntity(dto, category);

        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDirectory = Paths.get("uploads/categories");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                category.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            category.setImage(oldImage);
        }

        return categoryMapper.toDto(categoryRepository.save(category));
    }

    // Delete category
    public void deleteCategory(Integer id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: " + id
                        )
                );

        if (!category.getBooks().isEmpty()) {
            throw new RuntimeException(
                    "Cannot delete category because it contains books"
            );
        }

        categoryRepository.delete(category);
    }
}