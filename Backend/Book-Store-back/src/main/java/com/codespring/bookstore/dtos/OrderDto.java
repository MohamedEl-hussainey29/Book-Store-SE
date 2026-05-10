package com.codespring.bookstore.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto {

    private Integer id;

    private UserDto user;

    private LocalDate date;

    private String status;

    private BigDecimal total;

    private List<OrderItemDto> orderItems;
}