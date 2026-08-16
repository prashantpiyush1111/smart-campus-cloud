package com.smartcampus.dto;

import com.smartcampus.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public class LeaveApprovalRequest {

    @NotNull(message = "Status is required")
    private LeaveStatus status;

    private String facultyRemarks;

    public LeaveApprovalRequest() {
    }

    public LeaveApprovalRequest(LeaveStatus status, String facultyRemarks) {
        this.status = status;
        this.facultyRemarks = facultyRemarks;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }

    public String getFacultyRemarks() {
        return facultyRemarks;
    }

    public void setFacultyRemarks(String facultyRemarks) {
        this.facultyRemarks = facultyRemarks;
    }
}
