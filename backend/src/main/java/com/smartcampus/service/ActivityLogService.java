package com.smartcampus.service;

import com.smartcampus.entity.ActivityLog;
import com.smartcampus.repository.ActivityLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public ActivityLog logActivity(String userEmail, String action, String entityName, String entityId, String details, String ipAddress) {
        ActivityLog log = new ActivityLog(userEmail, action, entityName, entityId, details, ipAddress);
        return activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentLogs() {
        return activityLogRepository.findTop50ByOrderByTimestampDesc();
    }

    public Page<ActivityLog> getLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityLogRepository.findAllByOrderByTimestampDesc(pageable);
    }

    public List<ActivityLog> getLogsByUser(String userEmail) {
        return activityLogRepository.findByUserEmailOrderByTimestampDesc(userEmail);
    }
}
