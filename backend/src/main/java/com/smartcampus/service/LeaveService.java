package com.smartcampus.service;

import com.smartcampus.dto.LeaveApprovalRequest;
import com.smartcampus.dto.LeaveRequestDTO;
import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.LeaveStatus;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.entity.User;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.LeaveRequestRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        StudentProfileRepository studentProfileRepository,
                        UserRepository userRepository,
                        NotificationService notificationService,
                        ActivityLogService activityLogService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getStudentLeaveRequests(Long studentProfileId) {
        return leaveRequestRepository.findByStudentId(studentProfileId);
    }

    public List<LeaveRequest> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    public List<LeaveRequest> getDepartmentLeaveRequests(Long departmentId) {
        return leaveRequestRepository.findByStudent_User_DepartmentId(departmentId);
    }

    public LeaveRequest getLeaveById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));
    }

    @Transactional
    public LeaveRequest submitLeaveRequest(Long studentUserId, LeaveRequestDTO request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date!");
        }

        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "userId", studentUserId));

        LeaveRequest leaveRequest = new LeaveRequest(
                student,
                request.getStartDate(),
                request.getEndDate(),
                request.getReason()
        );

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        // Notify student that request is received
        notificationService.createNotification(
                student.getUser().getId(),
                "Leave Request Submitted",
                "Your leave application for " + request.getStartDate() + " to " + request.getEndDate() + " has been submitted for approval.",
                "LEAVE_STATUS",
                "/student/leave"
        );

        activityLogService.logActivity(
                student.getUser().getEmail(),
                "SUBMIT_LEAVE_REQUEST",
                "LeaveRequest",
                saved.getId().toString(),
                "Submitted leave request (" + request.getStartDate() + " - " + request.getEndDate() + ")",
                null
        );

        return saved;
    }

    @Transactional
    public LeaveRequest reviewLeaveRequest(Long leaveId, Long reviewerUserId, LeaveApprovalRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerUserId));

        leaveRequest.setStatus(request.getStatus());
        leaveRequest.setFacultyRemarks(request.getFacultyRemarks());
        leaveRequest.setReviewedBy(reviewer);

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);

        // Notify student with the verdict
        String verdictMsg = "Your leave request for " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate()
                + " has been " + request.getStatus();
        if (request.getFacultyRemarks() != null && !request.getFacultyRemarks().isBlank()) {
            verdictMsg += ". Remarks: " + request.getFacultyRemarks();
        }

        notificationService.createNotification(
                leaveRequest.getStudent().getUser().getId(),
                "Leave Request " + request.getStatus(),
                verdictMsg,
                "LEAVE_STATUS",
                "/student/leave"
        );

        activityLogService.logActivity(
                reviewer.getEmail(),
                "REVIEW_LEAVE_REQUEST",
                "LeaveRequest",
                leaveRequest.getId().toString(),
                "Marked leave as " + request.getStatus(),
                null
        );

        return updated;
    }
}
