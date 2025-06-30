/* eslint-disable react/prop-types */
const RoomPaginator = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo danh sách số trang
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item z-0 ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RoomPaginator;
