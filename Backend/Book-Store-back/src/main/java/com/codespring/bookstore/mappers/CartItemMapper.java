package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CartItemDto;
import com.codespring.bookstore.entities.CartItem;

import org.mapstruct.*;


@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface CartItemMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "subtotal", source = "subtotal")
    CartItemDto toDto(CartItem cartItem);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    CartItem toEntity(CartItemDto dto);
}