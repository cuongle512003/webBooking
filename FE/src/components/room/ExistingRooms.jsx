/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import RoomFilter from "../common/RoomFilter";
import { deleteRoom, getAllRooms } from "../utils/ApiFunctions";
import { Col, Row } from "react-bootstrap";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessgae] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);

    try {
      const result = await getAllRooms();
      setRooms(result);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setErrorMessgae(err.message); // Ensure errorMessage is a string
    }
  };

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(
        (room) => room.roomType === selectedRoomType
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId);

      if (result === "") {
        setSuccessMessage(`Room no ${roomId} was deleted`);
        fetchRooms();
      } else {
        console.error(`Error deleting room: ${result.message}`);
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      setErrorMessgae(err.message); // Ensure errorMessage is a string
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessgae("");
    }, 3000);
  };

  const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
    const totalRooms =
      filteredRooms.length > 0 ? filteredRooms.length : rooms.length;

    return Math.ceil(totalRooms / roomsPerPage);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <>
      {isLoading ? (
        <p>Loading existing rooms</p>
      ) : (
        <>
          <section className="mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing rooms</h2>
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
              </Col>

              <Col md={6} className="d-flex justify-content-end">
                <Link to={"/add-room"}>
                  <FaPlus /> Add Room
                </Link>
              </Col>
            </Row>

            <table className="table table-striped table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentRooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  currentRooms.map((room) => (
                    <tr key={room.id} className="text-center">
                      <td>{room.id}</td>
                      <td>{room.roomType}</td>
                      <td>{room.roomPrice}</td>
                      <td className="gap-2">
                        <Link to={`/edit-room/${room.id}`}>
                          <span className="btn btn-info btn-sm">
                            <FaEye />
                          </span>
                          <span className="btn btn-warning btn-sm">
                            <FaEdit />
                          </span>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(room.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <RoomPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(
                filteredRooms,
                roomsPerPage,
                rooms
              )}
              onPageChange={handlePaginationClick}
            />
          </section>
        </>
      )}
    </>
  );
};

export default ExistingRooms;
