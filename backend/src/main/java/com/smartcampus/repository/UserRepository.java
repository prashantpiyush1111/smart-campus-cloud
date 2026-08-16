package com.smartcampus.repository;

import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByDepartmentId(Long departmentId);
    long countByRole(Role role);
    long countByActive(boolean active);
}
