import React, { useState } from "react";
import Pagination from "./Pagination";
import styles from "../DashboardComponents/Loans/Loans.module.css";
import { capitalizeWords } from "../../../utils/capitalizeWords";
import Avatar from "react-avatar";
import { formatDateRegular } from "../../../utils/formatDateRegular";

const PaginatedNewLoans = ({
  newLoans = [], // Set a default empty array for newLoans
  itemsPerPage,
  closeSidebar,
  openSidebar,
  selectedLoanId,
  isSidebarOpen,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(newLoans.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const filteredLoans = newLoans.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className={styles.loanContent}>
        <ul
          className={`${styles.loanList} ${
            isSidebarOpen ? styles.reducedWidth : ""
          }`}
        >
          {filteredLoans.map((loan) => (
            <li
              key={loan.loan_id}
              // className={styles.loan}
              onClick={() => openSidebar(loan)}
              className={`${styles.loan} ${
                selectedLoanId === loan.loan_id ? styles.selectedLoan : ""
              }`}
            >
              <div className={styles.loanDetailsHeader}>
                <div>
                  Loan ID: <strong>{loan.customer_id}</strong>
                </div>
                <div className={styles.loanBanner}>
                  {loan.status && loan.status === "approved" ? (
                    <span className={styles.approved}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "paying" ? (
                    <span className={styles.paying}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "paid" ? (
                    <span className={styles.paid}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "rejected" ? (
                    <span className={styles.rejected}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "closed" ? (
                    <span className={styles.closed}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "applied" ? (
                    <span className={styles.applied}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : loan.status === "reviewing" ? (
                    <span className={styles.reviewing}>
                      {capitalizeWords(loan.status)}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={styles.loaneeName}>
                <div>
                  <Avatar
                    name={`${loan.first_name} ${
                      loan.middle_name ? loan.middle_name : ""
                    } ${loan.last_name}`}
                    fgColor={"#1d41c4"}
                    color={"#e6eaf8"}
                    size={50}
                    round="5rem"
                  />
                </div>
                <div className={styles.customerName}>
                  {`${loan.first_name} ${loan.last_name}`}
                </div>
              </div>
              <div>Phone: {loan.contact_number}</div>
              <div className={styles.loanButton}>
                <div className={styles.loanType}>
                  <div>Type: {capitalizeWords(loan.loan_type)}</div>
                  <div>Approved: {formatDateRegular(loan.approval_date)}</div>
                </div>
                <div className={styles.loanOfficerContainer}>
                  <>
                    <strong>Loan Officer</strong>
                  </>
                  <div className={styles.loanOfficer}>
                    <i className="fa-solid fa-user"></i>
                    <div>
                      <div>Mohamed</div>
                      <div>Swarray</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* Sidebar for displaying loan details */}
        {isSidebarOpen && (
          <div className={styles.sidebar}>
            <button onClick={closeSidebar} className={styles.closeButton}>
              &times;
            </button>
            <div>
              <h3>Loan Details</h3>
              <p>Loan ID: {isSidebarOpen.loan_id}</p>
              <p>
                Customer: {isSidebarOpen.first_name} {isSidebarOpen.last_name}
              </p>
              <p>Amount: NLe {isSidebarOpen.loan_amount}</p>
              <p>Status: {capitalizeWords(isSidebarOpen.status)}</p>
              <p>Type: {capitalizeWords(isSidebarOpen.loan_type)}</p>
              <p>
                Approval Date: {formatDateRegular(isSidebarOpen.approval_date)}
              </p>
              <p>Due Date: {formatDateRegular(isSidebarOpen.due_date)}</p>
              {/* Add more loan details here */}
            </div>
            <div>
              <button>Approve Loan</button>
              <button>Review Loan</button>
              <button>Edit Loan</button>
            </div>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginatedNewLoans;
