package com.book_store_back.notification_service.repository;

import com.book_store_back.notification_service.entities.NotificationLog; // اتأكد من مسار الـ Entity بتاعك
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
}