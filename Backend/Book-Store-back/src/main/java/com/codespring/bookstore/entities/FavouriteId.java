package com.codespring.bookstore.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class FavouriteId implements Serializable {

    @Column(name = "cust_id")
    private Integer custId;

    @Column(name = "book_id")
    private Integer bookId;
}