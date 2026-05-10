package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.AddToCartRequest;
import com.codespring.bookstore.dtos.CartDto;
import com.codespring.bookstore.dtos.CartItemDto;
import com.codespring.bookstore.dtos.UpdateCartItemRequest;
import com.codespring.bookstore.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /cart/1
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartDto> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // POST /api/cart/1/items
    @PostMapping("/{userId}/items")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartDto> addItemToCart(
            @PathVariable Integer userId,
            @RequestBody @Valid AddToCartRequest request) {   // changed
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    // DELETE /api/cart/1/items/2
    @DeleteMapping("/{userId}/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer bookId) {
        cartService.removeItemFromCart(userId, bookId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/cart/1/clear
    @DeleteMapping("/{userId}/clear")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> clearCart(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }



    // شكل اللينك هيكون مثلا: /cart/1/items/5
    @PutMapping("/{userId}/items/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartDto> updateItemQuantity(
            @PathVariable Integer userId,
            @PathVariable Integer bookId,
            @RequestBody @Valid UpdateCartItemRequest request) { // بناخد الكمية الجديدة من اللينك

        // لو الكمية بصفر أو أقل، ممكن نرمي إيرور أو نعتبرها عملية حذف
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        return ResponseEntity.ok(cartService.updateItemQuantity(userId, bookId, request.getQuantity()));
    }
}