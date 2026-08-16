package com.smartcampus.repository;

import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.ComplaintCategory;
import com.smartcampus.entity.ComplaintStatus;
import com.smartcampus.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintCode(String complaintCode);
    List<Complaint> findByStudent(StudentProfile student);
    List<Complaint> findByStudentId(Long studentId);
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategory(ComplaintCategory category);
    List<Complaint> findByAssignedToId(Long userId);

    long countByStatus(ComplaintStatus status);
    long countByCategory(ComplaintCategory category);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, ComplaintStatus status);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countComplaintsByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countComplaintsByStatus();
}
