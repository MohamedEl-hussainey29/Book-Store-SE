package com.codespring.bookstore.entities;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "favourites")
public class Favourite {

    @EmbeddedId
    private FavouriteId id;

    @ManyToOne
    @MapsId("custId")
    @JoinColumn(name = "cust_id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "user = " + user.getId() + ", " +
                "book = " + book.getId() + ")";
    }
}