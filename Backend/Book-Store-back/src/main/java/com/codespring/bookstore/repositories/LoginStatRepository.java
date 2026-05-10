// src/main/java/com/codespring/bookstore/repositories/LoginStatRepository.java
package com.codespring.bookstore.repositories;

import com.codespring.bookstore.entities.LoginStat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface LoginStatRepository extends JpaRepository<LoginStat, Long> {
    Optional<LoginStat> findByDate(LocalDate date);
}