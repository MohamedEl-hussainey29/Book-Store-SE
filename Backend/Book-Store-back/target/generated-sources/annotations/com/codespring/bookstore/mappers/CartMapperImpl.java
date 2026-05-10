package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CartDto;
import com.codespring.bookstore.dtos.CartItemDto;
import com.codespring.bookstore.entities.Cart;
import com.codespring.bookstore.entities.CartItem;
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
public class CartMapperImpl implements CartMapper {

    @Autowired
    private CartItemMapper cartItemMapper;

    @Override
    public CartDto toDto(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        CartDto.CartDtoBuilder cartDto = CartDto.builder();

        cartDto.userId( cartUserId( cart ) );
        cartDto.cartItems( cartItemListToCartItemDtoList( cart.getCartItems() ) );
        cartDto.id( cart.getId() );

        return cartDto.build();
    }

    @Override
    public Cart toEntity(CartDto dto) {
        if ( dto == null ) {
            return null;
        }

        Cart.CartBuilder cart = Cart.builder();

        return cart.build();
    }

    private Integer cartUserId(Cart cart) {
        if ( cart == null ) {
            return null;
        }
        User user = cart.getUser();
        if ( user == null ) {
            return null;
        }
        Integer id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected List<CartItemDto> cartItemListToCartItemDtoList(List<CartItem> list) {
        if ( list == null ) {
            return null;
        }

        List<CartItemDto> list1 = new ArrayList<CartItemDto>( list.size() );
        for ( CartItem cartItem : list ) {
            list1.add( cartItemMapper.toDto( cartItem ) );
        }

        return list1;
    }
}
