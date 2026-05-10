package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.OrderDto;
import com.codespring.bookstore.dtos.UpdateOrderStatusRequest;
import com.codespring.bookstore.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // GET /api/orders
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET /api/orders/user/1
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // GET /api/orders/1
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // POST /api/orders/place/1
    @PostMapping("/place/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDto> placeOrder(@PathVariable Integer userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(userId));
    }

    // PATCH /api/orders/1/status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));    }
}