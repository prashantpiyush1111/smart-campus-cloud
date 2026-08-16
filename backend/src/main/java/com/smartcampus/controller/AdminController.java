package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.entity.*;
import com.smartcampus.service.ActivityLogService;
import com.smartcampus.service.AdminService;
import com.smartcampus.service.ComplaintService;
import com.smartcampus.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;
    private final LeaveService leaveService;
    private final ActivityLogService activityLogService;

    public AdminController(AdminService adminService,
                           ComplaintService complaintService,
                           LeaveService leaveService,
                           ActivityLogService activityLogService) {
        this.adminService = adminService;
        this.complaintService = complaintService;
        this.leaveService = leaveService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        DashboardStatsDTO stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard stats loaded", stats));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfile>>> getStudents() {
        List<StudentProfile> students = adminService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("All students loaded", students));
    }

    @GetMapping("/faculty")
    public ResponseEntity<ApiResponse<List<FacultyProfile>>> getFaculty() {
        List<FacultyProfile> faculty = adminService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.success("All faculty loaded", faculty));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        List<Department> departments = adminService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success("All departments loaded", departments));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@Valid @RequestBody Department department) {
        Department created = adminService.createDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Department created successfully", created));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(ApiResponse.success("All complaints loaded", complaints));
    }

    @GetMapping("/leave-requests")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getLeaveRequests() {
        List<LeaveRequest> leaves = leaveService.getAllLeaveRequests();
        return ResponseEntity.ok(ApiResponse.success("All leave requests loaded", leaves));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserActiveStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled successfully"));
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<ActivityLog>>> getActivityLogs() {
        List<ActivityLog> logs = activityLogService.getRecentLogs();
        return ResponseEntity.ok(ApiResponse.success("Recent activity audit logs loaded", logs));
    }
}
