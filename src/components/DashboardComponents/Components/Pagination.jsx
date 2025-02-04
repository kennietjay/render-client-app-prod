import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <div>
        <span className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div>
        <span
          className={styles.paginationButton}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </span>
        <span
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </span>
      </div>
    </div>
  );
};

export default Pagination;
