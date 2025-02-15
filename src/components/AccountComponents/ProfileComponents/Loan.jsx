import React, { useEffect, useState } from "react";
import styles from "../ProfileStyles/Loan.module.css";
import { useCustomer } from "../../../context/CustomerContext";

import { formatNumber } from "../../../../utils/formatNumbers";
import { formatDateRegular } from "../../../../utils/formatDateRegular";
import { categorizeLoans } from "../../../../utils/sortLoans";
import { useLoan } from "../../../context/LoanContext";
import LoanDetails from "./LoanDetails";

function Loan() {
  const { customerLoans, updateLoan, getCustomerByUserId } = useLoan();
  const { customer } = useCustomer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedLoan, setFetchLoan] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    user_fid: "",
    customer_id: "",
    loan_type: "",
    loan_amount: "",
    loan_purpose: "",
    loan_period: "",
    approved_amount: "",
    approved_by: "",
    first_review_by: "",
    second_review_by: "",
    total_amount: "",
    payment: "",
    processing_fees: "",
    disbursed_amount: "",
    amount_in_words: "test",
    monthly_salary: "",
    salary_in_words: "test",
    interest_rate: "",
    co_debtor: "Mariama Jalloh",
    co_debtor_relation: "Sister",
    prior_loan_history: "no",
    loaned_with_easylife: "no",
    owe_arrears_elsewhere: "no",
    status: "applied",
  });

  useEffect(() => {
    if (customerLoans && customer) {
      setFetchLoan(customerLoans);
    }
  }, [customerLoans, customer]);

  const sortedLoans = categorizeLoans(fetchedLoan);

  const openModal = (loan) => {
    setSelectedLoan(loan); // Pass the selected loan data to the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null); // Reset the selected loan when closing
  };

  return (
    <>
      <ActiveLoans sortedLoans={sortedLoans} onViewLoan={openModal} />
      <NewLoans sortedLoans={sortedLoans} onViewLoan={openModal} />
      <OldLoans sortedLoans={sortedLoans} onViewLoan={openModal} />

      {isModalOpen && selectedLoan && (
        <LoanDetails
          formData={formData}
          setFormData={setFormData}
          updateLoan={updateLoan}
          loan={selectedLoan} // Pass the selected loan directly
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          customer={customer}
          getCustomerByUserId={getCustomerByUserId}
        />
      )}
    </>
  );
}

export default Loan;

function ActiveLoans({ sortedLoans, onViewLoan }) {
  return (
    <div className={styles.panel}>
      <div className={styles.bioGraphInfo}>
        <h3>Loan Information</h3>
        <div>
          <div className={styles.loanOverview}>
            <div className={styles.overviewHeader}>
              <h4>Active Loans</h4>
            </div>

            {sortedLoans.active.length > 0 ? (
              <ul className={styles.loanList}>
                {sortedLoans.active.map((loan) => (
                  <li key={loan.id} className={styles.loanListItem}>
                    <div className={styles.updateDate}>
                      {" "}
                      <span>Loan approved on: </span>
                      {formatDateRegular(loan.approval_date)}
                    </div>
                    <div className={styles.activeLoan}>
                      <div className={styles.details}>
                        <i className="fa-solid fa-check"></i>
                        <div>
                          <h4>{loan.loan_type}</h4>
                          <div className={styles.loanAmount}>
                            NLe {formatNumber(loan.balance)}
                          </div>
                          <div className={styles.status}>{loan.status}</div>
                        </div>
                      </div>
                      <button
                        className={styles.view}
                        onClick={() => onViewLoan(loan)}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active loans available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewLoans({ sortedLoans, onViewLoan }) {
  return (
    <div className={styles.loanOverview}>
      <h4>New Applications</h4>
      <table className={styles.customerLoanTable}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Loan</th>
            <th>Type</th>
            <th>Status</th>
            <th>Payment</th>
            {/* <th className={styles.view}>Action</th> */}
          </tr>
        </thead>

        <tbody>
          {sortedLoans?.new?.length > 0 ? (
            sortedLoans?.new?.map((loan, index) => (
              <tr key={loan.id}>
                <td>{loan.loan_id}</td>
                <td>{loan.total_amount}</td>
                <td>{loan.loan_type}</td>
                <td>{loan.status}</td>
                <td>{loan.payment ? `${loan.payment}` : "$0"}</td>
                {/* <td
                  onClick={() => onViewLoan(loan)}
                  className={`${styles.view} ${styles.viewActions}`}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No available new loan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OldLoans({ sortedLoans, onViewLoan }) {
  return (
    <div className={styles.loanOverview}>
      <h4>Closed Loan</h4>
      <table className={styles.customerLoanTable}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Loan</th>
            <th>Type</th>
            <th>Status</th>
            <th>Payment</th>
            <th className={styles.view}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedLoans?.close?.length > 0 ? (
            sortedLoans?.close?.map((loan, index) => (
              <tr key={loan.id}>
                <td>{loan.loan_id}</td>
                <td>{loan.total_amount}</td>
                <td>{loan.loan_type}</td>
                <td>{loan.status}</td>
                <td>{loan.payment}</td>
                <td
                  onClick={() => onViewLoan(loan)}
                  className={`${styles.view} ${styles.viewActions}`}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No active record for this category</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
