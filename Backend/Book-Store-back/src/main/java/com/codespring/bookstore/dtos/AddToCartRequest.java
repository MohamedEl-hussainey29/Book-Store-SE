package com.codespring.bookstore.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddToCartRequest {

    @NotNull(message = "Book is required")
    private Integer bookId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity cannot exceed 100")
    private Integer quantity;
}