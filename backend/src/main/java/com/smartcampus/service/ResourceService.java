package com.smartcampus.service;

import com.smartcampus.dto.ResourceBookingRequest;
import com.smartcampus.dto.ResourceRequest;
import com.smartcampus.entity.CampusResource;
import com.smartcampus.entity.ResourceStatus;
import com.smartcampus.entity.User;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.CampusResourceRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    private final CampusResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public ResourceService(CampusResourceRepository resourceRepository,
                           UserRepository userRepository,
                           ActivityLogService activityLogService) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    public List<CampusResource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<CampusResource> getAvailableResources() {
        return resourceRepository.findByStatus(ResourceStatus.AVAILABLE);
    }

    public CampusResource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CampusResource", "id", id));
    }

    @Transactional
    public CampusResource createResource(ResourceRequest request) {
        CampusResource resource = new CampusResource(
                request.getResourceName(),
                request.getResourceType(),
                request.getLocation(),
                request.getCapacity(),
                request.getStatus()
        );
        return resourceRepository.save(resource);
    }

    @Transactional
    public CampusResource updateResource(Long id, ResourceRequest request) {
        CampusResource resource = getResourceById(id);
        resource.setResourceName(request.getResourceName());
        resource.setResourceType(request.getResourceType());
        resource.setLocation(request.getLocation());
        resource.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            resource.setStatus(request.getStatus());
        }
        return resourceRepository.save(resource);
    }

    @Transactional
    public CampusResource bookResource(Long resourceId, Long userId, ResourceBookingRequest request) {
        CampusResource resource = getResourceById(resourceId);
        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new BadRequestException("Resource is not currently available for booking");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        resource.setStatus(ResourceStatus.OCCUPIED);
        resource.setBookedBy(user);
        resource.setBookingPurpose(request.getBookingPurpose());

        CampusResource saved = resourceRepository.save(resource);

        activityLogService.logActivity(
                user.getEmail(),
                "BOOK_RESOURCE",
                "CampusResource",
                resource.getId().toString(),
                "Booked " + resource.getResourceName() + " for: " + request.getBookingPurpose(),
                null
        );

        return saved;
    }

    @Transactional
    public CampusResource releaseResource(Long resourceId) {
        CampusResource resource = getResourceById(resourceId);
        resource.setStatus(ResourceStatus.AVAILABLE);
        resource.setBookedBy(null);
        resource.setBookingPurpose(null);
        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        CampusResource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}
