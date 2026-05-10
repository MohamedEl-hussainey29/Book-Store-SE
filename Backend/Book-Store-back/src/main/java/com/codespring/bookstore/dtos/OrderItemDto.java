package com.codespring.bookstore.dtos;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemDto {

    private Integer id;

    private BookDto book;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal subtotal;
}