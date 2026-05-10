package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.FavouriteDto;
import com.codespring.bookstore.entities.Favourite;
import com.codespring.bookstore.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-10T12:03:19+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class FavouriteMapperImpl implements FavouriteMapper {

    @Autowired
    private BookMapper bookMapper;

    @Override
    public FavouriteDto toDto(Favourite favourite) {
        if ( favourite == null ) {
            return null;
        }

        FavouriteDto.FavouriteDtoBuilder favouriteDto = FavouriteDto.builder();

        favouriteDto.userId( favouriteUserId( favourite ) );
        favouriteDto.book( bookMapper.toDto( favourite.getBook() ) );

        return favouriteDto.build();
    }

    private Integer favouriteUserId(Favourite favourite) {
        if ( favourite == null ) {
            return null;
        }
        User user = favourite.getUser();
        if ( user == null ) {
            return null;
        }
        Integer id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
