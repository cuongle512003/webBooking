/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  cancleBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunctions";
import moment from "moment";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    room: { id: "", roomType: "" },
    bookingConfirmationCode: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numberOfAdults: "",
    numberOfChildren: "",
    totalNumberOfGuest: "",
  });

  const clearBookingInfo = {
    id: "",
    room: { id: "", roomType: "" },
    bookingConfirmationCode: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numberOfAdults: "",
    numberOfChildren: "",
    totalNumberOfGuest: "",
  };

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset lỗi trước khi tìm kiếm

    try {
      const data = await getBookingByConfirmationCode(confirmationCode);

      setBookingInfo(data);
    } catch (err) {
      setBookingInfo(clearBookingInfo);

      if (err.response && err.response.status === 404) {
        setError(err.response.data.message);
      } else {
        setError(err.response);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancleBooking(bookingInfo.id);
      setIsDeleted(true);
      setSuccessMessage("Booking has been cancelled successfully!");
      setBookingInfo(clearBookingInfo);
      setConfirmationCode("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setIsDeleted(false);
    }, 2000);
  };

  return (
    <>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-4">Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter the booking confirmation code"
            />

            <button type="submit" className="btn btn-hotel input-group-text">
              Find booking
            </button>
          </div>
        </form>

        {isLoading ? (
          <div>Finding your booking...</div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : bookingInfo.bookingConfirmationCode ? (
          <div className="col-md-6 mt-4 mb-5">
            <h3>Booking Information</h3>
            <p className="text-success">
              Confirmation Code: {bookingInfo.bookingConfirmationCode}
            </p>
            <p>Room Number: {bookingInfo.room.id}</p>
            <p>Room Type: {bookingInfo.room.roomType}</p>
            <p>
              Check-in Date:{" "}
              {moment(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p>
              Check-out Date:{" "}
              {moment(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p>Full Name: {bookingInfo.guestFullName}</p>
            <p>Email Address: {bookingInfo.guestEmail}</p>
            <p>Adults: {bookingInfo.numberOfAdults}</p>
            <p>Children: {bookingInfo.numberOfChildren}</p>
            <p>Total Guest: {bookingInfo.totalNumberOfGuest}</p>

            {!isDeleted && (
              <button
                onClick={() => handleBookingCancellation(bookingInfo.id)}
                className="btn btn-danger"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ) : (
          <div>Find booking...</div>
        )}

        {isDeleted && (
          <div className="alert alert-success mt-3 fade show">
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default FindBooking;
