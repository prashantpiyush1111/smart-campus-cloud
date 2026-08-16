package com.smartcampus.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true, length = 30)
    private String rollNumber;

    @Column(name = "admission_number", unique = true, length = 30)
    private String admissionNumber;

    @Column(length = 20)
    private String semester;

    @Column(length = 20)
    private String batch;

    @Column
    private Double cgpa;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_contact", length = 20)
    private String guardianContact;

    public StudentProfile() {
    }

    public StudentProfile(User user, String rollNumber, String admissionNumber, String semester, String batch, Double cgpa, String guardianName, String guardianContact) {
        this.user = user;
        this.rollNumber = rollNumber;
        this.admissionNumber = admissionNumber;
        this.semester = semester;
        this.batch = batch;
        this.cgpa = cgpa;
        this.guardianName = guardianName;
        this.guardianContact = guardianContact;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getAdmissionNumber() {
        return admissionNumber;
    }

    public void setAdmissionNumber(String admissionNumber) {
        this.admissionNumber = admissionNumber;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianContact() {
        return guardianContact;
    }

    public void setGuardianContact(String guardianContact) {
        this.guardianContact = guardianContact;
    }
}
