package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.OrderDto;
import com.codespring.bookstore.entities.*;
import com.codespring.bookstore.mappers.OrderMapper;
import com.codespring.bookstore.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public List<OrderDto> getOrdersByUser(Integer userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @Transactional
    public OrderDto getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return orderMapper.toDto(order);
    }

    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public OrderDto placeOrder(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDate.now());
        order.setStatus("pending");

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            if (book.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for book: " + book.getTitle());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setSubtotal(cartItem.getSubtotal());
            order.getOrderItems().add(orderItem);

            book.setQuantity(book.getQuantity() - cartItem.getQuantity());
            bookRepository.save(book);

            total = total.add(cartItem.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotal(total);
        orderRepository.save(order);

        cartItemRepository.deleteByCartId(cart.getId());

        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Integer id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderMapper.toDto(orderRepository.save(order));
    }
}