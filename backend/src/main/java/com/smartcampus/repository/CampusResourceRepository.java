package com.smartcampus.repository;

import com.smartcampus.entity.CampusResource;
import com.smartcampus.entity.ResourceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusResourceRepository extends JpaRepository<CampusResource, Long> {
    List<CampusResource> findByStatus(ResourceStatus status);
    List<CampusResource> findByResourceType(String resourceType);
    long countByStatus(ResourceStatus status);
}
