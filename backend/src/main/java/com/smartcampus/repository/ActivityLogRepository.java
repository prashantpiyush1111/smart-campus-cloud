package com.smartcampus.repository;

import com.smartcampus.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop50ByOrderByTimestampDesc();
    Page<ActivityLog> findAllByOrderByTimestampDesc(Pageable pageable);
    List<ActivityLog> findByUserEmailOrderByTimestampDesc(String userEmail);
    long countByAction(String action);
}
