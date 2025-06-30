/* eslint-disable react/prop-types */
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  const isValidBase64 = room.photo && room.photo.trim() !== "";
  const imageSrc = isValidBase64
    ? `data:image/png;base64,${room.photo}`
    : "https://via.placeholder.com/200x150?text=No+Image";

  return (
    <Col key={room.id} className="mb-4" xs={12}>
      <Card style={{ padding: "8px" }}>
        <Link
          to={`/book-room/${room.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card.Body
            className="d-flex flex-wrap align-items-center"
            style={{ padding: "8px" }}
          >
            <div className="flex-shrink-0 mr-3 mb-3 mb-md-0">
              <Card.Img
                variant="top"
                src={imageSrc}
                alt="Room Photo"
                style={{
                  width: "100%",
                  maxWidth: "16rem",
                  height: "auto",
                  padding: "4px",
                  borderRadius: "12px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200x150?text=No+Image";
                }}
              />
            </div>

            <div className="flex-grow-1 ml-3 px-5">
              <Card.Title className="hotel-color">{room.roomType}</Card.Title>
              <Card.Title className="room-price" style={{ fontSize: "1em" }}>
                {room.roomPrice} / night
              </Card.Title>
              <Card.Text>
                Some room information goes here for the guest to read through
              </Card.Text>
            </div>

            {/* Nút "Book Now" */}
            <div className="d-flex justify-content-end align-items-center text-center mb-2">
              <Link
                to={`/book-room/${room.id}`}
                className="btn btn-hotel btn-sm"
                style={{ backgroundColor: "rgb(169, 77, 123)", color: "#fff" }}
              >
                Book Now
              </Link>
            </div>
          </Card.Body>
        </Link>
      </Card>
    </Col>
  );
};

export default RoomCard;
