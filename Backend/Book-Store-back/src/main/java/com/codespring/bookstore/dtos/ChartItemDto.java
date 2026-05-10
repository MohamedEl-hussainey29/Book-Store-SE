package com.codespring.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChartItemDto {

    //Day name
    private String label;

    //num of orders
    private long value;
}