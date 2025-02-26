import React, { useState, useEffect } from "react";

// import styles from "./LoanPage.module.css";
import styles from "./LoanTable.module.css";
import formatDateAndTime from "/utils/formatDateAndTime.js";
import LoadingSpinner from "../../LoadingSpinner";
import LoanPagination from "./Pagination";
import SideBar from "../../SideBar";
import Modal from "../../Modal";

import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useLoan } from "../../../context/LoanContext";
import { capitalizeWords } from "../../../../utils/capitalizeWords";

function History(props) {
  const { loans } = useLoan();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loanData, setLoanData] = useState(null);

  useEffect(() => {
    // Fetch the staff ID associated with the logged-in user
    const fetchData = async () => {
      setLoading(true);
      try {
        if (loans) {
          // setLoans(loans);
          setLoanData(loans);
        } else {
          console.error("Failed to fetch loans:", loans);
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loans]);

  // Filter for new loans
  const historicData = loanData?.filter(
    (loan) =>
      loan.status === "rejected" ||
      loan.status === "paid" ||
      loan.status === "closed" ||
      loan.status === "canceled"
  );

  //
  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div>
          <h3>Loan History</h3>
          {success && (
            <Alert variant="success" className="warning">
              {success?.msg}
            </Alert>
          )}
          {error && (
            <Alert variant="warning" className="warning">
              {error?.msg}
            </Alert>
          )}
          <LoanTable
            loanData={historicData}
            itemsPerPage={10}
            setSuccess={setSuccess}
            setError={setError}
          />
        </div>
      )}
    </>
  );
}

export default History;

const LoanTable = ({ loanData, setSuccess, setError }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editLoan, setEditLoan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(loanData?.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loanData?.slice(indexOfFirstLoan, indexOfLastLoan);

  // Function to open the sidebar with loan details
  const openSidebar = (loan) => {
    setSelectedLoan(loan);
    setIsSidebarOpen(loan);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedLoan(null);
    setIsSidebarOpen(false);
  };

  const openEditModal = (loan) => {
    setIsEditModalOpen(true);
    setEditLoan(loan);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditLoan(null);
  };

  //
  return (
    <>
      <table className={styles.tableRoot}>
        {/* Table Header */}
        <thead className={styles.tableHead}>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>Loan</th>
            <th className={styles.tableHeadCell}>Submitted</th>
            <th className={styles.tableHeadCell}>Customer</th>
            <th className={styles.tableHeadCell}>Status</th>
            <th className={styles.tableHeadCell}>Total</th>
            <th className={styles.tableHeadCell}>Approved</th>
            <th className={styles.tableHeadCell}>View</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className={styles.tableBody}>
          {currentLoans?.map((loan) => {
            const { formattedDate, formattedTime } = formatDateAndTime(
              loan.submission_date
            );

            const { formattedDate: approvalDate, formattedTime: approvalTime } =
              formatDateAndTime(loan.approval_date);

            //
            return (
              <tr key={loan.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <Link to="" className={styles.link}>
                    {loan.loan_id}
                  </Link>
                </td>
                <td className={styles.tableCell}>
                  {(
                    <div className={styles.approvalDate}>
                      <div className={styles.date}>{formattedDate}</div>
                      <div className={styles.time}>{formattedTime}</div>
                    </div>
                  ) || "N/A"}
                </td>
                <td className={styles.tableCell}>{`${loan.full_name}`}</td>
                <td className={styles.tableCell}>
                  <div className={styles.statusWrapper}>
                    <div
                      className={`${styles.statusDot} ${
                        loan.status === "paid"
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
                    {capitalizeWords(loan.status)}
                  </div>
                </td>
                <td
                  className={styles.tableCell}
                >{`$${loan.total_amount.toLocaleString()}`}</td>
                <td className={styles.tableCell}>
                  {loan.approval_date ? (
                    <div className={styles.approvalDate}>
                      <div className={styles.date}>{approvalDate}</div>
                      <div className={styles.time}>{approvalTime}</div>
                    </div>
                  ) : (
                    "N/A"
                  )}
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
            <td colSpan="7" className={`${styles.paginationCell}`}>
              <LoanPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {isSidebarOpen && (
        <ManageLoan
          loan={selectedLoan} // Pass the selected loan
          closeModal={closeSidebar}
          isModalOpen={isSidebarOpen}
          isEditModalOpen={isEditModalOpen}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
        />
      )}

      {isEditModalOpen && (
        <EditLoan
          loan={editLoan}
          isEditModalOpen={isEditModalOpen}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
          setSuccess={setSuccess}
          setError={setError}
        />
      )}
    </>
  );
};

//
function ManageLoan({ loan, isModalOpen, closeModal, openEditModal }) {
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

  console.log(loan);

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

                  {loan.co_debtor === "yes" ? (
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
                    <strong>Payment Balance:</strong> Nle
                    {loan?.balance?.toLocaleString() || 0}
                  </p>
                  <p>
                    <strong>Approved Amount:</strong> NLe
                    {loan?.approved_amount || "N/A"}
                  </p>
                  <p>
                    <strong>Processing Fee:</strong> {loan?.processing_fee}{" "}
                    months
                  </p>
                  <p>
                    <strong>Disbursed Amount:</strong>{" "}
                    {loan?.disbursed_amount?.toLocaleString()} months
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
            </div>
            <button onClick={() => openEditModal(loan)}>Edit Loan</button>
          </div>
        ) : (
          <p>No loan selected.</p>
        )}
      </SideBar>
    </div>
  );
}

//
function EditLoan({
  loan,
  isEditModalOpen,
  closeEditModal,
  setSuccess,
  setError,
}) {
  const { updateLoan } = useLoan();
  const [formData, setFormData] = useState({
    ...loan,
    customer: {
      ...loan?.customer,
      user: {
        ...loan?.customer?.user,
      },
    },
  });

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prevData) => {
        let updatedData = { ...prevData };
        let ref = updatedData;

        // Navigate to the nested property
        for (let i = 0; i < keys.length - 1; i++) {
          ref[keys[i]] = { ...ref[keys[i]] };
          ref = ref[keys[i]];
        }

        // Update the final key
        ref[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
        return updatedData;
      });
    } else {
      // Handle top-level fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission (save changes)
  const handleSave = () => {
    // Validation (optional: implement as needed)
    if (!formData.full_name || !formData.loan_amount) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedData = { ...formData };
    const loanId = loan?.loan_id;
    const customerId = loan?.customer_id;

    // Call saveLoan function to update the data
    // saveLoan(formData);
    console.log({
      updatedData,
    });

    updateLoan(loanId, updatedData, customerId);
    // setSuccess();
    // setError();
    // Close the modal after saving
    closeEditModal();
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={closeEditModal}
      onClick={closeEditModal}
      customClass={styles.editLoanModal}
    >
      <div className={styles.manageLoan}>
        <form className={styles.form}>
          <span onClick={closeEditModal} className={styles.closeBtn}>
            X
          </span>

          <h3 className={styles.sideBarHeader}>Edit Loan Details</h3>

          {/* Customer Information */}
          <div className={styles.formGroup}>
            <label>Customer Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Customer ID</label>
            <input
              type="text"
              name="customer_id"
              value={formData.customer_id || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.customer?.user?.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.customer?.user?.email || ""}
              onChange={handleChange}
            />
          </div>

          {/* Loan Details */}
          <div className={styles.formGroup}>
            <label>Loan ID</label>
            <input
              type="text"
              name="loan_id"
              value={formData.loan_id || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Loan Amount</label>
            <input
              type="number"
              name="loan_amount"
              value={formData.loan_amount || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Interest Rate</label>
            <input
              type="number"
              step="0.01"
              name="interest_rate"
              value={formData.interest_rate || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Loan Type</label>
            <input
              type="text"
              name="loan_type"
              value={formData.loan_type || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Loan Purpose</label>
            <textarea
              name="loan_purpose"
              value={formData.loan_purpose || ""}
              onChange={handleChange}
            />
          </div>

          {/* Financial Details */}
          <div className={styles.formGroup}>
            <label>Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Monthly Payment</label>
            <input
              type="number"
              name="monthly_payment"
              value={formData.monthly_payment || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Monthly Salary</label>
            <input
              type="number"
              name="monthly_salary"
              value={formData.monthly_salary || ""}
              onChange={handleChange}
            />
          </div>

          {/* Reviews */}
          <div className={styles.formGroup}>
            <label>First Review</label>
            <textarea
              name="first_review_notes"
              value={formData.first_review_notes || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Second Review</label>
            <textarea
              name="second_review_notes"
              value={formData.second_review_notes || ""}
              onChange={handleChange}
            />
          </div>

          {/* Approval Details */}
          <div className={styles.formGroup}>
            <label>Approved Amount</label>
            <input
              type="number"
              name="approved_amount"
              value={formData.approved_amount || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Approved By</label>
            <input
              type="text"
              name="approved_by"
              value={formData.approved_by || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Approval Comments</label>
            <textarea
              name="approval_comments"
              value={formData.approval_comments || ""}
              onChange={handleChange}
            />
          </div>

          {/* Other Details */}
          <div className={styles.formGroup}>
            <label>Consent</label>
            <input
              type="text"
              name="consent"
              value={formData.consent || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason || ""}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value="paying">Paying</option>
              <option value="applied">Applied</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="canceled">Canceled</option>
              <option value="processed">Processed</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button type="button" onClick={handleSave}>
            Save Changes
          </button>
        </form>
      </div>
    </Modal>
  );
}
