package com.codespring.bookstore.aspects;

import com.codespring.bookstore.entities.LoginStat;
import com.codespring.bookstore.repositories.LoginStatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoginTrackingAspect {

    private final LoginStatRepository loginStatRepository;

    // Runs every time login() succeeds
    @AfterReturning("execution(* com.codespring.bookstore.services.UserService.login(..))")
    public void trackLogin() {
        LocalDate today = LocalDate.now();

        // Find today's record or create a new one
        LoginStat stat = loginStatRepository.findByDate(today)
                .orElse(new LoginStat(null, today, 0));

        // Increment and save
        stat.setCount(stat.getCount() + 1);
        loginStatRepository.save(stat);

        log.info("📊 [LOGIN TRACKER] Logins on {}: {}", today, stat.getCount());
    }

    // Returns count for a specific day
    public int getLoginCountForDay(LocalDate date) {
        return loginStatRepository.findByDate(date)
                .map(LoginStat::getCount)
                .orElse(0);
    }

    // Returns all days with their login counts (sorted by date)
    public Map<String, Integer> getAllDaysLoginCount() {
        List<LoginStat> all = loginStatRepository.findAll();
        Map<String, Integer> result = new LinkedHashMap<>();
        all.stream()
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .forEach(stat -> result.put(stat.getDate().toString(), stat.getCount()));
        return result;
    }
}