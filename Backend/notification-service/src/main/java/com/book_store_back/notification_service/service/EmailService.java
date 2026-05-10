package com.book_store_back.notification_service.service;

import com.book_store_back.notification_service.DTO.NotificationRequest;
import com.book_store_back.notification_service.entities.NotificationLog;
import com.book_store_back.notification_service.repository.NotificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationLogRepository logRepository;

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void saveLog(NotificationRequest request) {
        NotificationLog log = new NotificationLog(
                request.getToEmail(),
                request.getSubject(),
                request.getBody()
        );
        logRepository.save(log);
    }
}