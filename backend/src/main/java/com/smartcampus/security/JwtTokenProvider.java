package com.smartcampus.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // Access tokens are intentionally short-lived. Override only through secure deployment config.
    @Value("${app.jwt.expiration-milliseconds:900000}")
    private long jwtExpirationInMs;

    // Best-effort, process-local revocation. A shared store is needed for multi-instance deployments.
    private final ConcurrentHashMap<String, Long> revokedTokens = new ConcurrentHashMap<>();

    private Key getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("email", userPrincipal.getUsername())
                .claim("role", userPrincipal.getRole().name())
                .claim("fullName", userPrincipal.getFullName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public void revokeToken(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            long expiry = claims.getExpiration() == null
                    ? System.currentTimeMillis() + jwtExpirationInMs
                    : claims.getExpiration().getTime();
            if (expiry > System.currentTimeMillis()) {
                revokedTokens.put(token, expiry);
            }
        } catch (JwtException | IllegalArgumentException ex) {
            logger.debug("Ignoring invalid token during logout");
        }
        removeExpiredRevocations();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            removeExpiredRevocations();
            return !revokedTokens.containsKey(authToken);
        } catch (SecurityException | MalformedJwtException ex) {
            logger.warn("Invalid JWT signature or format");
        } catch (ExpiredJwtException ex) {
            logger.debug("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.warn("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.warn("JWT claims string is empty");
        }
        return false;
    }

    private void removeExpiredRevocations() {
        long now = System.currentTimeMillis();
        revokedTokens.entrySet().removeIf(entry -> entry.getValue() <= now);
    }
}
