package com.smartcampus.service;

import com.smartcampus.dto.*;
import com.smartcampus.entity.*;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.DepartmentRepository;
import com.smartcampus.repository.FacultyProfileRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       FacultyProfileRepository facultyProfileRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       ActivityLogService activityLogService,
                       NotificationService notificationService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.facultyProfileRepository = facultyProfileRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.activityLogService = activityLogService;
        this.notificationService = notificationService;
    }

    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

        activityLogService.logActivity(user.getEmail(), "USER_LOGIN", "User", user.getId().toString(), "User logged in successfully", null);

        AuthResponse authResponse = new AuthResponse(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
        authResponse.setPhoneNumber(user.getPhoneNumber());

        if (user.getDepartment() != null) {
            authResponse.setDepartmentId(user.getDepartment().getId());
            authResponse.setDepartmentName(user.getDepartment().getName());
        }

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentProfileRepository.findByUser(user).ifPresent(profile -> {
                authResponse.setRollNumber(profile.getRollNumber());
                authResponse.setSemester(profile.getSemester());
                authResponse.setBatch(profile.getBatch());
            });
        } else if (user.getRole() == Role.ROLE_FACULTY) {
            facultyProfileRepository.findByUser(user).ifPresent(profile -> {
                authResponse.setEmployeeCode(profile.getEmployeeCode());
                authResponse.setDesignation(profile.getDesignation());
            });
        }

        return authResponse;
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already in use!");
        }

        Department department = null;
        if (registerRequest.getDepartmentId() != null) {
            department = departmentRepository.findById(registerRequest.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", registerRequest.getDepartmentId()));
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setRole(registerRequest.getRole());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setDepartment(department);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        if (registerRequest.getRole() == Role.ROLE_STUDENT) {
            String roll = (registerRequest.getRollNumber() != null && !registerRequest.getRollNumber().isBlank())
                    ? registerRequest.getRollNumber() : "STU-" + System.currentTimeMillis() % 10000;

            if (studentProfileRepository.existsByRollNumber(roll)) {
                throw new BadRequestException("Roll number is already in use!");
            }

            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUser(savedUser);
            studentProfile.setRollNumber(roll);
            studentProfile.setAdmissionNumber(registerRequest.getAdmissionNumber());
            studentProfile.setSemester(registerRequest.getSemester() != null ? registerRequest.getSemester() : "Semester 1");
            studentProfile.setBatch(registerRequest.getBatch() != null ? registerRequest.getBatch() : "2024-2028");
            studentProfile.setCgpa(8.5);
            studentProfile.setGuardianName(registerRequest.getGuardianName());
            studentProfile.setGuardianContact(registerRequest.getGuardianContact());
            studentProfileRepository.save(studentProfile);
        } else if (registerRequest.getRole() == Role.ROLE_FACULTY) {
            String empCode = (registerRequest.getEmployeeCode() != null && !registerRequest.getEmployeeCode().isBlank())
                    ? registerRequest.getEmployeeCode() : "FAC-" + System.currentTimeMillis() % 10000;

            if (facultyProfileRepository.existsByEmployeeCode(empCode)) {
                throw new BadRequestException("Employee code is already in use!");
            }

            FacultyProfile facultyProfile = new FacultyProfile();
            facultyProfile.setUser(savedUser);
            facultyProfile.setEmployeeCode(empCode);
            facultyProfile.setDesignation(registerRequest.getDesignation() != null ? registerRequest.getDesignation() : "Assistant Professor");
            facultyProfile.setQualification(registerRequest.getQualification() != null ? registerRequest.getQualification() : "Ph.D / M.Tech");
            facultyProfile.setSpecialization(registerRequest.getSpecialization());
            facultyProfileRepository.save(facultyProfile);
        }

        // Welcome notification
        notificationService.createNotification(
                savedUser.getId(),
                "Welcome to Smart Campus Cloud!",
                "Hello " + savedUser.getFullName() + ", your account has been registered successfully.",
                "SYSTEM_ALERT",
                "/dashboard"
        );

        activityLogService.logActivity(savedUser.getEmail(), "USER_REGISTER", "User", savedUser.getId().toString(), "New user registered with role " + savedUser.getRole(), null);

        // Auto authenticate and generate token
        AuthRequest authReq = new AuthRequest(registerRequest.getEmail(), registerRequest.getPassword());
        return login(authReq);
    }

    public void logout(String token) {
        tokenProvider.revokeToken(token);
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
            dto.setDepartmentCode(user.getDepartment().getCode());
        }

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentProfileRepository.findByUser(user).ifPresent(p -> {
                dto.setStudentProfileId(p.getId());
                dto.setRollNumber(p.getRollNumber());
                dto.setAdmissionNumber(p.getAdmissionNumber());
                dto.setSemester(p.getSemester());
                dto.setBatch(p.getBatch());
                dto.setCgpa(p.getCgpa());
                dto.setGuardianName(p.getGuardianName());
                dto.setGuardianContact(p.getGuardianContact());
            });
        } else if (user.getRole() == Role.ROLE_FACULTY) {
            facultyProfileRepository.findByUser(user).ifPresent(p -> {
                dto.setFacultyProfileId(p.getId());
                dto.setEmployeeCode(p.getEmployeeCode());
                dto.setDesignation(p.getDesignation());
                dto.setQualification(p.getQualification());
                dto.setSpecialization(p.getSpecialization());
            });
        }

        return dto;
    }
}
