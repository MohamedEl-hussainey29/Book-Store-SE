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

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUserById(Integer id) {
        return userMapper.toDto(findUserById(id));
    }

    // ── Register (role = "user") ───────────────────────────────────────────────

    public UserDto register(RegisterUserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }
        User user = userMapper.toEntity(dto);
        // ✅ Hash the password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("user");
        return userMapper.toDto(userRepository.save(user));
    }

    // ── Create Admin (role = "admin", ADMIN only) ─────────────────────────────

    /**
     * Allows an existing admin to create another admin account.
     * The endpoint is protected at the SecurityConfig level (ROLE_ADMIN).
     */
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

    // ── Login ─────────────────────────────────────────────────────────────────

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // ✅ Verify password with BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // ✅ Generate JWT
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

    // ── Logout ────────────────────────────────────────────────────────────────

    /**
     * Invalidates the given token by adding it to the blacklist.
     * After this call the token will be rejected by JwtAuthenticationFilter
     * even if it has not expired yet.
     *
     * @param bearerHeader the raw "Authorization: Bearer <token>" header value
     */
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

    // ── Change Password ───────────────────────────────────────────────────────
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        // ✅ BCrypt comparison
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from old password");
        }
        // ✅ Hash the new password before saving
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ── Update / Delete ───────────────────────────────────────────────────────
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

    // ── Internal helpers ──────────────────────────────────────────────────────
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    private User findUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    @PreAuthorize("@securityChecks.isOwner(#userId)")
    public UserDto uploadUserImage(Integer userId, MultipartFile file) {
        try {
            // 1. نتأكد إن الكتاب موجود أصلاً
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("category not found"));

            // 2. نعمل فولدر اسمه uploads/books لو مش موجود
            Path uploadDirectory = Paths.get("uploads/users");
            if (!Files.exists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory);
            }

            // 3. نولد اسم فريد للصورة علشان مفيش صورة تمسح التانية
            String originalFilename = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;

            // 4. نحفظ الملف الحقيقي في الفولدر
            Path filePath = uploadDirectory.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. نحفظ اسم الصورة كـ String في الداتا بيز
            user.setImage(uniqueFileName);
            userRepository.save(user);

            return userMapper.toDto(user);

        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

}