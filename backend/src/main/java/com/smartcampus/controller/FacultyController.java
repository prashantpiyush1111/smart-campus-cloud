package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.AttendanceMarkRequest;
import com.smartcampus.dto.ComplaintStatusUpdateRequest;
import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.dto.LeaveApprovalRequest;
import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsDTO stats = facultyService.getFacultyDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Faculty dashboard loaded", stats));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfile>>> getAssignedStudents(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<StudentProfile> students = facultyService.getAssignedStudents(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Students list loaded", students));
    }

    @PostMapping("/attendance")
    public ResponseEntity<ApiResponse<List<Attendance>>> markAttendance(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @Valid @RequestBody AttendanceMarkRequest request) {
        List<Attendance> records = facultyService.markClassAttendance(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", records));
    }

    @GetMapping("/leave-requests")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getLeaveRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<LeaveRequest> leaves = facultyService.getDepartmentLeaves(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Leave requests loaded", leaves));
    }

    @PutMapping("/leave-requests/{id}")
    public ResponseEntity<ApiResponse<LeaveRequest>> reviewLeaveRequest(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @PathVariable Long id,
                                                                        @Valid @RequestBody LeaveApprovalRequest request) {
        LeaveRequest updated = facultyService.reviewLeave(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Leave request reviewed", updated));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaints() {
        List<Complaint> complaints = facultyService.getComplaintsToReview();
        return ResponseEntity.ok(ApiResponse.success("Complaints loaded", complaints));
    }

    @PutMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse<Complaint>> updateComplaintStatus(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @PathVariable Long id,
                                                                        @Valid @RequestBody ComplaintStatusUpdateRequest request) {
        Complaint updated = facultyService.updateComplaint(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated", updated));
    }
}
