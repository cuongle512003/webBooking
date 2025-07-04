/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import axios from "axios";

// set to api
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    // remove Content-Type when sending FormData
    // "Content-Type": "application/json",
  };
};

// header to restapi
// export const getHeader = (isFormData = false) => {
//   const token = localStorage.getItem("token");
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   if (!isFormData) {
//     headers["Content-Type"] = "application/json";
//   }

//   return headers;
// };

/* This function adds a new room room to the database */
export const addRoom = async (photo, roomType, roomPrice) => {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  try {
    const response = await api.post("/rooms/add/new-room", formData, {
      headers: getHeader(),
    });

    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(`Error: ${error.response?.status || error.message}`);
  }
};

/* This function gets all room types from thee database */
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types");

    return response.data;
  } catch (error) {
    throw new Error("Error fetching room types");
  }
}

// fetch all rooms from the database
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms");

    return result.data;
  } catch (err) {
    throw new Error("Error fetching rooms");
  }
}

// fetch delete room by id
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });

    return result.data;
  } catch (err) {
    throw new Error(`Error deleting room ${err.message}`);
  }
}

// function update room
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);

  try {
    const response = await api.put(`/rooms/update/${roomId}`, formData, {
      headers: getHeader(true), // Không đặt Content-Type cho FormData
    });

    // console.log("✅ Update Room Response:", response);
    return response;
  } catch (error) {
    // console.error("❌ Error updating room:", error.response || error);
    console.error(error.message);
    throw error;
  }
}

// function gets room by Id
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);

    return result.data;
  } catch (err) {
    throw new Error(`Error fetching room ${err.message}`);
  }
}

// function saves a new booking to the database
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking
    );

    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data);
    } else {
      throw new Error(`Error booking room: ${err.message}`);
    }
  }
}

// function gets all booking from the database
export async function getAllBookings() {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const result = await api.get("/bookings/all-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (err) {
    throw new Error(
      `Error fetching bookings: ${err.response?.data?.message || err.message}`
    );
  }
}

// this function get booking by the confirmation code
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);

    return result.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw new Error(`${err.response.data}`);
    } else {
      throw new Error(`Error find booking: ${err.message}`);
    }
  }
}

// function cancles booking
export async function cancleBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`);

    return result.data;
  } catch (err) {
    throw new Error(`Error cancelling booking: ${err.message}`);
  }
}

// gets all availavle rooms from the database
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const result = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );

  return result;
}

/* This function register a new user */
/* This function registers a new user */
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    console.error("❌ Register error:", error);

    if (error.response && error.response.data) {
      // Trả lại thông báo lỗi chi tiết từ server nếu có
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      // Lỗi khác như Network Error, timeout,...
      throw new Error(`User registration error: ${error.message}`);
    }
  }
}



/* This function login a registered user */
export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*  This is function to get the user profile */
export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`user/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/user/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}
