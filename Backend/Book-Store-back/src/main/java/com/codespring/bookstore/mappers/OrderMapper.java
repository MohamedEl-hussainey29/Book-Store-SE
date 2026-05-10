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

    @Mapping(target = "user", source = "user")
    OrderDto toDto(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    Order toEntity(OrderDto dto);
}