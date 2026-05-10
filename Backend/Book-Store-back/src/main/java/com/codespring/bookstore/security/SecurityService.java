package com.codespring.bookstore.security;
import com.codespring.bookstore.entities.User;
import com.codespring.bookstore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("securityChecks") // الاسم ده مهم جداً هنستخدمه كمان شوية
public class SecurityService {

    @Autowired
    private UserRepository userRepository;

    // الميثود دي هترجع True لو اليوزر بيعدل في حاجته، و False لو بيلعب في حاجة غيره
    public boolean isOwner(Integer targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String loggedInUsername = authentication.getName();
        User loggedInUser = userRepository.findByEmail(loggedInUsername).orElse(null);

        // بنقارن الـ ID اللي في التوكن بالـ ID اللي مبعوت
        return loggedInUser != null && loggedInUser.getId().equals(targetUserId);
    }
}