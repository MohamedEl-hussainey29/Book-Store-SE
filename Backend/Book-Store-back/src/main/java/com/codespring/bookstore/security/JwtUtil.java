package com.codespring.bookstore.security;

import com.codespring.bookstore.entities.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class responsible for:
 *  - Generating JWT tokens on login
 *  - Validating tokens on every request
 *  - Extracting claims (email, role) from tokens
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs) {
        // Build a secure key from the configured secret string
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // ── Generate ──────────────────────────────────────────────────────────────

    /**
     * Creates a signed JWT containing the user's email and role.
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())

                // هنا بنحط كل الداتا الإضافية (Claims)
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("role", user.getRole())
                .claim("image", user.getImage())
                .claim("phoneNumber", user.getPhoneNumber())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    // ── Extract ───────────────────────────────────────────────────────────────

    public String extractEmail(String token) {return parseClaims(token).getSubject();}

    public String extractFirstName(String token) {return parseClaims(token).get("firstName", String.class);}

    public String extractLastName(String token) {return parseClaims(token).get("lastName", String.class);}

    public String extractRole(String token) {return parseClaims(token).get("role", String.class);}

    public String extractImage(String token) {return parseClaims(token).get("image", String.class);}

    public String extractPhoneNumber(String token) {return parseClaims(token).get("phoneNumber", String.class);}

    public Integer extractID (String token) {return parseClaims(token).get("userId",
            Integer.class);}

    public Date extractExpiration (String token) {return parseClaims(token).getExpiration();}

    // ── Validate ──────────────────────────────────────────────────────────────

    /**
     * Returns true if the token is well-formed, correctly signed, and not expired.
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}