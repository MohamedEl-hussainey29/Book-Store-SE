package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CartItemDto;
import com.codespring.bookstore.entities.Book;
import com.codespring.bookstore.entities.CartItem;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-10T12:03:19+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CartItemMapperImpl implements CartItemMapper {

    @Override
    public CartItemDto toDto(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }

        CartItemDto.CartItemDtoBuilder cartItemDto = CartItemDto.builder();

        cartItemDto.bookId( cartItemBookId( cartItem ) );
        cartItemDto.subtotal( cartItem.getSubtotal() );
        cartItemDto.id( cartItem.getId() );
        cartItemDto.price( cartItem.getPrice() );
        cartItemDto.quantity( cartItem.getQuantity() );

        return cartItemDto.build();
    }

    @Override
    public CartItem toEntity(CartItemDto dto) {
        if ( dto == null ) {
            return null;
        }

        CartItem.CartItemBuilder cartItem = CartItem.builder();

        cartItem.price( dto.getPrice() );
        cartItem.quantity( dto.getQuantity() );

        return cartItem.build();
    }

    private Integer cartItemBookId(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        Book book = cartItem.getBook();
        if ( book == null ) {
            return null;
        }
        Integer id = book.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
