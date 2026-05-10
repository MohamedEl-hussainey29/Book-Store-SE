package com.codespring.bookstore.security;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Keeps a thread-safe set of tokens that have been explicitly invalidated
 * (i.e., the user called /logout).
 *
 * Expired tokens are purged automatically when isBlacklisted() is called,
 * so memory usage stays bounded without needing a scheduler.
 */
@Service
public class TokenBlacklistService {

    // token → expiry time
    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    /**
     * Add a token to the blacklist together with its expiry date.
     * Once the token expires naturally it will be removed from the map.
     */
    public void blacklist(String token, Date expiresAt) {
        purgeExpired();
        blacklist.put(token, expiresAt);
    }

    /**
     * Returns true when the token was explicitly invalidated AND has not yet
     * expired (expired tokens are harmless even if they are in the list).
     */
    public boolean isBlacklisted(String token) {
        purgeExpired();
        return blacklist.containsKey(token);
    }

    // ── Housekeeping ──────────────────────────────────────────────────────────

    private void purgeExpired() {
        Date now = new Date();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}