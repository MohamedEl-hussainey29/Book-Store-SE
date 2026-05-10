package com.codespring.bookstore.services;

import com.codespring.bookstore.dtos.*;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.mappers.UserMapper;
import com.codespring.bookstore.repositories.UserRepository;
import com.codespring.bookstore.security.JwtUtil;
import com.codespring.bookstore.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository        userRepository;
    private final UserMapper            userMapper;
    private final PasswordEncoder       passwordEncoder;
    private final JwtUtil               jwtUtil;
    private final TokenBlacklistService blacklistService;


    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUserById(Integer id) {
        return userMapper.toDto(findUserById(id));
    }


    public UserDto register(RegisterUserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("user");
        return userMapper.toDto(userRepository.save(user));
    }



    public UserDto createAdmin(CreateAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        User admin = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                // ✅ Hash the password
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role("admin")
                .build();
        return userMapper.toDto(userRepository.save(admin));
    }


    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                token
        );
    }



    public void logout(String bearerHeader) {
        if (bearerHeader == null || !bearerHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No valid Authorization header provided");
        }
        String token = bearerHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Token is already invalid or expired");
        }
        blacklistService.blacklist(token, jwtUtil.extractExpiration(token));
    }

    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from old password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @PreAuthorize("@securityChecks.isOwner(#id)")
    public UserDto EditProfile(Integer id, UserDto dto, MultipartFile file) {
        User user = findUserById(id);

        String oldImage = user.getImage();

        userMapper.updateEntity(dto, user);

        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDirectory = Paths.get("uploads/users");
                if (!Files.exists(uploadDirectory)) {
                    Files.createDirectories(uploadDirectory);
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDirectory.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                user.setImage(uniqueFileName);
            } catch (Exception e) {
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }
        } else {
            user.setImage(oldImage);
        }

        return userMapper.toDto(userRepository.save(user));
    }

    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @PreAuthorize("@securityChecks.isOwner(#userId)")
    private User findUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public UserDto uploadUserImage(Integer userId, MultipartFile file) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("category not found"));

            Path uploadDirectory = Paths.get("uploads/users");
            if (!Files.exists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory);
            }

            String originalFilename = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;

            Path filePath = uploadDirectory.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            user.setImage(uniqueFileName);
            userRepository.save(user);

            return userMapper.toDto(user);

        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

}