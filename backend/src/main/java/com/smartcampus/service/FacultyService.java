package com.smartcampus.service;

import com.smartcampus.dto.AttendanceMarkRequest;
import com.smartcampus.dto.ComplaintStatusUpdateRequest;
import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.dto.LeaveApprovalRequest;
import com.smartcampus.entity.*;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.ComplaintRepository;
import com.smartcampus.repository.FacultyProfileRepository;
import com.smartcampus.repository.LeaveRequestRepository;
import com.smartcampus.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyProfileRepository facultyProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AttendanceService attendanceService;
    private final LeaveService leaveService;
    private final ComplaintService complaintService;
    private final LeaveRequestRepository leaveRequestRepository;
    private final ComplaintRepository complaintRepository;

    public FacultyService(FacultyProfileRepository facultyProfileRepository,
                          StudentProfileRepository studentProfileRepository,
                          AttendanceService attendanceService,
                          LeaveService leaveService,
                          ComplaintService complaintService,
                          LeaveRequestRepository leaveRequestRepository,
                          ComplaintRepository complaintRepository) {
        this.facultyProfileRepository = facultyProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.attendanceService = attendanceService;
        this.leaveService = leaveService;
        this.complaintService = complaintService;
        this.leaveRequestRepository = leaveRequestRepository;
        this.complaintRepository = complaintRepository;
    }

    public FacultyProfile getFacultyProfileByUserId(Long userId) {
        return facultyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("FacultyProfile", "userId", userId));
    }

    public DashboardStatsDTO getFacultyDashboardStats(Long userId) {
        FacultyProfile profile = getFacultyProfileByUserId(userId);
        DashboardStatsDTO stats = new DashboardStatsDTO();

        Long deptId = profile.getUser().getDepartment() != null ? profile.getUser().getDepartment().getId() : null;

        if (deptId != null) {
            stats.setAssignedStudentsCount((long) studentProfileRepository.findByUser_DepartmentId(deptId).size());
            stats.setFacultyPendingLeaves((long) leaveRequestRepository.findByStudent_User_DepartmentId(deptId).stream()
                    .filter(l -> l.getStatus() == LeaveStatus.PENDING).count());
            stats.setDepartmentComplaints((long) complaintRepository.count());
        } else {
            stats.setAssignedStudentsCount(studentProfileRepository.count());
            stats.setFacultyPendingLeaves(leaveRequestRepository.countByStatus(LeaveStatus.PENDING));
            stats.setDepartmentComplaints(complaintRepository.count());
        }

        return stats;
    }

    public List<StudentProfile> getAssignedStudents(Long userId) {
        FacultyProfile profile = getFacultyProfileByUserId(userId);
        if (profile.getUser().getDepartment() != null) {
            return studentProfileRepository.findByUser_DepartmentId(profile.getUser().getDepartment().getId());
        }
        return studentProfileRepository.findAll();
    }

    public List<Attendance> markClassAttendance(Long userId, AttendanceMarkRequest request) {
        return attendanceService.markAttendance(userId, request);
    }

    public List<LeaveRequest> getDepartmentLeaves(Long userId) {
        FacultyProfile profile = getFacultyProfileByUserId(userId);
        if (profile.getUser().getDepartment() != null) {
            return leaveService.getDepartmentLeaveRequests(profile.getUser().getDepartment().getId());
        }
        return leaveService.getAllLeaveRequests();
    }

    public LeaveRequest reviewLeave(Long userId, Long leaveId, LeaveApprovalRequest request) {
        return leaveService.reviewLeaveRequest(leaveId, userId, request);
    }

    public List<Complaint> getComplaintsToReview() {
        return complaintService.getAllComplaints();
    }

    public Complaint updateComplaint(Long userId, Long complaintId, ComplaintStatusUpdateRequest request) {
        return complaintService.updateComplaintStatus(complaintId, userId, request);
    }
}
