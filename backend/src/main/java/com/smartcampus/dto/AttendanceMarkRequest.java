package com.smartcampus.dto;

import com.smartcampus.entity.AttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class AttendanceMarkRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotEmpty(message = "Attendance items cannot be empty")
    private List<AttendanceItem> items;

    public AttendanceMarkRequest() {
    }

    public static class AttendanceItem {
        private Long studentId;
        private AttendanceStatus status;
        private String remarks;

        public AttendanceItem() {
        }

        public AttendanceItem(Long studentId, AttendanceStatus status, String remarks) {
            this.studentId = studentId;
            this.status = status;
            this.remarks = remarks;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public AttendanceStatus getStatus() {
            return status;
        }

        public void setStatus(AttendanceStatus status) {
            this.status = status;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public List<AttendanceItem> getItems() {
        return items;
    }

    public void setItems(List<AttendanceItem> items) {
        this.items = items;
    }
}
