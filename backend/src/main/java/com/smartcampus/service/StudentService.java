package com.smartcampus.service;

import com.smartcampus.dto.AttendanceSummaryDTO;
import com.smartcampus.dto.ComplaintRequest;
import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.dto.LeaveRequestDTO;
import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.ComplaintRepository;
import com.smartcampus.repository.LeaveRequestRepository;
import com.smartcampus.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final AttendanceService attendanceService;
    private final ComplaintService complaintService;
    private final LeaveService leaveService;
    private final ComplaintRepository complaintRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationService notificationService;

    public StudentService(StudentProfileRepository studentProfileRepository,
                          AttendanceService attendanceService,
                          ComplaintService complaintService,
                          LeaveService leaveService,
                          ComplaintRepository complaintRepository,
                          LeaveRequestRepository leaveRequestRepository,
                          NotificationService notificationService) {
        this.studentProfileRepository = studentProfileRepository;
        this.attendanceService = attendanceService;
        this.complaintService = complaintService;
        this.leaveService = leaveService;
        this.complaintRepository = complaintRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationService = notificationService;
    }

    public StudentProfile getStudentProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "userId", userId));
    }

    public DashboardStatsDTO getStudentDashboardStats(Long userId) {
        StudentProfile profile = getStudentProfileByUserId(userId);
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setOverallAttendancePercentage(attendanceService.getStudentOverallPercentage(profile.getId()));
        stats.setTotalComplaintsSubmitted(complaintRepository.countByStudentId(profile.getId()));
        stats.setTotalLeavesSubmitted(leaveRequestRepository.countByStudentId(profile.getId()));
        stats.setUnreadNotificationsCount(notificationService.getUnreadCount(userId));

        return stats;
    }

    public List<AttendanceSummaryDTO> getAttendanceSummary(Long userId) {
        StudentProfile profile = getStudentProfileByUserId(userId);
        return attendanceService.getStudentAttendanceSummary(profile.getId());
    }

    public List<Attendance> getAttendanceHistory(Long userId) {
        StudentProfile profile = getStudentProfileByUserId(userId);
        return attendanceService.getStudentAttendanceRecords(profile.getId());
    }

    public List<Complaint> getComplaints(Long userId) {
        StudentProfile profile = getStudentProfileByUserId(userId);
        return complaintService.getComplaintsByStudent(profile.getId());
    }

    public Complaint submitComplaint(Long userId, ComplaintRequest request) {
        return complaintService.createComplaint(userId, request);
    }

    public List<LeaveRequest> getLeaveRequests(Long userId) {
        StudentProfile profile = getStudentProfileByUserId(userId);
        return leaveService.getStudentLeaveRequests(profile.getId());
    }

    public LeaveRequest submitLeaveRequest(Long userId, LeaveRequestDTO request) {
        return leaveService.submitLeaveRequest(userId, request);
    }
}
