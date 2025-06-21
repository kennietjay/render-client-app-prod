import React, { useEffect, useState } from "react";
import styles from "./LoanTable.module.css";
import LoanPagination from "./Pagination";

import formatDateAndTime from "/utils/formatDateAndTime.js";
import SideBar from "../../SideBar";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import { useTransaction } from "../../../context/TransactionContext";
import { stubFalse } from "lodash";
import LoadingSpinner from "../../LoadingSpinner";

//
const LoanTable = ({
  searchResults,
  handleCustomerSubMenuClick,
  handleApproval,
}) => {
  const [loading, setLoading] = useState(stubFalse);
  const { getPayments, payments: contextPayments } = useTransaction();

  const [localPayments, setLocalPayments] = useState(contextPayments);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(searchResults?.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = searchResults?.slice(indexOfFirstLoan, indexOfLastLoan);

  useEffect(() => {
    if (contextPayments.length > 0) {
      setLocalPayments([...contextPayments]); // Ensure UI updates
    }
  }, [contextPayments]);

  useEffect(() => {
    const refreshData = async () => {
      await getPayments();
    };
    refreshData();
  }, [getPayments]);

  // Function to open the sidebar with loan details
  const openSidebar = (loan) => {
    setSelectedLoan(loan);
    setIsSidebarOpen(true);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedLoan(null);
    setIsSidebarOpen(false);
  };

  const refreshPayments = async () => {
    setLoading(true);
    try {
      const updatedPayments = await getPayments(); // Fetch updated data
      setLocalPayments(updatedPayments);
    } catch (error) {
      console.error("Error fetching updated payments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a mapping of loan_id to the latest payment
  const paymentMap = localPayments?.reduce((map, payment) => {
    if (payment?.loan_id) {
      map[payment.loan_id] = {
        amount: parseFloat(payment.amount) || 0, // Ensure default values
        balance_after: parseFloat(payment.balance_after) || 0,
      };
    }
    return map;
  }, {});

  //

  // Totol amount paid
  const totalPaidMap = calculateTotalPaid(searchResults, localPayments);
  // console.log("Total Amount Paid Per Loan:", totalPaidMap);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.tableRoot}>
            {/* Table Header */}

            <thead className={styles.tableHead}>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeadCell}>ID</th>
                <th className={styles.tableHeadCell}>Submitted</th>
                <th className={styles.tableHeadCell}>Customer</th>
                <th className={styles.tableHeadCell}>Status</th>
                <th className={styles.tableHeadCell}>Requested</th>
                <th className={styles.tableHeadCell}>Approved</th>
                <th className={styles.tableHeadCell}>Date</th>
                <th className={styles.tableHeadCell}>Loan</th>
                <th className={styles.tableHeadCell}>Total Paid</th>
                <th className={styles.tableHeadCell}>Last Payment</th>
                <th className={styles.tableHeadCell}>Balance</th>
                <th className={styles.tableHeadCell}>View</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className={styles.tableBody}>
              {currentLoans?.map((loan) => {
                // const { formattedDate, formattedTime } = formatDateAndTime(
                //   loan.submission_date
                // );

                const {
                  formattedDate: approvalDate,
                  formattedTime: approvalTime,
                } = formatDateAndTime(loan?.approval_date);

                const {
                  formattedDate: submissionDate,
                  formattedTime: submissionTime,
                } = formatDateAndTime(loan?.createdAt);

                //
                // Retrieve the latest payment details from the mapping
                const paymentDetails = paymentMap[loan?.loan_id] || {
                  amount: 0,
                  balance_after:
                    loan.status === "approved" ? loan?.total_amount : 0,
                };
                const { amount, balance_after } = paymentDetails;

                //
                return (
                  <tr key={loan.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <Link
                        onClick={() => openSidebar(loan)}
                        className={styles.link}
                      >
                        {loan?.loan_id}
                      </Link>
                    </td>
                    <td className={styles.tableCell}>
                      {(
                        <div className={styles.approvalDate}>
                          <div className={styles.date}>{submissionDate}</div>
                          <div className={styles.time}>{submissionTime}</div>
                        </div>
                      ) || "N/A"}
                    </td>
                    <td className={styles.tableCell}>{`${loan.full_name}`}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.statusWrapper}>
                        <div
                          className={`${styles.statusDot} ${
                            loan?.status === "paid"
                              ? styles.statusPaid
                              : loan?.status === "approved"
                              ? styles.statusApproved
                              : loan?.status === "applied"
                              ? styles.statusApplied
                              : loan?.status === "closed"
                              ? styles.statusClosed
                              : loan.status === "rejected"
                              ? styles.statusCanceled
                              : loan?.status === "canceled"
                              ? styles.statusRejected
                              : loan?.status === "paying"
                              ? styles.statusPaying
                              : loan?.status === "processing"
                              ? styles.statusProcessing
                              : loan.status === ""
                              ? styles.statusReviewing
                              : styles.statusProcessed
                          }`}
                        ></div>
                        {capitalizeWords(loan?.status)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {loan?.loan_amount
                        ? `NLe ${loan?.loan_amount.toLocaleString()}`
                        : "N/A"}
                    </td>

                    <td className={styles.tableCell}>
                      {loan?.approved_amount
                        ? `NLe ${loan?.approved_amount.toLocaleString()}`
                        : "N/A"}
                    </td>

                    <td className={styles.tableCell}>
                      {loan?.approval_date ? (
                        <div className={styles.approvalDate}>
                          <div className={styles.date}>{approvalDate}</div>
                          <div className={styles.time}>{approvalTime}</div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className={styles.tableCell}>
                      {loan?.total_amount
                        ? `NLe ${loan?.total_amount.toLocaleString()}`
                        : "N/A"}
                    </td>

                    <td className={styles.tableCell}>
                      {totalPaidMap[loan.loan_id]
                        ? `NLe ${parseFloat(
                            totalPaidMap[loan.loan_id]
                          ).toLocaleString()}`
                        : "NLe 0"}
                    </td>

                    <td className={styles.tableCell}>
                      {amount ? `NLe ${amount?.toLocaleString()}` : `NLe 0`}
                    </td>

                    {/* Display the latest payment balance_after */}
                    <td className={styles.tableCell}>
                      {loan?.balance
                        ? `NLe ${loan?.balance?.toLocaleString()}`
                        : "NLe 0"}
                    </td>

                    <td className={styles.tableCell}>
                      <button
                        className={styles.iconButton}
                        onClick={() => openSidebar(loan)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="24"
                          height="24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className={styles.tableRow}>
                <td colSpan="12" className={`${styles.paginationCell}`}>
                  <LoanPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {isSidebarOpen && (
        <ManageLoan
          loan={selectedLoan} // Pass the selected loan
          closeModal={closeSidebar}
          isModalOpen={isSidebarOpen}
          handleCustomerSubMenuClick={handleCustomerSubMenuClick}
          handleApproval={handleApproval}
          refreshPayments={refreshPayments} // Pass refresh function to update payments
        />
      )}
    </>
  );
};

export default LoanTable;

//
function ManageLoan({
  loan,
  isModalOpen,
  closeModal,
  handleApproval,
  refreshPayments,
}) {
  const { formattedDate: approvalDate } = formatDateAndTime(
    loan?.approval_date
  );
  const { formattedDate: firstReviewDate } = formatDateAndTime(
    loan?.first_review_date
  );
  const { formattedDate: secondReviewDate } = formatDateAndTime(
    loan?.second_review_date
  );
  const { formattedDate: submissionDate } = formatDateAndTime(
    loan?.submission_date
  );

  return (
    <div className={styles.manageLoan}>
      <SideBar isOpen={isModalOpen} closeModal={closeModal}>
        <h3 className={styles.sideBarHeader}>Loan Details</h3>
        {loan ? (
          <div className={styles.sideBarContainer}>
            <div className={styles.viewLoanContent}>
              <div className={styles.viewLoanDetails}>
                <div>
                  <p>
                    <strong>Customer Name:</strong> {loan?.full_name}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {loan?.customer_id}
                  </p>
                  <p>
                    <strong>Phone:</strong> {loan?.customer?.user?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {loan?.customer.user?.email}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Loan ID:</strong> {loan?.loan_id}
                  </p>
                  <p>
                    <strong>Status:</strong> {loan?.status}
                  </p>
                  <p>
                    <strong>Loan Type:</strong> {loan?.loan_type}
                  </p>
                  <p>
                    <strong>Loan Purpose:</strong> {loan?.loan_purpose}
                  </p>
                  <p>
                    <strong>Submission Date:</strong> {submissionDate || "N/A"}
                  </p>

                  {loan?.co_debtor === "yes" ? (
                    <>
                      <p>
                        <strong>Co-Debtor:</strong> {loan?.co_debtor}
                      </p>
                      <p>
                        <strong>Co-Debtor Name:</strong> {loan?.co_debtor_name}
                      </p>
                      <p>
                        <strong>Co-Debtor Relation:</strong>{" "}
                        {loan?.co_debtor_relation}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Co-Debtor:</strong> No Co-debtor
                    </p>
                  )}
                  <p>
                    <strong>Prior Loan History:</strong>{" "}
                    {loan?.prior_loan_history}
                  </p>
                  <p>
                    <strong>Owe Arrears Elsewhere:</strong>{" "}
                    {loan?.owe_arrears_elsewhere}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Loan Amount:</strong> NLe
                    {loan?.loan_amount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {loan?.interest_rate}%
                  </p>
                  <p>
                    <strong>Loan Period:</strong> {loan?.loan_period} months
                  </p>
                  <p>
                    <strong>Total Amount:</strong> NLe
                    {loan?.total_amount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment Balance:</strong> NLe
                    {loan?.balance?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Approved Amount:</strong> NLe
                    {loan?.approved_amount || "N/A"}
                  </p>
                  <p>
                    <strong>Processing Fee:</strong> {loan?.processing_fee}{" "}
                  </p>
                  <p>
                    <strong>Disbursed Amount:</strong>{" "}
                    {loan?.disbursed_amount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Approved By:</strong> {loan?.approved_by || "N/A"}
                  </p>
                  <p>
                    <strong>Approval Date:</strong> {approvalDate || "N/A"}
                  </p>
                  <p>
                    <strong>Monthly Salary:</strong> NLe
                    {loan?.monthly_salary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>First Review:</strong> {loan?.first_review}
                  </p>
                  <p>
                    <strong>First Reviewer:</strong>{" "}
                    {loan?.first_reviewer || "N/A"}
                  </p>
                  <p>
                    <strong>First Review Date:</strong>{" "}
                    {firstReviewDate || "N/A"}
                  </p>
                  <p>
                    <strong>Second Review:</strong> {loan?.second_review}
                  </p>
                  <p>
                    <strong>Second Reviewer:</strong>{" "}
                    {loan?.second_reviewer || "N/A"}
                  </p>
                  <p>
                    <strong>Second Review Date:</strong>{" "}
                    {secondReviewDate || "N/A"}
                  </p>
                  <p>
                    <strong>Consent:</strong> {loan?.consent}
                  </p>
                </div>
              </div>

              <div>{/* <LoanApproval loan={loan} /> */}</div>
            </div>
          </div>
        ) : (
          <p>No loan selected.</p>
        )}
      </SideBar>
    </div>
  );
}

//
function calculateOutstandingBalances(loans, payments = []) {
  if (!Array.isArray(loans) || loans.length === 0) return {};

  return loans.reduce((acc, loan) => {
    // Filter payments for this specific loan ID
    const loanPayments = payments.filter(
      (payment) => String(payment?.loan_id) === String(loan.loan_id)
    );

    // Calculate total paid for this loan
    const totalPaid = loanPayments.reduce(
      (sum, payment) => sum + parseFloat(payment?.amount || 0),
      0
    );

    // Calculate outstanding balance
    const outstandingBalance = parseFloat(loan?.total_amount || 0) - totalPaid;

    // Store result in a map
    acc[loan.loan_id] = Math.max(outstandingBalance, 0).toFixed(2); // Ensure no negative values
    return acc;
  }, {});
}

//
function calculateTotalPaid(loans, payments = []) {
  if (!Array.isArray(loans) || loans.length === 0) return {};

  return loans.reduce((acc, loan) => {
    // Filter payments for this specific loan ID
    const loanPayments = payments.filter(
      (payment) => String(payment?.loan_id) === String(loan.loan_id)
    );

    // Calculate total paid for this loan
    const totalPaid = loanPayments.reduce(
      (sum, payment) => sum + parseFloat(payment?.amount || 0),
      0
    );

    // Store total paid in a map
    acc[loan.loan_id] = totalPaid.toFixed(2);
    return acc;
  }, {});
}
