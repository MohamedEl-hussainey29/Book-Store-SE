package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.OrderDto;
import com.codespring.bookstore.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                UserMapper.class,
                OrderItemMapper.class
        }
)
public interface OrderMapper {

    // Order entity → OrderDto
    @Mapping(target = "user", source = "user")
    OrderDto toDto(Order order);

    // OrderDto → Order entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    Order toEntity(OrderDto dto);
}