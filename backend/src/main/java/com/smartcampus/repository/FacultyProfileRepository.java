package com.smartcampus.repository;

import com.smartcampus.entity.FacultyProfile;
import com.smartcampus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    Optional<FacultyProfile> findByUser(User user);
    Optional<FacultyProfile> findByUserId(Long userId);
    Optional<FacultyProfile> findByEmployeeCode(String employeeCode);
    Boolean existsByEmployeeCode(String employeeCode);
    List<FacultyProfile> findByUser_DepartmentId(Long departmentId);
}
