// src/main/java/com/codespring/bookstore/models/LoginStat.java
package com.codespring.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "login_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LoginStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private LocalDate date;

    private int count;
}