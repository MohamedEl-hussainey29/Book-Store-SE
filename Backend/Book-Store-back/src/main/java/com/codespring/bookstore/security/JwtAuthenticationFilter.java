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

            var authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
            var auth = new UsernamePasswordAuthenticationToken(
                    email, null, List.of(authority));

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }


    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}