package com.smartcampus.service;

import com.smartcampus.dto.ComplaintRequest;
import com.smartcampus.dto.ComplaintStatusUpdateRequest;
import com.smartcampus.entity.*;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.ComplaintRepository;
import com.smartcampus.repository.StudentProfileRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            StudentProfileRepository studentProfileRepository,
                            UserRepository userRepository,
                            NotificationService notificationService,
                            ActivityLogService activityLogService) {
        this.complaintRepository = complaintRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByStudent(Long studentProfileId) {
        return complaintRepository.findByStudentId(studentProfileId);
    }

    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
    }

    public Complaint getComplaintByCode(String code) {
        return complaintRepository.findByComplaintCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "complaintCode", code));
    }

    @Transactional
    public Complaint createComplaint(Long studentUserId, ComplaintRequest request) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "userId", studentUserId));

        String code = "CMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Complaint complaint = new Complaint(
                code,
                student,
                request.getCategory(),
                request.getTitle(),
                request.getDescription(),
                request.getLocation(),
                request.getPriority()
        );

        Complaint saved = complaintRepository.save(complaint);

        // Confirmation notification to student
        notificationService.createNotification(
                student.getUser().getId(),
                "Complaint Submitted: " + saved.getComplaintCode(),
                "Your complaint '" + saved.getTitle() + "' has been logged under review.",
                "COMPLAINT_UPDATE",
                "/student/complaints"
        );

        activityLogService.logActivity(
                student.getUser().getEmail(),
                "SUBMIT_COMPLAINT",
                "Complaint",
                saved.getComplaintCode(),
                "Submitted complaint in " + saved.getCategory() + " (" + saved.getTitle() + ")",
                null
        );

        return saved;
    }

    @Transactional
    public Complaint updateComplaintStatus(Long complaintId, Long reviewerUserId, ComplaintStatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", complaintId));

        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerUserId));

        complaint.setStatus(request.getStatus());
        if (request.getResolutionRemarks() != null) {
            complaint.setResolutionRemarks(request.getResolutionRemarks());
        }

        if (request.getAssignedToUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToUserId()).orElse(null);
            complaint.setAssignedTo(assignedUser);
        } else if (complaint.getAssignedTo() == null) {
            complaint.setAssignedTo(reviewer);
        }

        Complaint updated = complaintRepository.save(complaint);

        // Notify student about status change
        notificationService.createNotification(
                complaint.getStudent().getUser().getId(),
                "Complaint Status Updated: " + complaint.getComplaintCode(),
                "Status changed to " + request.getStatus() + (request.getResolutionRemarks() != null ? ". Remarks: " + request.getResolutionRemarks() : ""),
                "COMPLAINT_UPDATE",
                "/student/complaints"
        );

        activityLogService.logActivity(
                reviewer.getEmail(),
                "UPDATE_COMPLAINT_STATUS",
                "Complaint",
                complaint.getComplaintCode(),
                "Status updated to " + request.getStatus(),
                null
        );

        return updated;
    }

    public Map<String, Long> getComplaintStatsByCategory() {
        Map<String, Long> stats = new HashMap<>();
        List<Object[]> results = complaintRepository.countComplaintsByCategory();
        for (Object[] row : results) {
            stats.put(row[0].toString(), (Long) row[1]);
        }
        return stats;
    }

    public Map<String, Long> getComplaintStatsByStatus() {
        Map<String, Long> stats = new HashMap<>();
        List<Object[]> results = complaintRepository.countComplaintsByStatus();
        for (Object[] row : results) {
            stats.put(row[0].toString(), (Long) row[1]);
        }
        return stats;
    }
}
