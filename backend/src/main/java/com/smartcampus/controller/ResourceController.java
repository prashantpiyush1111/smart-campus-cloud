package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.ResourceBookingRequest;
import com.smartcampus.dto.ResourceRequest;
import com.smartcampus.entity.CampusResource;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampusResource>>> getAllResources() {
        List<CampusResource> list = resourceService.getAllResources();
        return ResponseEntity.ok(ApiResponse.success("Resources fetched", list));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<CampusResource>>> getAvailableResources() {
        List<CampusResource> list = resourceService.getAvailableResources();
        return ResponseEntity.ok(ApiResponse.success("Available resources fetched", list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CampusResource>> createResource(@Valid @RequestBody ResourceRequest request) {
        CampusResource resource = resourceService.createResource(request);
        return ResponseEntity.ok(ApiResponse.success("Resource created successfully", resource));
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<ApiResponse<CampusResource>> bookResource(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                   @PathVariable Long id,
                                                                   @Valid @RequestBody ResourceBookingRequest request) {
        CampusResource resource = resourceService.bookResource(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Resource booked successfully", resource));
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<ApiResponse<CampusResource>> releaseResource(@PathVariable Long id) {
        CampusResource resource = resourceService.releaseResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource released successfully", resource));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully"));
    }
}
