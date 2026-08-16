package com.smartcampus.controller;

import com.smartcampus.dto.AnnouncementRequest;
import com.smartcampus.dto.ApiResponse;
import com.smartcampus.entity.Announcement;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements() {
        List<Announcement> list = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(ApiResponse.success("Announcements fetched", list));
    }

    @GetMapping("/my-role")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncementsForMyRole(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Announcement> list = announcementService.getAnnouncementsForRole(userPrincipal.getRole());
        return ResponseEntity.ok(ApiResponse.success("Role announcements fetched", list));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @Valid @RequestBody AnnouncementRequest request) {
        Announcement announcement = announcementService.createAnnouncement(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Announcement published successfully", announcement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAnnouncement(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                  @PathVariable Long id) {
        announcementService.deleteAnnouncement(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully"));
    }
}
