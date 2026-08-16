package com.smartcampus.service;

import com.smartcampus.dto.LeaveApprovalRequest;
import com.smartcampus.dto.LeaveRequestDTO;
import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.LeaveStatus;
import com.smartcampus.entity.Role;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.entity.User;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.repository.LeaveRequestRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LeaveServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private LeaveService leaveService;

    @Test
    @DisplayName("Should submit leave request successfully")
    void testSubmitLeaveSuccess() {
        Long studentUserId = 10L;
        User user = new User("student@campus.edu", "pass", "Alex", Role.ROLE_STUDENT, "123", null);
        user.setId(studentUserId);
        StudentProfile student = new StudentProfile(user, "CS101", "ADM101", "Sem 6", "2024", 8.5, "Guardian", "123");

        LeaveRequestDTO req = new LeaveRequestDTO(LocalDate.now().plusDays(1), LocalDate.now().plusDays(3), "Hackathon");

        when(studentProfileRepository.findByUserId(studentUserId)).thenReturn(Optional.of(student));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> {
            LeaveRequest lr = i.getArgument(0);
            lr.setId(1L);
            return lr;
        });

        LeaveRequest result = leaveService.submitLeaveRequest(studentUserId, req);

        assertNotNull(result);
        assertEquals(LeaveStatus.PENDING, result.getStatus());
        verify(notificationService, times(1)).createNotification(eq(studentUserId), anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject leave if end date is before start date")
    void testSubmitLeaveInvalidDates() {
        Long studentUserId = 10L;
        LeaveRequestDTO req = new LeaveRequestDTO(LocalDate.now().plusDays(5), LocalDate.now().plusDays(2), "Invalid");

        assertThrows(BadRequestException.class, () -> leaveService.submitLeaveRequest(studentUserId, req));
    }

    @Test
    @DisplayName("Should approve leave request and notify student")
    void testReviewLeaveApproval() {
        Long leaveId = 1L;
        Long facultyUserId = 20L;

        User faculty = new User("faculty@campus.edu", "pass", "Dr. Alan", Role.ROLE_FACULTY, "123", null);
        faculty.setId(facultyUserId);

        User studentUser = new User("student@campus.edu", "pass", "Alex", Role.ROLE_STUDENT, "123", null);
        studentUser.setId(10L);
        StudentProfile student = new StudentProfile(studentUser, "CS101", "ADM101", "Sem 6", "2024", 8.5, "Guardian", "123");

        LeaveRequest leave = new LeaveRequest(student, LocalDate.now().plusDays(1), LocalDate.now().plusDays(2), "Conference");
        leave.setId(leaveId);

        LeaveApprovalRequest req = new LeaveApprovalRequest(LeaveStatus.APPROVED, "Granted for conference presentation");

        when(leaveRequestRepository.findById(leaveId)).thenReturn(Optional.of(leave));
        when(userRepository.findById(facultyUserId)).thenReturn(Optional.of(faculty));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> i.getArgument(0));

        LeaveRequest reviewed = leaveService.reviewLeaveRequest(leaveId, facultyUserId, req);

        assertEquals(LeaveStatus.APPROVED, reviewed.getStatus());
        assertEquals("Granted for conference presentation", reviewed.getFacultyRemarks());
        verify(notificationService, times(1)).createNotification(eq(10L), anyString(), anyString(), anyString(), anyString());
    }
}
