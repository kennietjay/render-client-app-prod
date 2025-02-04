import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "1rem" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            margin: "0 5px",
            padding: "0.5rem",
            backgroundColor: number === currentPage ? "#ddd" : "#fff",
          }}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
