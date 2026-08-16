package com.smartcampus.service;

import com.smartcampus.dto.AttendanceMarkRequest;
import com.smartcampus.dto.AttendanceSummaryDTO;
import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.AttendanceStatus;
import com.smartcampus.entity.FacultyProfile;
import com.smartcampus.entity.StudentProfile;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.AttendanceRepository;
import com.smartcampus.repository.FacultyProfileRepository;
import com.smartcampus.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentProfileRepository studentProfileRepository,
                             FacultyProfileRepository facultyProfileRepository,
                             NotificationService notificationService,
                             ActivityLogService activityLogService) {
        this.attendanceRepository = attendanceRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.facultyProfileRepository = facultyProfileRepository;
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }

    public List<Attendance> getStudentAttendanceRecords(Long studentProfileId) {
        return attendanceRepository.findByStudentId(studentProfileId);
    }

    public List<AttendanceSummaryDTO> getStudentAttendanceSummary(Long studentProfileId) {
        List<String> subjects = attendanceRepository.findDistinctSubjectsByStudentId(studentProfileId);
        List<AttendanceSummaryDTO> summaries = new ArrayList<>();

        for (String subject : subjects) {
            long total = attendanceRepository.countByStudentIdAndSubject(studentProfileId, subject);
            long present = attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.PRESENT);
            long absent = attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.ABSENT);
            long late = attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.LATE);

            // Calculate percentage (present + late counts towards attendance)
            double percentage = total > 0 ? ((double) (present + late) / total) * 100.0 : 0.0;
            percentage = Math.round(percentage * 100.0) / 100.0;

            summaries.add(new AttendanceSummaryDTO(subject, total, present, absent, late, percentage));
        }

        return summaries;
    }

    public double getStudentOverallPercentage(Long studentProfileId) {
        long total = attendanceRepository.countByStudentId(studentProfileId);
        if (total == 0) return 100.0;

        long present = attendanceRepository.countByStudentIdAndStatus(studentProfileId, AttendanceStatus.PRESENT);
        long late = attendanceRepository.countByStudentIdAndStatus(studentProfileId, AttendanceStatus.LATE);

        double percentage = ((double) (present + late) / total) * 100.0;
        return Math.round(percentage * 100.0) / 100.0;
    }

    @Transactional
    public List<Attendance> markAttendance(Long facultyUserId, AttendanceMarkRequest request) {
        FacultyProfile faculty = facultyProfileRepository.findByUserId(facultyUserId)
                .orElse(null);

        List<Attendance> records = new ArrayList<>();

        for (AttendanceMarkRequest.AttendanceItem item : request.getItems()) {
            StudentProfile student = studentProfileRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "id", item.getStudentId()));

            Attendance attendance = new Attendance(
                    student,
                    request.getSubject(),
                    faculty,
                    request.getAttendanceDate(),
                    item.getStatus() != null ? item.getStatus() : AttendanceStatus.PRESENT,
                    item.getRemarks()
            );

            records.add(attendance);

            // Send notification if student is marked absent
            if (item.getStatus() == AttendanceStatus.ABSENT) {
                notificationService.createNotification(
                        student.getUser().getId(),
                        "Attendance Alert: Marked Absent",
                        "You were marked ABSENT for " + request.getSubject() + " on " + request.getAttendanceDate(),
                        "ATTENDANCE_ALERT",
                        "/student/attendance"
                );
            }
        }

        List<Attendance> saved = attendanceRepository.saveAll(records);

        String facultyEmail = faculty != null ? faculty.getUser().getEmail() : "faculty@campus.edu";
        activityLogService.logActivity(
                facultyEmail,
                "MARK_ATTENDANCE",
                "Attendance",
                request.getSubject(),
                "Marked attendance for " + records.size() + " students on " + request.getAttendanceDate(),
                null
        );

        return saved;
    }

    public List<Attendance> getAttendanceByDateAndSubject(LocalDate date, String subject) {
        return attendanceRepository.findByAttendanceDateAndSubject(date, subject);
    }
}
