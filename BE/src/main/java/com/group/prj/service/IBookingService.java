package com.group.prj.service;

import java.util.List;

import com.group.prj.model.BookedRoom;

public interface IBookingService {

    List<BookedRoom> getAllBookingsByRoomId(Long roomId);

    List<BookedRoom> getAllBookings();

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    void cancleBooking(Long bookingId);

    List<BookedRoom> getBookingsByUserEmail(String email);
}
