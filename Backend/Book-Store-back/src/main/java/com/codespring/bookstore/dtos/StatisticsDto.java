package com.codespring.bookstore.dtos;
import lombok.Data;

@Data
public class StatisticsDto {

    private long totalUsers;

    private long totalAdmins;

    private long totalBooks;

    private long totalOrders;
}