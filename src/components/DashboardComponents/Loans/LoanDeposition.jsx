import React, { useEffect, useState } from "react";
import styles from "./LoanDeposition.module.css";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import LoanPagination from "./Pagination";
import Modal from "../../../components/Modal";
import Approval from "./Approval";

//
function filterLoansByStatus(loans, ...statuses) {
  return loans.filter((loan) => statuses.includes(loan.status));
}

const LoanDeposition = ({ loanData }) => {
  //
  return (
    <div className={styles.deposition}>
      <h3 className={styles.header}>Mange Loan Deposition</h3>
      {loanData ? <LoanList loans={loanData} /> : <p>No data available.</p>}
    </div>
  );
};

export default LoanDeposition;

const LoanList = ({ loans }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null); // State for selected loan

  const filteredLoans = filterLoansByStatus(
    loans,
    "approved",
    "paying",
    "processed"
    // "rejected",
    // "closed",
    // "canceled",
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(filteredLoans?.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans?.slice(indexOfFirstLoan, indexOfLastLoan);

  const opneModal = (loan) => {
    setIsModalOpen(true);
    setSelectedLoan(loan);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div>
      <div className={styles.container}>
        {currentLoans?.map((loan) => (
          <LoanCard key={loan.loan_id} loan={loan} opneModal={opneModal} />
        ))}
      </div>

      <div className={styles.paginationContainer}>
        <LoanPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isModalOpen && selectedLoan && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Approval approvalData={selectedLoan} closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

//
const LoanCard = ({ loan, opneModal }) => {
  const { loan_id, status, full_name, total_amount } = loan;
  // console.log(loan);
  //
  return (
    <>
      <div className={styles.card} onClick={() => opneModal(loan)}>
        <h3 className={styles.title}>ID: {loan_id}</h3>
        <p className={styles.customer}>Customer: {full_name}</p>
        <div className={styles.statusWrapper}>
          <div
            className={`${styles.statusDot} ${
              status === "paid"
                ? styles.statusPaid
                : status === "approved"
                ? styles.statusApproved
                : status === "applied"
                ? styles.statusApplied
                : status === "closed"
                ? styles.statusClosed
                : status === "rejected"
                ? styles.statusCanceled
                : status === "canceled"
                ? styles.statusRejected
                : status === "paying"
                ? styles.statusPaying
                : status === "processing"
                ? styles.statusProcessing
                : status === ""
                ? styles.statusReviewing
                : styles.statusProcessed
            }`}
          ></div>
          {capitalizeWords(status)}
        </div>
        <p className={styles.amount}>
          Amount: NLe{total_amount?.toLocaleString()}
        </p>
      </div>
    </>
  );
};
