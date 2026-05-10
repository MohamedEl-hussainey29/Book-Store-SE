package com.codespring.bookstore.dtos;

import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {

    private Integer id;
    private Integer userId;
    private List<CartItemDto> cartItems;
}