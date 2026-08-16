package com.smartcampus.service;

import com.smartcampus.dto.AuthRequest;
import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.entity.Department;
import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.repository.DepartmentRepository;
import com.smartcampus.repository.FacultyProfileRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private FacultyProfileRepository facultyProfileRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private ActivityLogService activityLogService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private Department sampleDept;

    @BeforeEach
    void setUp() {
        sampleDept = new Department("Computer Science", "CSE", "Block A");
        sampleDept.setId(1L);

        sampleUser = new User("test@campus.edu", "encodedPassword", "Test User", Role.ROLE_STUDENT, "1234567890", sampleDept);
        sampleUser.setId(10L);
    }

    @Test
    @DisplayName("Should login successfully and return JWT response")
    void testLoginSuccess() {
        AuthRequest req = new AuthRequest("test@campus.edu", "password123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked.jwt.token");
        when(userRepository.findByEmail("test@campus.edu")).thenReturn(Optional.of(sampleUser));

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mocked.jwt.token", res.getToken());
        assertEquals("test@campus.edu", res.getEmail());
        assertEquals(Role.ROLE_STUDENT, res.getRole());
        verify(activityLogService, times(1)).logActivity(any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw BadRequestException if email already registered")
    void testRegisterExistingEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@campus.edu");
        req.setPassword("password123");
        req.setFullName("Duplicate User");
        req.setRole(Role.ROLE_STUDENT);

        when(userRepository.existsByEmail("test@campus.edu")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }
}
