package com.smartcampus.repository;

import com.smartcampus.entity.StudentProfile;
import com.smartcampus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByRollNumber(String rollNumber);
    Boolean existsByRollNumber(String rollNumber);
    List<StudentProfile> findByUser_DepartmentId(Long departmentId);
    List<StudentProfile> findByBatch(String batch);
    List<StudentProfile> findBySemester(String semester);
}
