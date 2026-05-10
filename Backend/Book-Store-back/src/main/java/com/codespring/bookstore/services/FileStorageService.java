package com.codespring.bookstore.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // الفولدر اللي هنرمي فيه كل الصور
    private final String UPLOAD_DIR = "uploads/";

    public String storeFile(MultipartFile file) {
        try {
            // نتأكد إن الفولدر موجود، ولو مش موجود نكرته
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // نعمل اسم مميز للصورة عشان مفيش صورة تمسح التانية
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // نحفظ الصورة في السيرفر
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // نرجع المسار بتاعها للفرونت إند (علشان يحفظه في الداتا بيز بعدين)
            return UPLOAD_DIR + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
}