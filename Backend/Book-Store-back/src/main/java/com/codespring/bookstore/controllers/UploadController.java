package com.codespring.bookstore.controllers;

import com.codespring.bookstore.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

        // 1. نبعت الصورة للسيرفيس تحفظها وتجيب مسارها
        String imagePath = fileStorageService.storeFile(file);

        // 2. نرجع المسار في شكل JSON علشان بتاع الفرونت يعرف يقرأه بسهولة
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imagePath);

        return ResponseEntity.ok(response);
    }
}