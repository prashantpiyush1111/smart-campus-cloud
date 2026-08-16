package com.smartcampus.config;

import com.smartcampus.entity.*;
import com.smartcampus.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ComplaintRepository complaintRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AnnouncementRepository announcementRepository;
    private final CampusEventRepository eventRepository;
    private final CampusResourceRepository resourceRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository studentProfileRepository,
                           FacultyProfileRepository facultyProfileRepository,
                           DepartmentRepository departmentRepository,
                           AttendanceRepository attendanceRepository,
                           ComplaintRepository complaintRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           AnnouncementRepository announcementRepository,
                           CampusEventRepository eventRepository,
                           CampusResourceRepository resourceRepository,
                           NotificationRepository notificationRepository,
                           ActivityLogRepository activityLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.facultyProfileRepository = facultyProfileRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.complaintRepository = complaintRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.resourceRepository = resourceRepository;
        this.notificationRepository = notificationRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data population.");
            return;
        }

        logger.info("Initializing Smart Campus Cloud seed database...");

        // 1. Departments
        Department cse = departmentRepository.save(new Department("Computer Science & Engineering", "CSE", "Block A, Tech Campus"));
        Department ece = departmentRepository.save(new Department("Electronics & Communication Engineering", "ECE", "Block B, Tech Campus"));
        Department mech = departmentRepository.save(new Department("Mechanical Engineering", "MECH", "Block C, Workshop Complex"));
        Department it = departmentRepository.save(new Department("Information Technology", "IT", "Block A, Level 3"));

        // 2. Admin User
        User adminUser = new User("admin@campus.edu", passwordEncoder.encode("Admin@123"), "Campus Administrator", Role.ROLE_ADMIN, "+1 (555) 019-2831", cse);
        adminUser = userRepository.save(adminUser);

        // 3. Faculty Users
        User faculty1User = new User("faculty@campus.edu", passwordEncoder.encode("Faculty@123"), "Dr. Alan Turing", Role.ROLE_FACULTY, "+1 (555) 014-9921", cse);
        faculty1User = userRepository.save(faculty1User);
        FacultyProfile faculty1 = facultyProfileRepository.save(new FacultyProfile(faculty1User, "FAC-CSE-001", "Associate Professor", "Ph.D. in Computer Science", "Distributed Systems & Cloud Security"));

        User faculty2User = new User("prof.sarah@campus.edu", passwordEncoder.encode("Faculty@123"), "Prof. Sarah Connor", Role.ROLE_FACULTY, "+1 (555) 018-7744", ece);
        faculty2User = userRepository.save(faculty2User);
        facultyProfileRepository.save(new FacultyProfile(faculty2User, "FAC-ECE-002", "Assistant Professor", "M.Tech in VLSI", "Embedded IoT Systems"));

        // 4. Student Users
        User student1User = new User("student@campus.edu", passwordEncoder.encode("Student@123"), "Alex Johnson", Role.ROLE_STUDENT, "+1 (555) 012-3456", cse);
        student1User = userRepository.save(student1User);
        StudentProfile student1 = studentProfileRepository.save(new StudentProfile(student1User, "CS2024001", "ADM-2024-001", "Semester 6", "2023-2027", 8.85, "Robert Johnson", "+1 (555) 019-3322"));

        User student2User = new User("jane.doe@campus.edu", passwordEncoder.encode("Student@123"), "Jane Doe", Role.ROLE_STUDENT, "+1 (555) 012-9876", cse);
        student2User = userRepository.save(student2User);
        StudentProfile student2 = studentProfileRepository.save(new StudentProfile(student2User, "CS2024002", "ADM-2024-002", "Semester 6", "2023-2027", 9.12, "Arthur Doe", "+1 (555) 019-4455"));

        User student3User = new User("mark.smith@campus.edu", passwordEncoder.encode("Student@123"), "Mark Smith", Role.ROLE_STUDENT, "+1 (555) 012-7711", ece);
        student3User = userRepository.save(student3User);
        StudentProfile student3 = studentProfileRepository.save(new StudentProfile(student3User, "EC2024015", "ADM-2024-015", "Semester 4", "2024-2028", 7.90, "David Smith", "+1 (555) 019-5566"));

        // 5. Attendance Records
        String[] subjects = {"Cloud Computing & DevOps", "Distributed Systems", "Database Management Systems", "Machine Learning & AI"};
        LocalDate baseDate = LocalDate.now().minusDays(10);

        for (int i = 0; i < 8; i++) {
            LocalDate date = baseDate.plusDays(i);
            attendanceRepository.save(new Attendance(student1, subjects[0], faculty1, date, AttendanceStatus.PRESENT, "Regular lecture"));
            attendanceRepository.save(new Attendance(student2, subjects[0], faculty1, date, AttendanceStatus.PRESENT, "Regular lecture"));

            attendanceRepository.save(new Attendance(student1, subjects[1], faculty1, date, (i == 3 || i == 6) ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT, (i == 3 || i == 6) ? "Medical absence" : "Active participation"));
            attendanceRepository.save(new Attendance(student2, subjects[1], faculty1, date, AttendanceStatus.PRESENT, "Regular lecture"));

            attendanceRepository.save(new Attendance(student1, subjects[2], faculty1, date, (i == 5) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT, (i == 5) ? "10 min late" : "Regular lab"));
            attendanceRepository.save(new Attendance(student1, subjects[3], faculty1, date, AttendanceStatus.PRESENT, "AI Lab"));
        }

        // 6. Complaints
        Complaint c1 = new Complaint("CMP-2026-8801", student1, ComplaintCategory.INTERNET, "Wi-Fi Connectivity issues in Library 2nd Floor", "High packet loss and intermittent disconnects near the study desks on 2nd floor east wing.", "Central Library - 2nd Floor East", ComplaintPriority.HIGH);
        c1.setStatus(ComplaintStatus.IN_PROGRESS);
        c1.setAssignedTo(faculty1User);
        c1.setResolutionRemarks("IT Infrastructure team is inspecting the Cisco Access Point switch.");
        complaintRepository.save(c1);

        Complaint c2 = new Complaint("CMP-2026-8802", student1, ComplaintCategory.CLASSROOM, "Projector HDMI Port malfunctioning in Hall 302", "HDMI cable port displays pink tint on screen during presentations.", "Block A - Room 302", ComplaintPriority.MEDIUM);
        c2.setStatus(ComplaintStatus.UNDER_REVIEW);
        complaintRepository.save(c2);

        Complaint c3 = new Complaint("CMP-2026-8803", student2, ComplaintCategory.WATER, "Water cooler tap leaking on Ground Floor", "Continuous drip from the cold water dispensing tap causing water accumulation.", "Block B Ground Floor Lobby", ComplaintPriority.LOW);
        c3.setStatus(ComplaintStatus.RESOLVED);
        c3.setResolutionRemarks("Valve gasket replaced by campus maintenance.");
        complaintRepository.save(c3);

        Complaint c4 = new Complaint("CMP-2026-8804", student1, ComplaintCategory.ELECTRICAL, "AC unit making rattling sound in Lab 4", "Air conditioning unit near window vibrates loudly when cooling kicks in.", "Block A - Lab 4", ComplaintPriority.MEDIUM);
        c4.setStatus(ComplaintStatus.SUBMITTED);
        complaintRepository.save(c4);

        // 7. Leave Requests
        LeaveRequest l1 = new LeaveRequest(student1, LocalDate.now().plusDays(2), LocalDate.now().plusDays(4), "Attending National Inter-College Hackathon at Tech Institute.");
        l1.setStatus(LeaveStatus.APPROVED);
        l1.setReviewedBy(faculty1User);
        l1.setFacultyRemarks("Approved. Representing college in national hackathon.");
        leaveRequestRepository.save(l1);

        LeaveRequest l2 = new LeaveRequest(student1, LocalDate.now().plusDays(10), LocalDate.now().plusDays(12), "Family medical emergency and urgent travel.");
        l2.setStatus(LeaveStatus.PENDING);
        leaveRequestRepository.save(l2);

        LeaveRequest l3 = new LeaveRequest(student2, LocalDate.now().plusDays(5), LocalDate.now().plusDays(6), "Attending AWS Certified Cloud Practitioner exam center.");
        l3.setStatus(LeaveStatus.APPROVED);
        l3.setReviewedBy(faculty1User);
        l3.setFacultyRemarks("Approved. Good luck with certification.");
        leaveRequestRepository.save(l3);

        // 8. Announcements
        announcementRepository.save(new Announcement("Mid-Term Examination Schedule Released", "The tentative schedule for Mid-Term 2026 examinations has been published on the student portal. Review dates and report discrepancies to department office.", cse, ComplaintPriority.HIGH, Role.ROLE_STUDENT, adminUser));
        announcementRepository.save(new Announcement("Campus Cloud Computing & Kubernetes Workshop", "Join us this Friday in Seminar Hall B for a hands-on workshop on AWS ECS and Spring Boot microservices deployment.", cse, ComplaintPriority.MEDIUM, null, faculty1User));
        announcementRepository.save(new Announcement("Library Extended Hours for Finals", "Central Library will remain open until 11:00 PM starting next Monday through final examination week.", null, ComplaintPriority.LOW, null, adminUser));

        // 9. Campus Events
        eventRepository.save(new CampusEvent("Smart Campus Hackathon 2026", "24-hour national hackathon focused on AI, Cloud, and IoT smart city solutions. Cash prizes and internship opportunities.", LocalDate.now().plusDays(7), "09:00 AM - 09:00 AM (Next Day)", "Innovation & Incubation Center", "CSE Student Council", 150, faculty1User));
        eventRepository.save(new CampusEvent("Cloud Architecture & DevOps Symposium", "Guest lectures by industry architects on AWS CDK, Terraform, and Kubernetes orchestration.", LocalDate.now().plusDays(14), "10:00 AM - 04:30 PM", "Main Auditorium Hall A", "Department of Computer Science", 250, faculty1User));
        eventRepository.save(new CampusEvent("Annual Sports & Cultural Gala", "Inter-department football, basketball, robotic wars, and music competitions.", LocalDate.now().plusDays(25), "08:30 AM - 07:00 PM", "Campus Sports Complex", "Student Affairs Committee", 500, adminUser));

        // 10. Campus Resources
        resourceRepository.save(new CampusResource("Cloud & High-Performance Computing Lab 401", "Computer Lab", "Block A, 4th Floor", 60, ResourceStatus.AVAILABLE));
        CampusResource res2 = new CampusResource("Smart Seminar Hall B", "Auditorium", "Block A, Ground Floor", 120, ResourceStatus.OCCUPIED);
        res2.setBookedBy(faculty1User);
        res2.setBookingPurpose("Cloud Computing Guest Lecture & Demo");
        resourceRepository.save(res2);
        resourceRepository.save(new CampusResource("Embedded Systems & IoT Lab 202", "Electronics Lab", "Block B, 2nd Floor", 45, ResourceStatus.AVAILABLE));
        resourceRepository.save(new CampusResource("Main Conference & Syndicate Room", "Meeting Room", "Administrative Block, Level 1", 25, ResourceStatus.AVAILABLE));
        resourceRepository.save(new CampusResource("Robotics & Prototyping Workshop", "Makerspace", "Block C, Workshop Complex", 40, ResourceStatus.MAINTENANCE));

        // 11. Notifications
        notificationRepository.save(new Notification(student1User, "Leave Request Approved", "Your leave application for upcoming hackathon was approved by Dr. Alan Turing.", "LEAVE_STATUS", "/student/leave"));
        notificationRepository.save(new Notification(student1User, "Complaint In Progress", "Complaint CMP-2026-8801 status changed to IN PROGRESS.", "COMPLAINT_UPDATE", "/student/complaints"));
        notificationRepository.save(new Notification(student1User, "New Announcement: Mid-Term Schedule", "Mid-term examination schedule has been released.", "ANNOUNCEMENT", "/announcements"));

        notificationRepository.save(new Notification(faculty1User, "New Leave Request to Review", "Alex Johnson has submitted a new leave application.", "LEAVE_STATUS", "/faculty/leave-requests"));
        notificationRepository.save(new Notification(adminUser, "System Initialized", "Smart Campus Cloud platform initialized with sample college records.", "SYSTEM_ALERT", "/admin/dashboard"));

        // 12. Activity Logs
        activityLogRepository.save(new ActivityLog("admin@campus.edu", "SYSTEM_INIT", "Database", "ALL", "Initial college departments and sample users generated", "127.0.0.1"));
        activityLogRepository.save(new ActivityLog("faculty@campus.edu", "MARK_ATTENDANCE", "Attendance", "Cloud Computing & DevOps", "Marked 8 sessions of attendance", "192.168.1.50"));
        activityLogRepository.save(new ActivityLog("student@campus.edu", "SUBMIT_COMPLAINT", "Complaint", "CMP-2026-8801", "Submitted Wi-Fi connectivity issue", "192.168.1.102"));

        logger.info("Smart Campus Cloud seed data populated successfully!");
    }
}
