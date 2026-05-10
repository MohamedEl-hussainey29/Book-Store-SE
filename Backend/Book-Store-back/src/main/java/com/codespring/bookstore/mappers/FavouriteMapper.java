package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.FavouriteDto;
import com.codespring.bookstore.entities.Favourite;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface FavouriteMapper {

    // Favourite entity → FavouriteDto
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "book", source = "book")
    FavouriteDto toDto(Favourite favourite);
}