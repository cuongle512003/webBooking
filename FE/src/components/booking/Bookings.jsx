import { useEffect, useState } from "react";
import { cancleBooking, getAllBookings } from "../utils/ApiFunctions";
import Header from "../common/Header";
import BookingTable from "./BookingTable";

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getAllBookings()
        .then((data) => {
          setBookingInfo(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }, 1000);
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancleBooking(bookingId);
      const data = await getAllBookings();

      setBookingInfo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section style={{ backgroundImage: "whitesmoke" }}>
      <Header title={"Existing Bookings"} />

      {error && <div className="text-danger">{error}</div>}

      {isLoading ? (
        <div>Loading existing bookings</div>
      ) : (
        <BookingTable
          bookingInfo={bookingInfo}
          handleBookingCancellation={handleBookingCancellation}
        />
      )}
    </section>
  );
};

export default Bookings;
