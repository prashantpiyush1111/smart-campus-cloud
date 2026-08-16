package com.smartcampus.dto;

public class AttendanceSummaryDTO {
    private String subject;
    private long totalClasses;
    private long attendedClasses;
    private long absentClasses;
    private long lateClasses;
    private double percentage;

    public AttendanceSummaryDTO() {
    }

    public AttendanceSummaryDTO(String subject, long totalClasses, long attendedClasses, long absentClasses, long lateClasses, double percentage) {
        this.subject = subject;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.absentClasses = absentClasses;
        this.lateClasses = lateClasses;
        this.percentage = percentage;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getAttendedClasses() {
        return attendedClasses;
    }

    public void setAttendedClasses(long attendedClasses) {
        this.attendedClasses = attendedClasses;
    }

    public long getAbsentClasses() {
        return absentClasses;
    }

    public void setAbsentClasses(long absentClasses) {
        this.absentClasses = absentClasses;
    }

    public long getLateClasses() {
        return lateClasses;
    }

    public void setLateClasses(long lateClasses) {
        this.lateClasses = lateClasses;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
