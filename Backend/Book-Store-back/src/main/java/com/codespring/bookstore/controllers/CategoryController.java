package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.CategoryDto;
import com.codespring.bookstore.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // GET /api/categories/1
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // POST /api/categories
    @PreAuthorize("hasRole('ADMIN')") // الحماية بتاعتك
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> createCategory(
            @ModelAttribute CategoryDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        CategoryDto savedCategory = categoryService.createCategory(dto, file);
        return ResponseEntity.ok(savedCategory);
    }


   

    // PUT /api/categories/1
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Integer id,
            @ModelAttribute CategoryDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        CategoryDto updatedCategory = categoryService.updateCategory(id, dto, file);
        return ResponseEntity.ok(updatedCategory);
    }

    // DELETE /api/categories/1
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}