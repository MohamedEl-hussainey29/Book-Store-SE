package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.OrderItemDto;
import com.codespring.bookstore.entities.OrderItem;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-10T12:03:19+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Autowired
    private BookMapper bookMapper;

    @Override
    public OrderItemDto toDto(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemDto.OrderItemDtoBuilder orderItemDto = OrderItemDto.builder();

        orderItemDto.book( bookMapper.toDto( orderItem.getBook() ) );
        orderItemDto.id( orderItem.getId() );
        orderItemDto.price( orderItem.getPrice() );
        orderItemDto.quantity( orderItem.getQuantity() );
        orderItemDto.subtotal( orderItem.getSubtotal() );

        return orderItemDto.build();
    }

    @Override
    public OrderItem toEntity(OrderItemDto dto) {
        if ( dto == null ) {
            return null;
        }

        OrderItem.OrderItemBuilder orderItem = OrderItem.builder();

        orderItem.price( dto.getPrice() );
        orderItem.quantity( dto.getQuantity() );

        return orderItem.build();
    }
}
