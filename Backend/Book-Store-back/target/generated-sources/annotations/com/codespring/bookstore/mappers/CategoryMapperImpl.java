package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.CategoryDto;
import com.codespring.bookstore.entities.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-07T23:27:55+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDto toDto(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDto.CategoryDtoBuilder categoryDto = CategoryDto.builder();

        categoryDto.id( category.getId() );
        categoryDto.image( category.getImage() );
        categoryDto.name( category.getName() );

        return categoryDto.build();
    }

    @Override
    public Category toEntity(CategoryDto dto) {
        if ( dto == null ) {
            return null;
        }

        Category.CategoryBuilder category = Category.builder();

        category.image( dto.getImage() );
        category.name( dto.getName() );

        return category.build();
    }

    @Override
    public void updateEntity(CategoryDto dto, Category category) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getImage() != null ) {
            category.setImage( dto.getImage() );
        }
        if ( dto.getName() != null ) {
            category.setName( dto.getName() );
        }
    }
}
