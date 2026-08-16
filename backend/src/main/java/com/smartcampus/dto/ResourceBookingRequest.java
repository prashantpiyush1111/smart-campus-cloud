package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class ResourceBookingRequest {

    @NotBlank(message = "Booking purpose is required")
    private String bookingPurpose;

    public ResourceBookingRequest() {
    }

    public ResourceBookingRequest(String bookingPurpose) {
        this.bookingPurpose = bookingPurpose;
    }

    public String getBookingPurpose() {
        return bookingPurpose;
    }

    public void setBookingPurpose(String bookingPurpose) {
        this.bookingPurpose = bookingPurpose;
    }
}
