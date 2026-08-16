package com.smartcampus.service;

import com.smartcampus.dto.AnnouncementRequest;
import com.smartcampus.entity.Announcement;
import com.smartcampus.entity.Department;
import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.AnnouncementRepository;
import com.smartcampus.repository.DepartmentRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               DepartmentRepository departmentRepository,
                               UserRepository userRepository,
                               NotificationService notificationService,
                               ActivityLogService activityLogService) {
        this.announcementRepository = announcementRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsForRole(Role role) {
        return announcementRepository.findForRoleOrderByCreatedAtDesc(role);
    }

    public List<Announcement> getAnnouncementsByDepartment(Long departmentId) {
        return announcementRepository.findByDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    @Transactional
    public Announcement createAnnouncement(Long creatorUserId, AnnouncementRequest request) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorUserId));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Announcement announcement = new Announcement(
                request.getTitle(),
                request.getDescription(),
                department,
                request.getPriority(),
                request.getTargetRole(),
                creator
        );

        Announcement saved = announcementRepository.save(announcement);

        // Broadcast notification to targeted users
        List<User> targetUsers;
        if (request.getTargetRole() != null) {
            targetUsers = userRepository.findByRole(request.getTargetRole());
        } else {
            targetUsers = userRepository.findAll();
        }

        notificationService.broadcastNotification(
                targetUsers,
                "New Announcement: " + saved.getTitle(),
                saved.getDescription().length() > 80 ? saved.getDescription().substring(0, 77) + "..." : saved.getDescription(),
                "ANNOUNCEMENT",
                "/announcements"
        );

        activityLogService.logActivity(
                creator.getEmail(),
                "CREATE_ANNOUNCEMENT",
                "Announcement",
                saved.getId().toString(),
                "Published announcement '" + saved.getTitle() + "'",
                null
        );

        return saved;
    }

    @Transactional
    public void deleteAnnouncement(Long id, Long requesterUserId) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));

        announcementRepository.delete(announcement);
    }
}
