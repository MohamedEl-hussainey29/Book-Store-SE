package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.BookDto;
import com.codespring.bookstore.entities.Book;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookMapper {

    // Book entity → BookDto
    @Mapping(target = "categoryName", source = "category.name")  // ✅
    BookDto toDto(Book book);

    // BookDto → Book entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "status", ignore = true)
    Book toEntity(BookDto dto);

    // Update existing book from dto
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntity(BookDto dto, @MappingTarget Book book);
}