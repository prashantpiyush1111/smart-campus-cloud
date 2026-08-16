package com.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.dto.AuthRequest;
import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.entity.Role;
import com.smartcampus.security.AuthEntryPointJwt;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.security.UserDetailsServiceImpl;
import com.smartcampus.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt authEntryPointJwt;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/login should return 200 and AuthResponse payload")
    void testLoginEndpoint() throws Exception {
        AuthRequest req = new AuthRequest("student@campus.edu", "Student@123");
        AuthResponse res = new AuthResponse("mock.jwt.token", 1L, "student@campus.edu", "Alex Johnson", Role.ROLE_STUDENT);

        when(authService.login(any(AuthRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.data.email").value("student@campus.edu"))
                .andExpect(jsonPath("$.data.role").value("ROLE_STUDENT"));
    }

    @Test
    @DisplayName("POST /api/auth/register should return 200 on valid student registration")
    void testRegisterEndpoint() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("newstudent@campus.edu");
        req.setPassword("Password@123");
        req.setFullName("New Student");
        req.setRole(Role.ROLE_STUDENT);
        req.setRollNumber("CS2026099");

        AuthResponse res = new AuthResponse("mock.jwt.token", 99L, "newstudent@campus.edu", "New Student", Role.ROLE_STUDENT);

        when(authService.register(any(RegisterRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("newstudent@campus.edu"));
    }
}
