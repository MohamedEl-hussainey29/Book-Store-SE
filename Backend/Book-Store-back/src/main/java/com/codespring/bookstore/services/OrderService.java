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

    // Get all orders (admin)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    // Get orders by user
    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public List<OrderDto> getOrdersByUser(Integer userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    // Get order by id
    @Transactional
//    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public OrderDto getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return orderMapper.toDto(order);
    }

    // Place order from cart
    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public OrderDto placeOrder(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Get cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        // Check cart is not empty
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDate.now());
        order.setStatus("pending");

        // Create order items from cart items
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            // Check book availability
            Book book = cartItem.getBook();
            if (book.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for book: " + book.getTitle());
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setSubtotal(cartItem.getSubtotal());
            order.getOrderItems().add(orderItem);

            // Update book quantity
            book.setQuantity(book.getQuantity() - cartItem.getQuantity());
            bookRepository.save(book);

            // Add to total
            total = total.add(cartItem.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotal(total);
        orderRepository.save(order);

        // Clear cart after order
        cartItemRepository.deleteByCartId(cart.getId());

        return orderMapper.toDto(order);
    }

    // Update order status (admin)
    @Transactional
    public OrderDto updateOrderStatus(Integer id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderMapper.toDto(orderRepository.save(order));
    }
}