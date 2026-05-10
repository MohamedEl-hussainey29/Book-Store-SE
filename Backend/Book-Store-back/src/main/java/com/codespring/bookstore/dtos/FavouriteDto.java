package com.codespring.bookstore.dtos;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteDto {

    private Integer userId;
    
    private BookDto book;
}