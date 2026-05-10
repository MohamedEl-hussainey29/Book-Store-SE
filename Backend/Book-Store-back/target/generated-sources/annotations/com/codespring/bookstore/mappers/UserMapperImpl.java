package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.RegisterUserDto;
import com.codespring.bookstore.dtos.UserDto;
import com.codespring.bookstore.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-07T23:27:55+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        userDto.email( user.getEmail() );
        userDto.firstName( user.getFirstName() );
        userDto.id( user.getId() );
        userDto.image( user.getImage() );
        userDto.lastName( user.getLastName() );
        userDto.phoneNumber( user.getPhoneNumber() );

        return userDto.build();
    }

    @Override
    public User toEntity(RegisterUserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( dto.getEmail() );
        user.firstName( dto.getFirstName() );
        user.lastName( dto.getLastName() );
        user.password( dto.getPassword() );
        user.phoneNumber( dto.getPhoneNumber() );

        user.role( "user" );

        return user.build();
    }

    @Override
    public void updateEntity(UserDto dto, User user) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getEmail() != null ) {
            user.setEmail( dto.getEmail() );
        }
        if ( dto.getFirstName() != null ) {
            user.setFirstName( dto.getFirstName() );
        }
        if ( dto.getImage() != null ) {
            user.setImage( dto.getImage() );
        }
        if ( dto.getLastName() != null ) {
            user.setLastName( dto.getLastName() );
        }
        if ( dto.getPhoneNumber() != null ) {
            user.setPhoneNumber( dto.getPhoneNumber() );
        }
    }
}
