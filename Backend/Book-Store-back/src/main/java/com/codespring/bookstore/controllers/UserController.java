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

    // ── Read ──────────────────────────────────────────────────────────────────

    // GET /users  →  ADMIN only (secured in SecurityConfig)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /users/1
    @GetMapping("/{id}")
    @PreAuthorize("@securityChecks.isOwner(#id)")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ── Auth ──────────────────────────────────────────────────────────────────

    // POST /users/register  →  Public
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid RegisterUserDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(dto));
    }

    // POST /users/login  →  Public
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    /**
     * POST /users/logout
     *
     * The client sends the same Authorization: Bearer <token> header it uses
     * for every other request.  The token is added to the blacklist and will
     * be rejected from that moment on, even if it has not expired yet.
     *
     * Accessible by any authenticated user (USER or ADMIN).
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader("Authorization") String authorizationHeader) {
        userService.logout(authorizationHeader);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // ── Admin management ──────────────────────────────────────────────────────

    /**
     * POST /users/create-admin  →  ADMIN only (secured in SecurityConfig)
     *
     * Creates a new account with role = "admin".
     * Only an existing admin can call this endpoint.
     */
    @PostMapping("/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createAdmin(
            @RequestBody @Valid CreateAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createAdmin(request));
    }

    // ── Password ──────────────────────────────────────────────────────────────

    // POST /users/1/change-password
    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Integer id,
            @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }

    // ── Update / Delete ───────────────────────────────────────────────────────

    // PUT /users/1
    @PreAuthorize("@securityChecks.isOwner(#id)")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> editProfile(
            @PathVariable Integer id,
            @ModelAttribute UserDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        UserDto updatedUser = userService.EditProfile(id, dto, file);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE /users/1
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        // 1. Get email from request body
        String email = request.getEmail();

        // 2. Check if email exists in database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        // 3. Generate random 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        // 4. Save OTP and expiry time (15 minutes from now)
        user.setResetOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // 5. نكلم سيرفيس الإشعارات علشان هي اللي تبعت الإيميل (ده التعديل)
        try {
            RestTemplate restTemplate = new RestTemplate();
            // اللينك ده هو اسم السيرفيس التانية جوه الدوكر
            String notificationServiceUrl = "http://notification-app:8081/api/notifications/send";

            // بنجهز الداتا اللي هنبعتها
            Map<String, String> emailData = new HashMap<>();
            emailData.put("toEmail", user.getEmail());
            emailData.put("subject", "Password Reset OTP");
            emailData.put("body", "Your OTP is: " + otp);

            // بنضرب الريكويست للمايكروسيرفيس التانية
            restTemplate.postForEntity(notificationServiceUrl, emailData, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Notification Service: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email via Notification Service."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // request فيه: email, otp, newPassword

        // 1. نجيب اليوزر
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. نتأكد إن الـ OTP صح
        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        // 3. نتأكد إن الـ OTP لسه وقته مخلصش
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // 4. لو كله تمام، نشفر الباسورد الجديدة ونحفظها
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // 5. نمسح الـ OTP القديم علشان ميستخدموش تاني
        user.setResetOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully!");
    }
    // GET /users/stats/logins
// Returns all days with their login counts
// Example: { "2026-05-01": 3, "2026-05-02": 7, "2026-05-03": 2 }
    @GetMapping("/stats/logins")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<Map<String, Integer>> getAllLoginsPerDay() {
        return ResponseEntity.ok(loginTrackingAspect.getAllDaysLoginCount());
    }

    // GET /users/stats/logins/2026-05-02
// Returns login count for a specific day
// Example: { "date": "2026-05-02", "count": 7 }
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