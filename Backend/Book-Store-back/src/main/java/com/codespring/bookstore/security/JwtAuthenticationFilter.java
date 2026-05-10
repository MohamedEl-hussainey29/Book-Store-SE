package com.codespring.bookstore.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Runs once per HTTP request.
 *
 * If a valid, non-blacklisted JWT is present in the Authorization header
 * the filter sets the authenticated principal in the SecurityContext so
 * downstream security rules can use it (@PreAuthorize, etc.).
 */
@Component
@RequiredArgsConstructor
@EnableMethodSecurity
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TokenBlacklistService blacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null
                && jwtUtil.isTokenValid(token)
                && !blacklistService.isBlacklisted(token)) {

            String email = jwtUtil.extractEmail(token);
            String role  = jwtUtil.extractRole(token);
            String fristName = jwtUtil.extractFirstName(token);
            String lastName = jwtUtil.extractLastName(token);
            String phoneNumber = jwtUtil.extractPhoneNumber(token);
            String image = jwtUtil.extractImage(token);
            Integer userId = jwtUtil.extractID(token);

            // Spring Security expects roles prefixed with "ROLE_"
            var authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
            var auth = new UsernamePasswordAuthenticationToken(
                    email, null, List.of(authority));

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Pulls the raw token string out of the "Authorization: Bearer <token>" header.
     * Returns null when the header is absent or malformed.
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}