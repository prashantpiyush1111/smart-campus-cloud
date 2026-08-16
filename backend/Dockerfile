# ========================================================
# Smart Campus Cloud Management System - Backend Dockerfile
# Multi-stage build for Spring Boot 3 + Java 17
# ========================================================

# Stage 1: Build JAR package using Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml and pre-fetch dependencies for fast cached builds
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application into executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root system user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/smart-campus-cloud-1.0.0.jar app.jar

# Give user ownership of app directory
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
