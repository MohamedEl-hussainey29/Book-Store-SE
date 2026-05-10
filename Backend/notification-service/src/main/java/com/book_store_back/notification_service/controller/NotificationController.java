package com.book_store_back.notification_service.controller;

import com.book_store_back.notification_service.DTO.NotificationRequest;
import com.book_store_back.notification_service.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        emailService.sendSimpleMessage(request.getToEmail(), request.getSubject(), request.getBody());

        emailService.saveLog(request);

        return ResponseEntity.ok("Notification sent and logged successfully!");
    }
}