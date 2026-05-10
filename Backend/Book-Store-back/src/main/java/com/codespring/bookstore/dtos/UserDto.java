package com.codespring.bookstore.dtos;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Integer id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String image;

    private String role;

}