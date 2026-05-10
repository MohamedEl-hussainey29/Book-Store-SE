package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.OrderDto;
import com.codespring.bookstore.dtos.OrderItemDto;
import com.codespring.bookstore.entities.Order;
import com.codespring.bookstore.entities.OrderItem;
import com.codespring.bookstore.entities.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-07T23:27:55+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Override
    public OrderDto toDto(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderDto.OrderDtoBuilder orderDto = OrderDto.builder();

        orderDto.userId( orderUserId( order ) );
        orderDto.date( order.getDate() );
        orderDto.id( order.getId() );
        orderDto.orderItems( orderItemListToOrderItemDtoList( order.getOrderItems() ) );
        orderDto.status( order.getStatus() );
        orderDto.total( order.getTotal() );

        return orderDto.build();
    }

    @Override
    public Order toEntity(OrderDto dto) {
        if ( dto == null ) {
            return null;
        }

        Order.OrderBuilder order = Order.builder();

        order.date( dto.getDate() );
        order.status( dto.getStatus() );
        order.total( dto.getTotal() );

        return order.build();
    }

    private Integer orderUserId(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        Integer id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected List<OrderItemDto> orderItemListToOrderItemDtoList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItemDto> list1 = new ArrayList<OrderItemDto>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( orderItemMapper.toDto( orderItem ) );
        }

        return list1;
    }
}
