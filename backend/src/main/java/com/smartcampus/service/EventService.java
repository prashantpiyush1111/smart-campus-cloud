package com.smartcampus.service;

import com.smartcampus.dto.EventRequest;
import com.smartcampus.entity.CampusEvent;
import com.smartcampus.entity.User;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.CampusEventRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    private final CampusEventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityLogService activityLogService;

    public EventService(CampusEventRepository eventRepository,
                        UserRepository userRepository,
                        NotificationService notificationService,
                        ActivityLogService activityLogService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.activityLogService = activityLogService;
    }

    public List<CampusEvent> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    public List<CampusEvent> getUpcomingEvents() {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now());
    }

    public CampusEvent getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CampusEvent", "id", id));
    }

    @Transactional
    public CampusEvent createEvent(Long creatorUserId, EventRequest request) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorUserId));

        CampusEvent event = new CampusEvent(
                request.getEventName(),
                request.getDescription(),
                request.getEventDate(),
                request.getTime(),
                request.getVenue(),
                request.getOrganizer(),
                request.getMaxParticipants(),
                creator
        );

        CampusEvent saved = eventRepository.save(event);

        // Notify all users
        notificationService.broadcastNotification(
                userRepository.findAll(),
                "Upcoming Event: " + saved.getEventName(),
                "Date: " + saved.getEventDate() + " at " + saved.getVenue(),
                "EVENT",
                "/events"
        );

        activityLogService.logActivity(
                creator.getEmail(),
                "CREATE_EVENT",
                "CampusEvent",
                saved.getId().toString(),
                "Created event: " + saved.getEventName(),
                null
        );

        return saved;
    }

    @Transactional
    public CampusEvent registerForEvent(Long eventId, Long userId) {
        CampusEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("CampusEvent", "id", eventId));

        if (event.getRegisteredCount() >= event.getMaxParticipants()) {
            throw new BadRequestException("Event is already fully booked!");
        }

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        CampusEvent updated = eventRepository.save(event);

        notificationService.createNotification(
                userId,
                "Registered for Event: " + event.getEventName(),
                "You have successfully registered. See you on " + event.getEventDate() + " at " + event.getVenue(),
                "EVENT",
                "/events"
        );

        return updated;
    }

    @Transactional
    public void deleteEvent(Long id) {
        CampusEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CampusEvent", "id", id));

        eventRepository.delete(event);
    }
}
