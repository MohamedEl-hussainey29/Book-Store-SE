package com.codespring.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private Integer userId;

    private String  email;

    private String  firstName;

    private String  lastName;

    private String  role;

    private String  token;
}