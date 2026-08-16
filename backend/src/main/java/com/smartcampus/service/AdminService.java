package com.smartcampus.service;

import com.smartcampus.dto.DashboardStatsDTO;
import com.smartcampus.entity.*;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final ComplaintRepository complaintRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final CampusResourceRepository resourceRepository;
    private final CampusEventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final ComplaintService complaintService;

    public AdminService(UserRepository userRepository,
                        StudentProfileRepository studentProfileRepository,
                        FacultyProfileRepository facultyProfileRepository,
                        DepartmentRepository departmentRepository,
                        ComplaintRepository complaintRepository,
                        LeaveRequestRepository leaveRequestRepository,
                        CampusResourceRepository resourceRepository,
                        CampusEventRepository eventRepository,
                        AnnouncementRepository announcementRepository,
                        ComplaintService complaintService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.facultyProfileRepository = facultyProfileRepository;
        this.departmentRepository = departmentRepository;
        this.complaintRepository = complaintRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.resourceRepository = resourceRepository;
        this.eventRepository = eventRepository;
        this.announcementRepository = announcementRepository;
        this.complaintService = complaintService;
    }

    public DashboardStatsDTO getAdminDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalStudents(userRepository.countByRole(Role.ROLE_STUDENT));
        stats.setTotalFaculty(userRepository.countByRole(Role.ROLE_FACULTY));
        stats.setTotalDepartments(departmentRepository.count());
        stats.setActiveComplaints(complaintRepository.countByStatus(ComplaintStatus.SUBMITTED)
                + complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW)
                + complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
        stats.setResolvedComplaints(complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
        stats.setPendingLeaves(leaveRequestRepository.countByStatus(LeaveStatus.PENDING));
        stats.setTotalResources(resourceRepository.count());
        stats.setAvailableResources(resourceRepository.countByStatus(ResourceStatus.AVAILABLE));
        stats.setUpcomingEvents((long) eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now()).size());
        stats.setTotalAnnouncements(announcementRepository.count());

        stats.setComplaintsByCategory(complaintService.getComplaintStatsByCategory());
        stats.setComplaintsByStatus(complaintService.getComplaintStatsByStatus());

        Map<String, Long> deptMap = new HashMap<>();
        List<Department> departments = departmentRepository.findAll();
        for (Department dept : departments) {
            deptMap.put(dept.getCode(), (long) userRepository.findByDepartmentId(dept.getId()).size());
        }
        stats.setUsersByDepartment(deptMap);

        return stats;
    }

    public List<StudentProfile> getAllStudents() {
        return studentProfileRepository.findAll();
    }

    public List<FacultyProfile> getAllFaculty() {
        return facultyProfileRepository.findAll();
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Transactional
    public void toggleUserActiveStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}
