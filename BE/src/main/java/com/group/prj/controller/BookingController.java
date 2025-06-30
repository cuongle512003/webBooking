package com.group.prj.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group.prj.exception.InvalidBookingRequestException;
import com.group.prj.exception.ResourceNotFoundException;
import com.group.prj.model.BookedRoom;
import com.group.prj.model.Room;
import com.group.prj.response.BookingResponse;
import com.group.prj.response.RoomResponse;
import com.group.prj.service.IBookingService;
import com.group.prj.service.IRoomService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/bookings")
@RestController
@Validated
public class BookingController {

    private final IBookingService bookingService;
    private final IRoomService roomService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBooking() {
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();

        for (BookedRoom bookedRoom : bookings) {
            BookingResponse bookingResponse = getBookingResponse(bookedRoom);
            bookingResponses.add(bookingResponse);
        }

        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable("email") String email) {
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable("confirmationCode") String confirmationCode) {
        try {
            BookedRoom booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);

            return ResponseEntity.ok(bookingResponse);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi nếu có vấn đề khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable("roomId") Long roomId, @RequestBody BookedRoom bookingRequest) {
        try {
            String confirmationCode = bookingService.saveBooking(roomId, bookingRequest);
            System.out.println("Received booking request: " + bookingRequest.getTotalNumberOfGuest()); // Debug

            return ResponseEntity.ok("Room booked successfully, Your booking confirmation code: " + confirmationCode);
        } catch (InvalidBookingRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private BookingResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = roomService.getRoomById(booking.getRoom().getId()).get();
        RoomResponse roomRespone = new RoomResponse(theRoom.getId(), theRoom.getRoomType(), theRoom.getRoomPrice());

        return new BookingResponse(
                booking.getBookingId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getGuestFullName(),
                booking.getGuestEmail(),
                booking.getNumberOfAdults(),
                booking.getNumberOfChildren(),
                booking.getTotalNumberOfGuest(),
                booking.getBookingConfirmationCode(),
                roomRespone);
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancleBooking(@PathVariable("bookingId") Long bookingId) {
        bookingService.cancleBooking(bookingId);
    }

}
