package com.smartcampus.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginRateLimiterTest {

    @Test
    void blocksAdditionalAttemptsUntilTheWindowExpires() {
        LoginRateLimiter limiter = new LoginRateLimiter();
        ReflectionTestUtils.setField(limiter, "maxAttempts", 2);
        ReflectionTestUtils.setField(limiter, "windowMilliseconds", 60_000L);

        assertTrue(limiter.tryAcquire("192.0.2.10"));
        assertTrue(limiter.tryAcquire("192.0.2.10"));
        assertFalse(limiter.tryAcquire("192.0.2.10"));
        assertTrue(limiter.tryAcquire("192.0.2.11"));
    }
}
