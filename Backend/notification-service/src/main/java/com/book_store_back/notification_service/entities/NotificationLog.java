package com.book_store_back.notification_service.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String messageBody;

    private LocalDateTime sentAt;

    // Constructors (فاضي وواحد بياخد الداتا)
    public NotificationLog() {}

    public NotificationLog(String recipientEmail, String subject, String messageBody) {
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.messageBody = messageBody;
        this.sentAt = LocalDateTime.now(); // بياخد وقت الإرسال أوتوماتيك
    }

    // متنساش تعمل الـ Getters والـ Setters هنا
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ... باقي الـ Getters و الـ Setters
}