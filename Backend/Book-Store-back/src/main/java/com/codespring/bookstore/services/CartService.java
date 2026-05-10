package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.AddToCartRequest;
import com.codespring.bookstore.dtos.CartDto;
import com.codespring.bookstore.entities.Book;
import com.codespring.bookstore.entities.Cart;
import com.codespring.bookstore.entities.CartItem;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.mappers.CartMapper;
import com.codespring.bookstore.repositories.BookRepository;
import com.codespring.bookstore.repositories.CartItemRepository;
import com.codespring.bookstore.repositories.CartRepository;
import com.codespring.bookstore.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;
import java.math.BigDecimal;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public CartDto getCartByUserId(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        return cartMapper.toDto(cart);
    }


    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public CartDto addItemToCart(Integer userId, AddToCartRequest request) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found: " + request.getBookId()));

        if (book.getQuantity() == 0) {
            throw new RuntimeException("Book is out of stock");
        }

        if (request.getQuantity() > book.getQuantity()) {
            throw new RuntimeException("Not enough stock. Available: " + book.getQuantity());
        }

        if (cartItemRepository.existsByCartIdAndBookId(cart.getId(), book.getId())) {
            throw new RuntimeException("Book already in cart");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setBook(book);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setPrice(book.getPrice());

        subtotal = subtotal.add(book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

        cartItem.setSubtotal(subtotal);
        cartItemRepository.save(cartItem);

        return cartMapper.toDto(cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after save")));
    }

    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public void removeItemFromCart(Integer userId, Integer bookId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        CartItem cartItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
        cartItemRepository.delete(cartItem);
    }

    @Transactional
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public void clearCart(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        cartItemRepository.deleteByCartId(cart.getId());
    }




    @PreAuthorize("@securityChecks.isOwner(#userId)")
    @Transactional
    public CartDto updateItemQuantity(Integer userId, Integer bookId, Integer newQuantity) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        CartItem cartItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        Book book = cartItem.getBook();
        if (newQuantity > book.getQuantity()) {
            throw new RuntimeException("Not enough stock. Only " + book.getQuantity() + " available.");
        }

        cartItem.setQuantity(newQuantity);

        BigDecimal newSubtotal = book.getPrice().multiply(BigDecimal.valueOf(newQuantity));
        cartItem.setSubtotal(newSubtotal);

        cartItemRepository.save(cartItem);

        return cartMapper.toDto(cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after update")));
    }
}