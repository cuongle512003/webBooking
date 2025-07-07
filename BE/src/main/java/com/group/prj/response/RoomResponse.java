package com.group.prj.response;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomResponse {

    // Field
    private Long id;

    private String roomType;

    private BigDecimal roomPrice;

    private boolean isBooked;

    private String photo;

    private List<BookingResponse> bookings;

    // Not full constructor
    public RoomResponse(Long id, String roomType, BigDecimal roomPrice) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
    }

    // Full argument Constructor
    public RoomResponse(Long id, String roomType, BigDecimal roomPrice, boolean isBooked, byte[] photoBytes) {
        this.id = id;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
        this.isBooked = isBooked;
        // hash name picture
        this.photo = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes)
                : null; // going to the database convert it to encode
        // this.bookings = bookings;
    }

}
