package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.AttendanceSummaryDTO;
import com.smartcampus.dto.ComplaintRequest;
import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.dto.LeaveRequestDTO;
import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfile>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentProfile profile = studentService.getStudentProfileByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", profile));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsDTO stats = studentService.getStudentDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Dashboard data loaded", stats));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<List<AttendanceSummaryDTO>>> getAttendanceSummary(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AttendanceSummaryDTO> summary = studentService.getAttendanceSummary(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Attendance summary loaded", summary));
    }

    @GetMapping("/attendance/history")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Attendance> records = studentService.getAttendanceHistory(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Attendance history loaded", records));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaints(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Complaint> complaints = studentService.getComplaints(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Complaints loaded", complaints));
    }

    @PostMapping("/complaints")
    public ResponseEntity<ApiResponse<Complaint>> submitComplaint(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                  @Valid @RequestBody ComplaintRequest request) {
        Complaint complaint = studentService.submitComplaint(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", complaint));
    }

    @GetMapping("/leave")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getLeaveRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<LeaveRequest> leaves = studentService.getLeaveRequests(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Leave requests loaded", leaves));
    }

    @PostMapping("/leave")
    public ResponseEntity<ApiResponse<LeaveRequest>> submitLeaveRequest(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @Valid @RequestBody LeaveRequestDTO request) {
        LeaveRequest leave = studentService.submitLeaveRequest(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Leave request submitted successfully", leave));
    }
}
