package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.OrderItemDto;
import com.codespring.bookstore.entities.OrderItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface OrderItemMapper {

    // OrderItem entity → OrderItemDto
    @Mapping(target = "book", source = "book")
    OrderItemDto toDto(OrderItem orderItem);

    // OrderItemDto → OrderItem entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    OrderItem toEntity(OrderItemDto dto);
}