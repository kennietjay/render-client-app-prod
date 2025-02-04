import React, { useState } from "react";
import styles from "./LoanDeposition.module.css";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import LoanPagination from "./Pagination";
import Modal from "../../../components/Modal";
import LoanApproval from "./LoanApproval";
import Approval from "./Approval";

const LoanDeposition = ({ loanData }) => {
  console.log(loanData);
  //
  return (
    <div className={styles.deposition}>
      <h3 className={styles.header}>Loan Deposition</h3>
      {loanData ? <LoanList loans={loanData} /> : <p>No data available.</p>}
    </div>
  );
};

export default LoanDeposition;

const LoanList = ({ loans }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(loans?.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loans?.slice(indexOfFirstLoan, indexOfLastLoan);

  const opneModal = (loan) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className={styles.container}>
        {currentLoans?.map((loan) => (
          <LoanCard
            key={loan.loan_id}
            loan={loan}
            opneModal={opneModal}
            closeModal={closeModal}
            isModalOpen={isModalOpen}
          />
        ))}
      </div>

      <div className={styles.paginationContainer}>
        <LoanPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

//
const LoanCard = ({ loan, closeModal, opneModal, isModalOpen }) => {
  const { loan_id, status, full_name, loan_amount } = loan;

  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleOpenModal = (loan) => {
    setSelectedLoan(loan);
    opneModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  console.log(selectedLoan);
  //
  return (
    <>
      <div className={styles.card} onClick={() => handleOpenModal(loan)}>
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
          Amount: NLe{loan_amount?.toLocaleString()}
        </p>
      </div>
      {isModalOpen && (
        <Modal isOpen={handleOpenModal} onClose={handleCloseModal}>
          <Approval approvalData={selectedLoan} />
        </Modal>
      )}
    </>
  );
};
