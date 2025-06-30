import { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Container, Carousel, Row, Col, Card } from "react-bootstrap";

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading rooms....</div>;
  }

  if (errorMessage) {
    return <div className="text-danger mb-5 mt-5">Error: {errorMessage}</div>;
  }

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Container>
        <h2 className="text-center hotel-color mb-4">Featured Rooms</h2>
        <Carousel indicators={false}>
          {Array.from({ length: Math.ceil(rooms.length / 4) }).map(
            (_, index) => (
              <Carousel.Item key={index}>
                <Row>
                  {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                      <Card>
                        <Link to={`/book-room/${room.id}`}>
                          <Card.Img
                            variant="top"
                            src={
                              room.photo
                                ? `data:image/png;base64,${room.photo}`
                                : "/default-image.jpg"
                            }
                            alt="Room photo"
                            className="w-100"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        </Link>
                        <Card.Body>
                          <Card.Title className="hotel-color">
                            {room.roomType}
                          </Card.Title>
                          <Card.Title className="hotel-price">
                            ${room.roomPrice} / night
                          </Card.Title>
                          <div className="flex-shrink-0">
                            <Link
                              className="btn btn-sm btn-hotel"
                              to={`/book-room/${room.id}`}
                            >
                              View / Book Now
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            )
          )}
        </Carousel>
      </Container>

      <Link to={"/browse-all-rooms"} className="hotel-color text-center ">
        Browse all rooms
      </Link>
    </section>
  );
};

export default RoomCarousel;
