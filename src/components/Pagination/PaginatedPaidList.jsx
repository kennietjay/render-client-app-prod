import React, { useState } from "react";
import Pagination from "./Pagination";
import styles from "../DashboardComponents/Loans/Loans.module.css";
import SmallModal from "../SmallModal";
import { capitalizeWords } from "../../../utils/capitalizeWords";

const PaginatedPaidList = ({ itemsPerPage = 5, loanData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentDetailsOpen, setPaymentDatailsOpen] = useState(false);

  // Calculate total pages
  const totalPages =
    loanData.length > 0 && itemsPerPage > 0
      ? Math.ceil(loanData.length / itemsPerPage)
      : 1;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const loanPayment = loanData.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openSmallModal = () => setPaymentDatailsOpen(true);
  const closeSmallModal = () => setPaymentDatailsOpen(false);

  return (
    <div>
      <ul className={styles.recentTransactionList}>
        <li className={styles.listItemHeader}>
          <div>
            <strong>#</strong>
          </div>
          <div>
            <strong>Staff Name</strong>
          </div>
          <div>
            <strong>Status</strong>
          </div>
          <div>
            <strong>Amount</strong>
          </div>
          <div>
            <strong>Payment Date</strong>
          </div>
          <div className={styles.ationIcon}>
            <strong>Action</strong>
          </div>
        </li>
        {loanPayment.map((payment, index) => (
          <li key={index} className={styles.listItemHeader}>
            <div>{index + 1}</div>
            <div>{`${payment.first_name} ${payment.middle_name || ""} ${
              payment.last_name
            }`}</div>
            <div>{capitalizeWords(payment.status)}</div>
            <div>NLe {payment.amount}</div>
            <div>{payment.payment_date}</div>
            <div className={styles.actionIcon} onClick={openSmallModal}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <ViewPaymentDetails
        paymentDetailsOpen={paymentDetailsOpen}
        setPaymentDatailsOpen={setPaymentDatailsOpen}
        closeSmallModal={closeSmallModal}
      />
    </div>
  );
};

export default PaginatedPaidList;

const ViewPaymentDetails = ({
  paymentDetailsOpen,
  setPaymentDatailsOpen,
  closeSmallModal,
}) => {
  return (
    <div>
      <SmallModal isOpen={paymentDetailsOpen} onClose={closeSmallModal}>
        <h3>Payment Detials</h3>
        <div>
          <div className={styles.paymentView}>
            <div>Loan Id</div>
            <div>Customer Id</div>
            <div>Name</div>
            <div>Payment:</div>
            <div>Payment Date</div>
            <div>Status</div>
            <div>Balance</div>
            <div>Phone</div>
            <div>Email</div>
            <div>Cashier</div>
            <div>Application Date</div>
            <div>Approval Date</div>
            <div>Loan Officer</div>
          </div>
          <div className={styles.paymentViewBtn}>
            <button>Cancel</button>
            <button>Refund</button>
          </div>
        </div>
      </SmallModal>
    </div>
  );
};
