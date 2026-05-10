package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.StatisticsDto;
import com.codespring.bookstore.entities.Order;
import com.codespring.bookstore.repositories.BookRepository;
import com.codespring.bookstore.repositories.OrderRepository;
import com.codespring.bookstore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.codespring.bookstore.dtos.ChartItemDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class StatisticsService {

    @Autowired private UserRepository userRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private OrderRepository orderRepository;

    public StatisticsDto getDashboardStats() {
        StatisticsDto stats = new StatisticsDto();

        // 1. عد الكتب والأوردرات (ميثود جاهزة من JPA)
        stats.setTotalBooks(bookRepository.count());
        stats.setTotalOrders(orderRepository.count());

        // 2. عد اليوزرز والأدمنز بناءً على الصلاحية بتاعتهم
        // (عدل كلمة Role.USER و Role.ADMIN حسب ما إنت مسميهم عندك في الكود)
        stats.setTotalUsers(userRepository.countByRole("USER"));
        stats.setTotalAdmins(userRepository.countByRole("ADMIN"));

        return stats;
    }

    public List<ChartItemDto> getOrdersLast7Days() {

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        List<Order> recentOrders = orderRepository.findByDateAfter(sevenDaysAgo);
        Map<LocalDate, Long> dailyCounts = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dailyCounts.put(LocalDate.now().minusDays(i), 0L);
        }

        for (Order order : recentOrders) {
            LocalDate orderDate = order.getDate();
            if (dailyCounts.containsKey(orderDate)) {
                dailyCounts.put(orderDate, dailyCounts.get(orderDate) + 1);
            }
        }

        List<ChartItemDto> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE", Locale.ENGLISH);

        for (Map.Entry<LocalDate, Long> entry : dailyCounts.entrySet()) {
            String dayName = entry.getKey().format(formatter);
            chartData.add(new ChartItemDto(dayName, entry.getValue()));
        }

        return chartData;
    }
}