package com.codespring.bookstore.mappers;

import com.codespring.bookstore.dtos.RegisterUserDto;
import com.codespring.bookstore.dtos.UserDto;
import com.codespring.bookstore.entities.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    // User entity → UserDto
    UserDto toDto(User user);

    // RegisterUserDto → User entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "user")
    User toEntity(RegisterUserDto dto);

    // Update existing user from dto
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateEntity(UserDto dto, @MappingTarget User user);
}