package com.codespring.bookstore.security;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("securityChecks")
public class SecurityService {

    @Autowired
    private UserRepository userRepository;

    public boolean isOwner(Integer targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String loggedInUsername = authentication.getName();
        User loggedInUser = userRepository.findByEmail(loggedInUsername).orElse(null);

        return loggedInUser != null && loggedInUser.getId().equals(targetUserId);
    }
}