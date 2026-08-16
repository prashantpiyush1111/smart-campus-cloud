package com.smartcampus.dto;

import java.util.Map;

public class DashboardStatsDTO {
    // Admin stats
    private Long totalStudents;
    private Long totalFaculty;
    private Long totalDepartments;
    private Long activeComplaints;
    private Long resolvedComplaints;
    private Long pendingLeaves;
    private Long totalResources;
    private Long availableResources;
    private Long upcomingEvents;
    private Long totalAnnouncements;

    // Faculty stats
    private Long assignedStudentsCount;
    private Long facultyPendingLeaves;
    private Long departmentComplaints;

    // Student stats
    private Double overallAttendancePercentage;
    private Long totalComplaintsSubmitted;
    private Long totalLeavesSubmitted;
    private Long unreadNotificationsCount;

    // Analytics breakdown
    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByStatus;
    private Map<String, Long> usersByDepartment;

    public DashboardStatsDTO() {
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalFaculty() {
        return totalFaculty;
    }

    public void setTotalFaculty(Long totalFaculty) {
        this.totalFaculty = totalFaculty;
    }

    public Long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(Long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public Long getActiveComplaints() {
        return activeComplaints;
    }

    public void setActiveComplaints(Long activeComplaints) {
        this.activeComplaints = activeComplaints;
    }

    public Long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(Long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public Long getPendingLeaves() {
        return pendingLeaves;
    }

    public void setPendingLeaves(Long pendingLeaves) {
        this.pendingLeaves = pendingLeaves;
    }

    public Long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(Long totalResources) {
        this.totalResources = totalResources;
    }

    public Long getAvailableResources() {
        return availableResources;
    }

    public void setAvailableResources(Long availableResources) {
        this.availableResources = availableResources;
    }

    public Long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(Long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public Long getTotalAnnouncements() {
        return totalAnnouncements;
    }

    public void setTotalAnnouncements(Long totalAnnouncements) {
        this.totalAnnouncements = totalAnnouncements;
    }

    public Long getAssignedStudentsCount() {
        return assignedStudentsCount;
    }

    public void setAssignedStudentsCount(Long assignedStudentsCount) {
        this.assignedStudentsCount = assignedStudentsCount;
    }

    public Long getFacultyPendingLeaves() {
        return facultyPendingLeaves;
    }

    public void setFacultyPendingLeaves(Long facultyPendingLeaves) {
        this.facultyPendingLeaves = facultyPendingLeaves;
    }

    public Long getDepartmentComplaints() {
        return departmentComplaints;
    }

    public void setDepartmentComplaints(Long departmentComplaints) {
        this.departmentComplaints = departmentComplaints;
    }

    public Double getOverallAttendancePercentage() {
        return overallAttendancePercentage;
    }

    public void setOverallAttendancePercentage(Double overallAttendancePercentage) {
        this.overallAttendancePercentage = overallAttendancePercentage;
    }

    public Long getTotalComplaintsSubmitted() {
        return totalComplaintsSubmitted;
    }

    public void setTotalComplaintsSubmitted(Long totalComplaintsSubmitted) {
        this.totalComplaintsSubmitted = totalComplaintsSubmitted;
    }

    public Long getTotalLeavesSubmitted() {
        return totalLeavesSubmitted;
    }

    public void setTotalLeavesSubmitted(Long totalLeavesSubmitted) {
        this.totalLeavesSubmitted = totalLeavesSubmitted;
    }

    public Long getUnreadNotificationsCount() {
        return unreadNotificationsCount;
    }

    public void setUnreadNotificationsCount(Long unreadNotificationsCount) {
        this.unreadNotificationsCount = unreadNotificationsCount;
    }

    public Map<String, Long> getComplaintsByCategory() {
        return complaintsByCategory;
    }

    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) {
        this.complaintsByCategory = complaintsByCategory;
    }

    public Map<String, Long> getComplaintsByStatus() {
        return complaintsByStatus;
    }

    public void setComplaintsByStatus(Map<String, Long> complaintsByStatus) {
        this.complaintsByStatus = complaintsByStatus;
    }

    public Map<String, Long> getUsersByDepartment() {
        return usersByDepartment;
    }

    public void setUsersByDepartment(Map<String, Long> usersByDepartment) {
        this.usersByDepartment = usersByDepartment;
    }
}
