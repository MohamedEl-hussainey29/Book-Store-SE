package com.codespring.bookstore.security;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class TokenBlacklistService {

    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();


    public void blacklist(String token, Date expiresAt) {
        purgeExpired();
        blacklist.put(token, expiresAt);
    }


    public boolean isBlacklisted(String token) {
        purgeExpired();
        return blacklist.containsKey(token);
    }


    private void purgeExpired() {
        Date now = new Date();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}