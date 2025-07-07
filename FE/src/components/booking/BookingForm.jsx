import React, { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";

const BookingForm = () => {
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const currentUser = localStorage.getItem("userId");
  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
  });

  const { roomId } = useParams();
  const navigate = useNavigate();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  // In ra kiểu dữ liệu của name và value
  //   console.log(`name: ${name}, type of name: ${typeof name}`);
  //   console.log(`value: ${value}, type of value: ${typeof value}`);

  //   // Kiểm tra nếu là trường 'numberOfAdults' hoặc 'numberOfChildren' thì chuyển giá trị thành số
  //   const updatedValue =
  //     name === "numberOfAdults" || name === "numberOfChildren"
  //       ? parseInt(value, 10) || 0
  //       : value;

  //   setBooking({ ...booking, [name]: updatedValue });
  //   setErrorMessage(""); // Xóa thông báo lỗi khi thay đổi
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // In ra kiểu dữ liệu của name và value
    // console.log(`name: ${name}, type of name: ${typeof name}`);
    // console.log(`value: ${value}, type of value: ${typeof value}`);

    // Kiểm tra nếu là trường 'numberOfAdults' hoặc 'numberOfChildren' thì chuyển giá trị thành số
    let updatedValue = value;

    if (name === "numberOfAdults" || name === "numberOfChildren") {
      // console.log(`name: ${name}, type of name: ${typeof name}`);
      // console.log(`value: ${value}, type of value: ${typeof value}`);
      const parsedValue = parseInt(value, 10);
      updatedValue = isNaN(parsedValue) ? 0 : parsedValue;
    }

    console.log(
      `updatedValue: ${updatedValue}, type of updatedValue: ${typeof updatedValue}`
    );

    setBooking({ ...booking, [name]: updatedValue });
    setErrorMessage(""); // Xóa thông báo lỗi khi thay đổi
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
    // console.log("Updated numberOfAdults:", booking.numberOfAdults);
  }, [roomId]);

  const calculatePayment = () => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, "days");
    const paymentPerDay = roomPrice ? roomPrice : 0;
    return diffInDays * paymentPerDay;
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numberOfAdults);
    const childrenCount = parseInt(booking.numberOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  // const isGuestCountValid = () => {
  //   const adultCount = parseInt(booking.numberOfAdults, 10);
  //   const childrenCount = parseInt(booking.numberOfChildren, 10);
  //   console.log(`adultCount: ${adultCount}, childrenCount: ${childrenCount}`);

  //   const totalCount = adultCount + childrenCount;
  //   return totalCount >= 1 && adultCount >= 1;
  // };

  const isCheckOutDateValid = () => {
    if (
      !moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))
    ) {
      setErrorMessage("Check-out date must be after check-in date");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (
      form.checkValidity() === false ||
      !isGuestCountValid() ||
      !isCheckOutDateValid()
    ) {
      e.stopPropagation();
      return;
    }

    setValidated(true);
    setIsSubmitted(true); // Cập nhật ngay khi form hợp lệ
  };

  const handleFormSubmit = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmationCode } });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
      navigate("/booking-success", { state: { error: errorMessage } });
    }
  };

  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-body mt-5">
              <h4 className="card-title">Reserve Room</h4>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="guestFullName" className="hotel-color">
                    Fullname
                  </Form.Label>
                  <FormControl
                    required
                    type="text"
                    id="guestFullName"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Enter your fullname"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your fullname.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="guestEmail" className="hotel-color">
                    Email
                  </Form.Label>
                  <FormControl
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend>Lodging Period</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="checkInDate" className="hotel-color">
                        Check-in date
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        placeholder="check-in-date"
                        min={moment().format("MMM Do, YYYY")}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check in date.
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label
                        htmlFor="checkOutDate"
                        className="hotel-color"
                      >
                        Check-out date
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        placeholder="check-out-date"
                        min={moment().format("MMM Do, YYYY")}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check out date.
                      </Form.Control.Feedback>
                    </div>
                    {errorMessage && (
                      <p className="error-message text-danger">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </fieldset>

                <fieldset style={{ border: "2px" }}>
                  <legend>Number of Guest</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label
                        htmlFor="numberOfAdults"
                        className="hotel-color"
                      >
                        Adults
                      </Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numberOfAdults"
                        name="numberOfAdults"
                        // inputMode="numeric"
                        value={booking.numberOfAdults}
                        min={1}
                        placeholder="0"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select at least 1 adult.
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label
                        htmlFor="numberOfChildren"
                        className="hotel-color"
                      >
                        Children
                      </Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numberOfChildren"
                        name="numberOfChildren"
                        value={booking.numberOfChildren}
                        placeholder="0"
                        min={0}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Select 0 if no children
                      </Form.Control.Feedback>
                    </div>
                  </div>
                </fieldset>

                <div className="form-group mt-2 mb-2">
                  <Button
                    type="submit"
                    className="btn btn-hotel"
                    // onSubmit={handleSubmit}
                  >
                    Continue
                  </Button>
                </div>
              </Form>
            </div>
          </div>

          <div className="col-md-4">
            {isSubmitted && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                onConfirm={handleFormSubmit}
                isFormValid={validated}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
