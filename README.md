# The Booking

The Booking là một ứng dụng đặt phòng khách sạn full-stack với frontend bằng React và backend bằng Spring Boot. Ứng dụng cho phép người dùng xem các phòng trống, đặt phòng và quản lý các lượt đặt chỗ. Quản trị viên có thể quản lý phòng và xem tất cả các lượt đặt phòng.

## Cấu trúc dự án

-   **FE/**: Frontend (React, Vite)
-   **BE/**: Backend (Spring Boot, Java)
-   **sql/**: Chứa tệp tin SQL để khởi tạo cơ sở dữ liệu
-   **asset/**: Chứa các tài nguyên hình ảnh cho tài liệu

## Tính năng

-   Đăng ký và xác thực người dùng (JWT)
-   Xem và lọc các phòng trống
-   Đặt phòng và xem lịch sử đặt phòng
-   Trang quản trị để quản lý phòng và các lượt đặt phòng
-   Thiết kế đáp ứng (Responsive design)

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

-   Node.js (cho Frontend)
-   Java JDK 17+ (cho Backend)
-   MySQL Server

### Cài đặt Backend

1.  Di chuyển vào thư mục `BE`:
    ```sh
    cd BE
    ```
2.  Mở tệp `src/main/resources/application.properties` và cấu hình thông tin kết nối đến cơ sở dữ liệu MySQL của bạn.
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3307/thebooking
    spring.datasource.username=root
    spring.datasource.password=123456
    ```
3.  Tạo một cơ sở dữ liệu có tên `thebooking` trong MySQL và thực thi tệp `sql/thebooking.sql` để có dữ liệu ban đầu.
4.  Xây dựng và chạy ứng dụng:
    ```sh
    # Trên Windows
    ./gradlew.bat bootRun
    
    # Trên macOS/Linux
    ./gradlew bootRun
    ```

### Cài đặt Frontend

1.  Mở một cửa sổ dòng lệnh (terminal) mới và di chuyển vào thư mục `FE`:
    ```sh
    cd FE
    ```
2.  Cài đặt các gói phụ thuộc:
    ```sh
    npm install
    ```
3.  Khởi động máy chủ phát triển:
    ```sh
    npm run dev
    ```

## Sử dụng

-   **Frontend** sẽ chạy tại: `http://localhost:5173` (hoặc một cổng khác được hiển thị trên terminal)
-   **Backend** sẽ chạy tại: `http://localhost:8080` 