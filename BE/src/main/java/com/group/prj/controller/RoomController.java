package com.group.prj.controller;

import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.group.prj.exception.PhotoRetrievalException;
import com.group.prj.exception.ResourceNotFoundException;
import com.group.prj.model.BookedRoom;
import com.group.prj.model.Room;
import com.group.prj.response.RoomResponse;
import com.group.prj.service.BookingServiceImpl;
import com.group.prj.service.IRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final BookingServiceImpl bookingService;
    private final IRoomService roomService;

    @PostMapping("/add/new-room")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> addNewRoom(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("roomType") String roomType,
            @RequestParam("roomPrice") BigDecimal roomPrice)
            throws SerialException, SQLException {
        Room savedRoom = roomService.addNewRoom(photo, roomType, roomPrice);
        RoomResponse respone = new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice());
        return ResponseEntity.ok(respone);
    }

    @GetMapping("/room/types")
    public List<String> getRoomType() {
        List<String> roomTypes = roomService.getAllRoomTypes();
        System.out.println("Room types: " + roomTypes); // Kiểm tra dữ liệu backend
        return roomTypes;
    }

    @DeleteMapping("delete/room/{roomId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable("roomId") Long roomId) {
        roomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all-rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        List<RoomResponse> roomRespones = new ArrayList<>();

        for (Room room : rooms) {
            RoomResponse roomRespone = getRoomRespone(room);

            try {
                byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());

                if (photoBytes != null && photoBytes.length > 0) {
                    String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                    roomRespone.setPhoto(base64Photo);
                } else {
                    roomRespone.setPhoto(null); // Trường hợp không có ảnh
                }
            } catch (Exception e) {
                e.printStackTrace(); // Ghi log lỗi hoặc xử lý
                roomRespone.setPhoto(null); // Đảm bảo phòng vẫn được trả về
            }

            roomRespones.add(roomRespone);
        }

        return ResponseEntity.ok(roomRespones);
    }

    private RoomResponse getRoomRespone(Room room) {
        List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());
        // List<BookingResponse> bookingInfo = bookings
        // .stream()
        // .map(booking -> new BookingResponse(booking.getBookingId(),
        // booking.getCheckInDate(), booking.getCheckOutDate(),
        // booking.getBookingConfirmationCode()))
        // .toList();

        byte[] photoBytes = null;
        Blob photoBlob = room.getPhoto();

        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException sqlError) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }

        return new RoomResponse(room.getId(), room.getRoomType(), room.getRoomPrice(), room.isBooked(),
                photoBytes);
    }

    private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingService.getAllBookingsByRoomId(roomId);
    }

    @PutMapping("/update/{roomId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable("roomId") Long roomId,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) BigDecimal roomPrice,
            @RequestParam(required = false) MultipartFile photo) throws Exception {

        byte[] photoBytes = (photo != null && !photo.isEmpty()) ? photo.getBytes()
                : roomService.getRoomPhotoByRoomId(roomId);
        Blob photoBlob = photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
        Room theRoom = roomService.updateRoom(roomId, roomType, roomPrice, photoBytes);
        theRoom.setPhoto(photoBlob);
        RoomResponse roomRespone = getRoomRespone(theRoom);

        return ResponseEntity.ok(roomRespone);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable("roomId") Long roomId) {
        Optional<Room> theRoom = roomService.getRoomById(roomId);

        return theRoom.map(room -> {
            RoomResponse roomRespone = getRoomRespone(room);

            return ResponseEntity.ok(Optional.of(roomRespone));
        }).orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam("roomType") String roomType) {
        try {
            List<Room> availableRooms = roomService.getAvailableRooms(checkInDate, checkOutDate, roomType);
            List<RoomResponse> roomResponses = new ArrayList<>();

            for (Room room : availableRooms) {
                byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());

                if (photoBytes != null && photoBytes.length > 0) {
                    String photoBase64 = Base64.getEncoder().encodeToString(photoBytes);
                    RoomResponse roomResponse = getRoomRespone(room);
                    roomResponse.setPhoto(photoBase64);
                    roomResponses.add(roomResponse);
                }
            }

            if (roomResponses.isEmpty()) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.ok(roomResponses);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

}
