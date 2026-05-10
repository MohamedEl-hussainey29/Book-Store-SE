package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CategoryDto;
import com.codespring.bookstore.entities.Category;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    // Category entity → CategoryDto
    CategoryDto toDto(Category category);

    // CategoryDto → Category entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    Category toEntity(CategoryDto dto);

    // Update existing category from dto
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    void updateEntity(CategoryDto dto, @MappingTarget Category category);
}