package com.smartcampus.repository;

import com.smartcampus.entity.Attendance;
import com.smartcampus.entity.AttendanceStatus;
import com.smartcampus.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent(StudentProfile student);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByStudentIdAndSubject(Long studentId, String subject);
    List<Attendance> findByAttendanceDateAndSubject(LocalDate date, String subject);
    List<Attendance> findByFacultyId(Long facultyId);

    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByStudentIdAndSubject(Long studentId, String subject);
    long countByStudentIdAndSubjectAndStatus(Long studentId, String subject, AttendanceStatus status);

    @Query("SELECT DISTINCT a.subject FROM Attendance a WHERE a.student.id = :studentId")
    List<String> findDistinctSubjectsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT DISTINCT a.subject FROM Attendance a")
    List<String> findAllDistinctSubjects();
}
