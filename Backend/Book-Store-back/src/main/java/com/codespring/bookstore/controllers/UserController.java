package com.codespring.bookstore.controllers;

import com.codespring.bookstore.dtos.*;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.repositories.UserRepository;
import com.codespring.bookstore.services.EmailService;
import com.codespring.bookstore.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.codespring.bookstore.aspects.LoginTrackingAspect;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final LoginTrackingAspect loginTrackingAspect;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("@securityChecks.isOwner(#id)")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }


    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid RegisterUserDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }


    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader("Authorization") String authorizationHeader) {
        userService.logout(authorizationHeader);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    @PostMapping("/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createAdmin(
            @RequestBody @Valid CreateAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createAdmin(request));
    }


    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Integer id,
            @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("@securityChecks.isOwner(#id)")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> editProfile(
            @PathVariable Integer id,
            @ModelAttribute UserDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        UserDto updatedUser = userService.EditProfile(id, dto, file);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        String email = request.getEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        user.setResetOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            RestTemplate restTemplate = new RestTemplate();
            String notificationServiceUrl = "http://notification-app:8081/api/notifications/send";

            Map<String, String> emailData = new HashMap<>();
            emailData.put("toEmail", user.getEmail());
            emailData.put("subject", "Password Reset OTP");
            emailData.put("body", "Your OTP is: " + otp);

            restTemplate.postForEntity(notificationServiceUrl, emailData, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Notification Service: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email via Notification Service."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        user.setResetOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully!");
    }

    @GetMapping("/stats/logins")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<Map<String, Integer>> getAllLoginsPerDay() {
        return ResponseEntity.ok(loginTrackingAspect.getAllDaysLoginCount());
    }


    @GetMapping("/stats/logins/{date}")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<Map<String, Object>> getLoginsForDay(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        int count = loginTrackingAspect.getLoginCountForDay(localDate);
        return ResponseEntity.ok(Map.of(
                "date", date,
                "count", count
        ));
    }
    @PostMapping(value = "/{userId}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> uploadUserImage(
            @PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {

        UserDto updatedUser = userService.uploadUserImage(userId, file);
        return ResponseEntity.ok(updatedUser);
    }
}