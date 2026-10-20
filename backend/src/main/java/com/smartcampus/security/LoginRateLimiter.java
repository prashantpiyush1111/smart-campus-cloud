package com.smartcampus.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class LoginRateLimiter {

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    @Value("${app.security.login.max-attempts:10}")
    private int maxAttempts;

    @Value("${app.security.login.window-milliseconds:300000}")
    private long windowMilliseconds;

    public boolean tryAcquire(String key) {
        String clientKey = (key == null || key.isBlank()) ? "unknown" : key;
        long now = System.currentTimeMillis();
        AtomicBoolean allowed = new AtomicBoolean(false);

        windows.compute(clientKey, (ignored, current) -> {
            if (current == null || now - current.startedAt >= windowMilliseconds) {
                allowed.set(true);
                return new Window(now, 1);
            }
            if (current.attempts >= maxAttempts) {
                return current;
            }
            current.attempts++;
            allowed.set(true);
            return current;
        });

        // Bound stale client keys in the in-memory map.
        if (windows.size() > 10_000) {
            windows.entrySet().removeIf(entry -> now - entry.getValue().startedAt >= windowMilliseconds);
        }
        return allowed.get();
    }

    private static final class Window {
        private final long startedAt;
        private int attempts;

        private Window(long startedAt, int attempts) {
            this.startedAt = startedAt;
            this.attempts = attempts;
        }
    }
}
