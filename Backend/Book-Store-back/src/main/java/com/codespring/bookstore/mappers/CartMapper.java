package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CartDto;
import com.codespring.bookstore.entities.Cart;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {

    @Mapping(target = "userId", source = "user.id")
    CartDto toDto(Cart cart);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    Cart toEntity(CartDto dto);
}