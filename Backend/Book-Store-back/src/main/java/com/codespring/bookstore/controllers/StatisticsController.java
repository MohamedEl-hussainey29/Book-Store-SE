package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.ChartItemDto;
import com.codespring.bookstore.dtos.StatisticsDto;
import com.codespring.bookstore.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // السطر ده مهم جداً علشان نمنع اليوزر العادي
    public ResponseEntity<StatisticsDto> getStatistics() {
        return ResponseEntity.ok(statisticsService.getDashboardStats());
    }

    @GetMapping("/chart/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChartItemDto>> getOrdersChart() {
        return ResponseEntity.ok(statisticsService.getOrdersLast7Days());
    }

}