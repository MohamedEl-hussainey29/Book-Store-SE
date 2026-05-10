package com.codespring.bookstore.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDto {

    private Integer id;

    @NotNull(message = "Book is required")
    private Integer bookId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity cannot exceed 100")
    private Integer quantity;

    private BigDecimal price;
    private BigDecimal subtotal;
}