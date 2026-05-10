package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.BookDto;
import com.codespring.bookstore.entities.Book;
import com.codespring.bookstore.entities.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-07T23:27:54+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class BookMapperImpl implements BookMapper {

    @Override
    public BookDto toDto(Book book) {
        if ( book == null ) {
            return null;
        }

        BookDto.BookDtoBuilder bookDto = BookDto.builder();

        bookDto.categoryName( bookCategoryName( book ) );
        bookDto.author( book.getAuthor() );
        bookDto.date( book.getDate() );
        bookDto.description( book.getDescription() );
        bookDto.id( book.getId() );
        bookDto.image( book.getImage() );
        bookDto.price( book.getPrice() );
        bookDto.quantity( book.getQuantity() );
        bookDto.status( book.getStatus() );
        bookDto.title( book.getTitle() );

        return bookDto.build();
    }

    @Override
    public Book toEntity(BookDto dto) {
        if ( dto == null ) {
            return null;
        }

        Book.BookBuilder book = Book.builder();

        book.author( dto.getAuthor() );
        book.date( dto.getDate() );
        book.description( dto.getDescription() );
        book.image( dto.getImage() );
        book.price( dto.getPrice() );
        book.quantity( dto.getQuantity() );
        book.title( dto.getTitle() );

        return book.build();
    }

    @Override
    public void updateEntity(BookDto dto, Book book) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAuthor() != null ) {
            book.setAuthor( dto.getAuthor() );
        }
        if ( dto.getDate() != null ) {
            book.setDate( dto.getDate() );
        }
        if ( dto.getDescription() != null ) {
            book.setDescription( dto.getDescription() );
        }
        if ( dto.getImage() != null ) {
            book.setImage( dto.getImage() );
        }
        if ( dto.getPrice() != null ) {
            book.setPrice( dto.getPrice() );
        }
        if ( dto.getQuantity() != null ) {
            book.setQuantity( dto.getQuantity() );
        }
        if ( dto.getTitle() != null ) {
            book.setTitle( dto.getTitle() );
        }
    }

    private String bookCategoryName(Book book) {
        if ( book == null ) {
            return null;
        }
        Category category = book.getCategory();
        if ( category == null ) {
            return null;
        }
        String name = category.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
