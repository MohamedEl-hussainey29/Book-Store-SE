package com.codespring.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "title", nullable = false , unique = true)
    private String title;

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "in stock";

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @OneToMany(mappedBy = "book", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    @OneToMany(mappedBy = "book", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToMany(mappedBy = "book", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @Builder.Default
    private List<Favourite> favourites = new ArrayList<>();

    @PreUpdate
    @PrePersist
    public void syncStatusWithQuantity() {
        if (quantity == null) quantity = 0;
        if (quantity <= 0) {
            status = "out of stock";
        } else {
            status = "in stock";
        }
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "title = " + title + ", " +
                "author = " + author + ", " +
                "price = " + price + ", " +
                "status = " + status + ")";
    }
}