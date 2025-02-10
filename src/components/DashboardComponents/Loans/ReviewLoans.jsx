import React, { useEffect, useState } from "react";
import styles from "./ReviewLoans.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import Pagination from "../Components/Pagination";
import SideBar from "../../SideBar";
import formatDateAndTime from "/utils/formatDateAndTime";
import LoanApproval from "./LoanApproval";

import { useLoan } from "../../../context/LoanContext";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../../../../utils/capitalizeWords";

//
function filterLoansByStatus(loans, ...statuses) {
  return loans?.filter((loan) => statuses.includes(loan.status));
}

function ReviewLoans({
  handleCustomerSubMenuClick,
  handleApproval,
  setApprovalData,
}) {
  const { loans } = useLoan();
  const [myLoans, setMyLoans] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      setMyLoans(loans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [loans]);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={`${styles.loansContainer}`}>
          <h3>Review Loans</h3>
          <ReviewLoanTable
            handleApproval={handleApproval}
            myLoans={myLoans}
            setMyLoans={setMyLoans}
            handleCustomerSubMenuClick={handleCustomerSubMenuClick}
          />
        </div>
      )}
    </>
  );
}

export default ReviewLoans;

const ReviewLoanTable = ({
  myLoans,
  handleCustomerSubMenuClick,
  handleApproval,
  // setApprovalData,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  //
  const filteredLoans = filterLoansByStatus(
    myLoans,
    "applied",
    "processing",
    "processed"
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(filteredLoans?.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans?.slice(indexOfFirstLoan, indexOfLastLoan);

  // Function to open the sidebar with loan details
  const openSidebar = (loan) => {
    setSelectedLoan(loan);
    setIsSidebarOpen(true);
  };

  const openCustomerDetails = (loan) => {
    handleCustomerSubMenuClick("customer-details", loan.customer);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedLoan(null);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.tableRoot}>
        {/* Table Header */}
        <thead className={styles.tableHead}>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>ID</th>
            <th className={styles.tableHeadCell}>Requested</th>
            <th className={styles.tableHeadCell}>Approved</th>
            <th className={styles.tableHeadCell}>Loan</th>
            <th className={styles.tableHeadCell}>Status</th>
            <th className={styles.tableHeadCell}>Approve Date</th>
            <th className={styles.tableHeadCell}>Customer</th>
            <th className={styles.tableHeadCell}>Name</th>
            <th className={styles.tableHeadCell}>Phone</th>
            <th className={styles.tableHeadCell}>Address</th>
            <th className={styles.tableHeadCell}>Institution</th>
            <th className={styles.tableHeadCell}>Manage</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className={styles.tableBody}>
          {currentLoans?.map((loan) => {
            const { formattedDate, formattedTime } = formatDateAndTime(
              loan?.approval_date
            );

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
                  {loan.loan_amount
                    ? `NLe ${loan.loan_amount.toLocaleString()}`
                    : "N/A"}
                </td>
                <td className={styles.tableCell}>
                  {loan.approved_amount
                    ? `NLe ${loan.approved_amount.toLocaleString()}`
                    : "N/A"}
                </td>
                <td className={styles.tableCell}>
                  {loan.total_amount
                    ? `NLe ${loan.total_amount.toLocaleString()}`
                    : "N/A"}
                </td>
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

                <td className={styles.tableCell}>
                  {loan.approval_date ? (
                    <div className={styles.approvalDate}>
                      <div className={styles.date}>{formattedDate}</div>
                      <div className={styles.time}>{formattedTime}</div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className={styles.tableCell}>
                  <Link
                    onClick={() => openCustomerDetails(loan)}
                    className={styles.link}
                  >
                    <i className="fa-solid fa-user"></i>
                    {loan.customer_id}
                  </Link>
                </td>

                <td className={styles.tableCell}>{`${loan?.full_name}`}</td>
                <td className={styles.tableCell}>
                  {loan.customer?.user?.phone}
                </td>
                <td className={styles.tableCell}>
                  {loan.customer?.address
                    ? `${loan.customer?.address?.address} ${loan.customer?.address?.city}`
                    : "N/A"}
                </td>
                <td className={styles.tableCell}>
                  {loan.customer?.employer?.employer_name}
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {isSidebarOpen && (
        <ReviewLoan
          loan={selectedLoan} // Pass the selected loan
          closeModal={closeSidebar}
          isModalOpen={isSidebarOpen}
          handleApproval={handleApproval}
        />
      )}
    </div>
  );
};

//
function ReviewLoan({
  loan,
  isModalOpen,
  closeModal,
  handleApproval,
  setApprovalData,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...loan });
  const [reviewedLoan, setReviewedLoan] = useState(loan);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  const { formattedDate: approvalDate } = reviewedLoan?.approval_date
    ? formatDateAndTime(reviewedLoan.approval_date)
    : { formattedDate: "N/A" };

  const { formattedDate: firstReviewDate } = formatDateAndTime(
    reviewedLoan?.first_review_date
  );
  const { formattedDate: secondReviewDate } = formatDateAndTime(
    reviewedLoan?.second_review_date
  );
  const { formattedDate: submissionDate } = formatDateAndTime(
    reviewedLoan?.submission_date
  );

  // Check if both reviews are complete
  const areReviewsComplete =
    reviewedLoan?.first_review === "complete" &&
    reviewedLoan?.second_review === "complete";

  const toggleEdit = () => {
    if (isEditing) {
      alert("Loan details updated successfully!"); // Placeholder for API call
    }
    setIsEditing(!isEditing);
  };

  const handleLoanReviews = (updatedLoan) => {
    setReviewedLoan(updatedLoan);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.manageLoan}>
      <SideBar isOpen={isModalOpen} closeModal={closeModal}>
        <h3 className={styles.sideBarHeader}>Loan Details</h3>
        {reviewedLoan ? (
          <div className={styles.sideBarContainer}>
            <div className={styles.viewLoanContent}>
              <div className={styles.viewLoanDetails}>
                <div>
                  <p>
                    <strong>Loan ID:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="loan_id"
                        value={formData.loan_id || ""}
                        onChange={handleInputChange}
                        readOnly
                      />
                    ) : (
                      reviewedLoan?.loan_id
                    )}
                  </p>
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name || ""}
                        onChange={handleInputChange}
                        readOnly
                      />
                    ) : (
                      reviewedLoan?.full_name
                    )}
                  </p>
                  <p>
                    <strong>Customer ID:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="customer_id"
                        value={formData.customer_id || ""}
                        onChange={handleInputChange}
                        readOnly
                      />
                    ) : (
                      reviewedLoan?.customer_id
                    )}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="status"
                        value={formData.status || ""}
                        onChange={handleInputChange}
                        readOnly
                      />
                    ) : (
                      reviewedLoan?.status
                    )}
                  </p>
                  <p>
                    <strong>Loan Type:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="loan_type"
                        value={formData.loan_type || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      reviewedLoan?.loan_type
                    )}
                  </p>
                  <p>
                    <strong>Loan Purpose:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="loan_purpose"
                        value={formData.loan_purpose || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      reviewedLoan?.loan_purpose
                    )}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Loan Amount:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="loan_amount"
                        value={formData.loan_amount || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `NLe${reviewedLoan?.loan_amount?.toLocaleString()}`
                    )}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="interest_rate"
                        value={formData.interest_rate || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `${reviewedLoan?.interest_rate}%`
                    )}
                  </p>
                  <p>
                    <strong>Loan Period:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="loan_period"
                        value={formData.loan_period || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `${reviewedLoan?.loan_period} months`
                    )}
                  </p>
                  <p>
                    <strong>Total Amount:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="total_amount"
                        value={formData.total_amount || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `NLe${reviewedLoan?.total_amount?.toLocaleString()}`
                    )}
                  </p>
                  <p>
                    <strong>Approved Amount:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="approved_amount"
                        value={formData.approved_amount || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `NLe${reviewedLoan?.approved_amount || "N/A"}`
                    )}
                  </p>
                  <p>
                    <strong>Processing Fee:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        name="processing_fee"
                        value={formData.processing_fee || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `NLe${reviewedLoan?.processing_fee}`
                    )}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>First Reviewer:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_reviewer"
                        value={formData.first_reviewer || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      reviewedLoan?.first_reviewer || "N/A"
                    )}
                  </p>
                  <p>
                    <strong>First Review Date:</strong>{" "}
                    {firstReviewDate || "N/A"}
                  </p>
                  <p>
                    <strong>Second Reviewer:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="second_reviewer"
                        value={formData.second_reviewer || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      reviewedLoan?.second_reviewer || "N/A"
                    )}
                  </p>
                  <p>
                    <strong>Second Review Date:</strong>{" "}
                    {secondReviewDate || "N/A"}
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <div className={styles.editBtns}>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles.toggleBtn}
                >
                  cancel
                </button>
                <button
                  onClick={toggleEdit}
                  className={styles.toggleBtn}
                  disabled={areReviewsComplete}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>

              <div>
                <LoanApproval
                  reviewedLoan={reviewedLoan}
                  handleApproval={handleApproval}
                  handleLoanReviews={handleLoanReviews}
                  setApprovalData={setApprovalData}
                  setReviewSuccess={setReviewSuccess}
                  reviewSuccess={reviewSuccess}
                  setReviewError={setReviewError}
                  reviewError={reviewError}
                />
              </div>
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
// function ReviewLoan({
//   loan,
//   isModalOpen,
//   closeModal,
//   handleApproval,
//   setApprovalData,
// }) {
//   const { formattedDate: approvalDate } = loan.approval_date
//     ? formatDateAndTime(loan.approval_date)
//     : { formattedDate: "N/A" };

//   const { formattedDate: firstReviewDate } = formatDateAndTime(
//     loan?.first_review_date
//   );
//   const { formattedDate: secondReviewDate } = formatDateAndTime(
//     loan?.second_review_date
//   );
//   const { formattedDate: submissionDate } = formatDateAndTime(
//     loan.submission_date
//   );

//   return (
//     <div className={styles.manageLoan}>
//       <SideBar isOpen={isModalOpen} closeModal={closeModal}>
//         <h3 className={styles.sideBarHeader}>Loan Details</h3>
//         {loan ? (
//           <div className={styles.sideBarContainer}>
//             <div className={styles.viewLoanContent}>
//               <div className={styles.viewLoanDetails}>
//                 <div>
//                   <p>
//                     <strong>Loan ID:</strong> {loan?.loan_id}
//                   </p>
//                   <p>
//                     <strong>Customer Name:</strong> {loan?.full_name}
//                   </p>
//                   <p>
//                     <strong>Customer ID:</strong> {loan?.customer_id}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {loan?.status}
//                   </p>
//                   <p>
//                     <strong>Loan Type:</strong> {loan?.loan_type}
//                   </p>
//                   <p>
//                     <strong>Loan Purpose:</strong> {loan?.loan_purpose}
//                   </p>

//                   {loan.co_debtor === "yes" ? (
//                     <>
//                       <p>
//                         <strong>Co-Debtor:</strong> {loan?.co_debtor}
//                       </p>
//                       <p>
//                         <strong>Co-Debtor Name:</strong> {loan?.co_debtor_name}
//                       </p>
//                       <p>
//                         <strong>Co-Debtor Relation:</strong>{" "}
//                         {loan?.co_debtor_relation}
//                       </p>
//                     </>
//                   ) : (
//                     <p>
//                       <strong>Co-Debtor:</strong> No Co-debtor
//                     </p>
//                   )}
//                   <p>
//                     <strong>Prior Loan History:</strong>{" "}
//                     {loan?.prior_loan_history}
//                   </p>
//                   <p>
//                     <strong>Owe Arrears Elsewhere:</strong>{" "}
//                     {loan?.owe_arrears_elsewhere}
//                   </p>
//                 </div>

//                 <div>
//                   <p>
//                     <strong>Loan Amount:</strong> NLe
//                     {loan?.loan_amount?.toLocaleString()}
//                   </p>
//                   <p>
//                     <strong>Interest Rate:</strong> {loan?.interest_rate}%
//                   </p>
//                   <p>
//                     <strong>Loan Period:</strong> {loan?.loan_period} months
//                   </p>
//                   <p>
//                     <strong>Total Amount:</strong> NLe
//                     {loan?.total_amount?.toLocaleString()}
//                   </p>
//                   <p>
//                     <strong>Payment Balance:</strong> NLe
//                     {loan?.balance?.toLocaleString() || 0}
//                   </p>
//                   <p>
//                     <strong>Approved Amount:</strong> NLe
//                     {loan?.approved_amount || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Processing Fee:</strong> {loan?.processing_fee}
//                   </p>
//                   <p>
//                     <strong>Disbursed Amount:</strong>{" "}
//                     {loan?.disbursed_amount?.toLocaleString()}
//                   </p>
//                   <p>
//                     <strong>Approved By:</strong> {loan?.approved_by || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Approval Date:</strong> {approvalDate || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Monthly Salary:</strong> NLe
//                     {loan?.monthly_salary?.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <strong>First Review:</strong> {loan?.first_review}
//                   </p>
//                   <p>
//                     <strong>First Reviewer:</strong>{" "}
//                     {loan?.first_reviewer || "N/A"}
//                   </p>
//                   <p>
//                     <strong>First Review Date:</strong>{" "}
//                     {firstReviewDate ? firstReviewDate : "N/A"}
//                   </p>
//                   <p>
//                     <strong>Second Review:</strong> {loan?.second_review}
//                   </p>
//                   <p>
//                     <strong>Second Reviewer:</strong>{" "}
//                     {loan?.second_reviewer || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Second Review Date:</strong>{" "}
//                     {secondReviewDate ? secondReviewDate : "N/A"}
//                   </p>
//                   <p>
//                     <strong>Consent:</strong> {loan?.consent}
//                   </p>
//                   <p>
//                     <strong>Submission Date:</strong> {submissionDate || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <LoanApproval
//                   loan={loan}
//                   handleApproval={handleApproval}
//                   setApprovalData={setApprovalData}
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p>No loan selected.</p>
//         )}
//       </SideBar>
//     </div>
//   );
// }
