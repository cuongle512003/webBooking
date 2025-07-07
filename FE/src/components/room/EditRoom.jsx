import { useState, useEffect } from "react";
import { updateRoom, getRoomById } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";

const EditRoom = () => {
  const { roomId } = useParams(); // lấy room theo id của url
  const [room, setRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Khi chọn ảnh mới
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      // Hiển thị ảnh preview bằng Blob URL
      setImagePreview(URL.createObjectURL(selectedImage));

      // Chuyển ảnh thành Base64 nếu API yêu cầu
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => {
        // console.log("Converted image to Base64:", reader.result); // Log Base64 để kiểm tra
        setRoom({ ...room, photo: reader.result });
      };
    }
  };

  // Lấy thông tin phòng
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        console.log("📸 API Response:", roomData);

        if (roomData || roomData.photo) {
          console.warn("⚠️ No valid image data found");
          return;
        }

        setRoom(roomData);
        setImagePreview(
          roomData.photo.startsWith("data:image")
            ? roomData.photo
            : `data:image/jpeg;base64,${roomData.photo}`
        );
      } catch (err) {
        console.error("❌ Error fetching room data:", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  // Xử lý nhập liệu
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setRoom({ ...room, [name]: value });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("🔄 Form submitted!");
    // console.log("📦 Room data before update:", room); // Kiểm tra dữ liệu trước khi gửi

    try {
      const response = await updateRoom(roomId, room);
      // console.log("✅ API Response:", response); // Log phản hồi API

      if (response !== 200) {
        setSuccessMessage("Room updated successfully!");
        // console.log("🎉 Update success!");

        const updatedRoomData = await getRoomById(roomId);
        setRoom(updatedRoomData);
        setImagePreview(updatedRoomData.photo || "");

        setErrorMessage("");
      }
    } catch (err) {
      // console.error("🚨 Error during update:", err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-5 mt-5">Edit Room</h3>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="roomType" className="form-label hotel-color">
                Room Type
              </label>
              <input
                type="text"
                className="form-control"
                id="roomType"
                name="roomType"
                value={room.roomType}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label hotel-color">
                Room Price
              </label>
              <input
                type="number"
                className="form-control"
                id="roomPrice"
                name="roomPrice"
                value={room.roomPrice}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label hotel-color">
                Photo
              </label>

              <input
                required
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <img
                  src={imagePreview} // Không thêm "data:image/jpeg;base64," nếu là Blob URL
                  alt="Room preview"
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                  className="mt-3"
                />
              )}
            </div>

            <div className="d-grid gap-2 d-md-flex mt-2">
              <Link
                to={"/existing-rooms"}
                className="btn btn-outline-info ml-5"
              >
                Back
              </Link>

              <button type="submit" className="btn btn-outline-warning">
                Edit Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
