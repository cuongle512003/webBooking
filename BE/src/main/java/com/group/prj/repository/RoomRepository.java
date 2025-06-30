package com.group.prj.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.group.prj.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // entity query
    // jpql
    @Query("SELECT DISTINCT r.roomType FROM Room r")
    // native query sql
    // @Query(value = "SELECT DISTINCT room_type FROM room", nativeQuery = true)
    List<String> findDistinctRoomTypes();

    @Query("""
                SELECT r FROM Room r
                WHERE r.roomType LIKE %:roomType%
                AND r.id NOT IN (
                    SELECT br.room.id FROM BookedRoom br
                    WHERE (br.checkInDate <= :checkOutDate)
                    AND (br.checkOutDate >= :checkInDate)
                )
            """)
    List<Room> findAvailableRoomsByDateAndType(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("roomType") String roomType);

}
