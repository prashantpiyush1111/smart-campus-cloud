package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.EventRequest;
import com.smartcampus.entity.CampusEvent;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampusEvent>>> getAllEvents() {
        List<CampusEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success("Events fetched", events));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<CampusEvent>>> getUpcomingEvents() {
        List<CampusEvent> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(ApiResponse.success("Upcoming events fetched", events));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<CampusEvent>> createEvent(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                @Valid @RequestBody EventRequest request) {
        CampusEvent event = eventService.createEvent(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Event created successfully", event));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<CampusEvent>> registerForEvent(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                    @PathVariable Long id) {
        CampusEvent event = eventService.registerForEvent(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Successfully registered for event", event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully"));
    }
}
