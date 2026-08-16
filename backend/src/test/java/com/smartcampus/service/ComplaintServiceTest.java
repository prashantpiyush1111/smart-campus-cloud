package com.smartcampus.service;

import com.smartcampus.dto.ComplaintRequest;
import com.smartcampus.dto.ComplaintStatusUpdateRequest;
import com.smartcampus.entity.*;
import com.smartcampus.repository.ComplaintRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ComplaintServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private ComplaintService complaintService;

    @Test
    @DisplayName("Should create complaint and trigger student notification")
    void testCreateComplaint() {
        Long studentUserId = 20L;
        User user = new User("student@campus.edu", "pass", "Alex", Role.ROLE_STUDENT, "123", null);
        user.setId(studentUserId);

        StudentProfile student = new StudentProfile(user, "CS101", "ADM101", "Sem 6", "2024", 8.5, "Guardian", "123");
        student.setId(5L);

        ComplaintRequest req = new ComplaintRequest();
        req.setTitle("Projector broken");
        req.setDescription("HDMI not working");
        req.setCategory(ComplaintCategory.CLASSROOM);
        req.setLocation("Room 101");
        req.setPriority(ComplaintPriority.HIGH);

        when(studentProfileRepository.findByUserId(studentUserId)).thenReturn(Optional.of(student));
        when(complaintRepository.save(any(Complaint.class))).thenAnswer(i -> i.getArgument(0));

        Complaint saved = complaintService.createComplaint(studentUserId, req);

        assertNotNull(saved);
        assertEquals("Projector broken", saved.getTitle());
        assertEquals(ComplaintStatus.SUBMITTED, saved.getStatus());
        verify(notificationService, times(1)).createNotification(eq(studentUserId), anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should update complaint status and notify student")
    void testUpdateComplaintStatus() {
        Long complaintId = 1L;
        Long reviewerId = 30L;

        User reviewer = new User("faculty@campus.edu", "pass", "Dr. Alan", Role.ROLE_FACULTY, "123", null);
        reviewer.setId(reviewerId);

        User studentUser = new User("student@campus.edu", "pass", "Alex", Role.ROLE_STUDENT, "123", null);
        studentUser.setId(20L);
        StudentProfile student = new StudentProfile(studentUser, "CS101", "ADM101", "Sem 6", "2024", 8.5, "Guardian", "123");

        Complaint complaint = new Complaint("CMP-101", student, ComplaintCategory.CLASSROOM, "Broken Desk", "Leg unstable", "Room 201", ComplaintPriority.LOW);
        complaint.setId(complaintId);

        ComplaintStatusUpdateRequest req = new ComplaintStatusUpdateRequest();
        req.setStatus(ComplaintStatus.RESOLVED);
        req.setResolutionRemarks("Desk replaced with new ergonomic furniture.");

        when(complaintRepository.findById(complaintId)).thenReturn(Optional.of(complaint));
        when(userRepository.findById(reviewerId)).thenReturn(Optional.of(reviewer));
        when(complaintRepository.save(any(Complaint.class))).thenAnswer(i -> i.getArgument(0));

        Complaint updated = complaintService.updateComplaintStatus(complaintId, reviewerId, req);

        assertNotNull(updated);
        assertEquals(ComplaintStatus.RESOLVED, updated.getStatus());
        assertEquals("Desk replaced with new ergonomic furniture.", updated.getResolutionRemarks());
        verify(notificationService, times(1)).createNotification(eq(20L), anyString(), anyString(), anyString(), anyString());
    }
}
