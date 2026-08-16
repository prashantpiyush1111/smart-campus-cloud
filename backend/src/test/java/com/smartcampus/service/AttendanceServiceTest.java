package com.smartcampus.service;

import com.smartcampus.dto.AttendanceSummaryDTO;
import com.smartcampus.entity.AttendanceStatus;
import com.smartcampus.repository.AttendanceRepository;
import com.smartcampus.repository.FacultyProfileRepository;
import com.smartcampus.repository.StudentProfileRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private FacultyProfileRepository facultyProfileRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private AttendanceService attendanceService;

    @Test
    @DisplayName("Should accurately calculate subject attendance summary and percentage")
    void testCalculateAttendanceSummary() {
        Long studentProfileId = 1L;
        String subject = "Cloud Computing & DevOps";

        when(attendanceRepository.findDistinctSubjectsByStudentId(studentProfileId)).thenReturn(List.of(subject));
        when(attendanceRepository.countByStudentIdAndSubject(studentProfileId, subject)).thenReturn(10L);
        when(attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.PRESENT)).thenReturn(8L);
        when(attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.ABSENT)).thenReturn(1L);
        when(attendanceRepository.countByStudentIdAndSubjectAndStatus(studentProfileId, subject, AttendanceStatus.LATE)).thenReturn(1L);

        List<AttendanceSummaryDTO> summaries = attendanceService.getStudentAttendanceSummary(studentProfileId);

        assertNotNull(summaries);
        assertEquals(1, summaries.size());

        AttendanceSummaryDTO summary = summaries.get(0);
        assertEquals(subject, summary.getSubject());
        assertEquals(10L, summary.getTotalClasses());
        assertEquals(8L, summary.getAttendedClasses());
        assertEquals(1L, summary.getAbsentClasses());
        assertEquals(1L, summary.getLateClasses());
        assertEquals(90.0, summary.getPercentage()); // (8 + 1) / 10 = 90%
    }
}
