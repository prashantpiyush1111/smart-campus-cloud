package com.smartcampus.repository;

import com.smartcampus.entity.LeaveRequest;
import com.smartcampus.entity.LeaveStatus;
import com.smartcampus.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudent(StudentProfile student);
    List<LeaveRequest> findByStudentId(Long studentId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStudent_User_DepartmentId(Long departmentId);
    long countByStatus(LeaveStatus status);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, LeaveStatus status);
}
