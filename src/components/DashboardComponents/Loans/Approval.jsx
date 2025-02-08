import React, { useState, useEffect } from "react";
import styles from "./LoanApproval.module.css";
import formatDateAndTime from "/utils/formatDateAndTime";
import { useLoan } from "../../../context/LoanContext";

import Modal from "../../../components/Modal";

const handleFinalDecision = async ({
  action,
  updatedFormData,
  approveLoan,
  closeLoan,
  cancelLoan,
  rejectLoan,
}) => {
  // Define action-to-context function mapping

  const actionFunctions = {
    approve: approveLoan,
    reject: rejectLoan,
    cancel: cancelLoan,
    close: closeLoan,
  };

  // Get the function based on the action
  const actionFunction = actionFunctions[action];

  if (!actionFunction) {
    alert(`Invalid action: ${action}`);
    return;
  }

  try {
    await actionFunction(updatedFormData);
    alert(`Loan ${action} successful!`);
  } catch (error) {
    console.error(`Error during ${action}:`, error);
    alert(`An error occurred while trying to ${action} the loan.`);
  }
};

//
function Approval({ approvalData, loading, closeModal }) {
  const { approveLoan, rejectLoan, cancelLoan, closeLoan } = useLoan();
  const { formattedDate: approvalDate } = approvalData?.approval_date
    ? formatDateAndTime(approvalData?.approval_date)
    : { formattedDate: "N/A" };

  const { formattedDate: firstReviewDate } = formatDateAndTime(
    approvalData?.first_review_date
  );
  const { formattedDate: secondReviewDate } = formatDateAndTime(
    approvalData?.second_review_date
  );
  const { formattedDate: submissionDate } = formatDateAndTime(
    approvalData?.submission_date
  );

  const [otherActionFormData, setOtherActionFormData] = useState({
    approved_by: "",
    comments: "",
  });

  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    loan_amount: approvalData?.loan_amount || "",
    approved_amount: approvalData?.loan_amount || "",
    interest_rate: approvalData?.interest_rate || "",
    loan_period: approvalData?.loan_period || "",
    comments: "",
    approved_by: "",
    disbursed_amount: "",
    total_amount: approvalData?.total_amount || "",
    monthly_payment: approvalData?.payment || "",
    processing_fee: approvalData?.processing_fee || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // State for error messages
  // console.log(approvalData);

  // Recalculate values dynamically
  useEffect(() => {
    const approvedAmount = parseFloat(formData?.approved_amount || 0);
    const interestRate = parseFloat(formData?.interest_rate || 0);
    const loanPeriod = parseInt(formData?.loan_period || 0, 10);

    if (
      !isNaN(approvedAmount) &&
      approvedAmount > 0 &&
      !isNaN(interestRate) &&
      interestRate > 0 &&
      !isNaN(loanPeriod) &&
      loanPeriod > 0
    ) {
      const interest = approvedAmount * interestRate;
      const totalAmount = approvedAmount + interest;
      const monthlyPayment = totalAmount / loanPeriod;
      const processingFee = approvedAmount * 0.02;
      const disbursed_amount = approvedAmount - processingFee;

      setFormData((prev) => ({
        ...prev,
        total_amount: totalAmount.toFixed(2),
        monthly_payment: monthlyPayment.toFixed(2),
        processing_fee: processingFee.toFixed(2),
        disbursed_amount: disbursed_amount.toFixed(2),
      }));
    }
  }, [
    formData?.approved_amount,
    formData?.interest_rate,
    formData?.loan_period,
    formData?.disbursed_amount,
    formData?.payment,
  ]);

  //
  const handleInputChange = (e, isApproveForm = false) => {
    const { name, value } = e.target;

    if (isApproveForm) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setOtherActionFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //
  const handleFormOpen = (formType) => {
    setActiveForm(formType); // Open the selected form
    setIsModalOpen(true);
  };

  //
  const closeForm = () => {
    setActiveForm(null); // Close the form
    setIsModalOpen(false);
    setFormData((prev) => ({
      ...prev,
      comments: "",
      approved_by: "",
    })); // Reset fields
    setOtherActionFormData({ approved_by: "", comments: "" });
    setError(null); // Clear error messages
  };

  //
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if the loan is already paid
    if (approvalData?.status === "paid") {
      setError("This loan is already paid and cannot be modified.");
      return;
    }

    // Check if the loan is in a valid state for the requested action
    if (
      (activeForm === "approve" && approvalData?.status !== "processed") ||
      //
      (activeForm === "cancel" && approvalData?.status !== "approved") ||
      (activeForm === "cancel" && approvalData?.status !== "processed") ||
      (activeForm === "cancel" && approvalData?.status !== "paying") ||
      //
      (activeForm === "reject" && approvalData?.status !== "applied") ||
      (activeForm === "reject" && approvalData?.status !== "processed") ||
      //
      (activeForm === "close" && approvalData?.status !== "approved") ||
      (activeForm === "close" && approvalData?.status !== "paid") ||
      (activeForm === "close" && approvalData?.status !== "paying")
    ) {
      setError(
        `Cannot ${activeForm} a loan with status: ${approvalData?.status}`
      );
      return;
    }

    const inputsData = {
      ...formData,
      customerId: approvalData?.customer_id,
      loanId: approvalData?.loan_id,
    };

    const inputsDataOthers = {
      ...otherActionFormData,
      customerId: approvalData?.customer_id,
      loanId: approvalData?.loan_id,
    };

    const updatedFormData =
      activeForm === "approve" ? inputsData : inputsDataOthers;

    handleFinalDecision({
      action: activeForm,
      updatedFormData,
      approveLoan,
      closeLoan,
      cancelLoan,
      rejectLoan,
    });

    closeForm();
  };

  //   const inputsData = {
  //     ...formData,
  //     customerId: approvalData?.customer_id,
  //     loanId: approvalData?.loan_id,
  //   };

  //   const inputsDataOthers = {
  //     ...otherActionFormData,
  //     customerId: approvalData?.customer_id,
  //     loanId: approvalData?.loan_id,
  //   };

  //   const updatedFormData =
  //     activeForm === "approve" ? inputsData : inputsDataOthers;

  //   console.log(updatedFormData);

  //   handleFinalDecision({
  //     action: activeForm,
  //     updatedFormData,

  //     approveLoan,
  //     closeLoan,
  //     cancelLoan,
  //     rejectLoan,
  //   });

  //   //
  //   closeForm();
  // };

  return (
    <div className={styles.approvalContainer}>
      <h3>Selected Loan Details</h3>
      <span onClick={closeModal}>X</span>
      <div className={`${styles.form} ${styles.loanPropertyDisplay}`}>
        <div className={styles.viewLoanDetails}>
          <div>
            <h4>Loan Specs</h4>
            <p>
              <strong>Loan ID:</strong> {approvalData?.loan_id}
            </p>
            <p>
              <strong>Loan Type:</strong> {approvalData?.loan_type}
            </p>
            <p>
              <strong>Loan Purpose:</strong> {approvalData?.loan_purpose}
            </p>
            <p>
              <strong>Requested Amount:</strong> NLe
              {approvalData?.loan_amount?.toLocaleString()}
            </p>
            <p>
              <strong>Interest Rate:</strong> {approvalData?.interest_rate}%
            </p>
            <p>
              <strong>Loan Period:</strong> {approvalData?.loan_period} months
            </p>
            <p>
              <strong>Total Amount:</strong> NLe
              {approvalData?.total_amount?.toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {approvalData?.status}
            </p>
          </div>

          <div>
            <h4>Approval</h4>
            <p>
              <strong>Payment Balance:</strong> NLe
              {approvalData?.balance?.toLocaleString()}
            </p>
            <p>
              <strong>Approved Amount:</strong> NLe
              {approvalData?.approved_amount || "N/A"}
            </p>
            <p>
              <strong>Processing Fee:</strong> {approvalData?.processing_fee}
            </p>
            <p>
              <strong>Disbursed Amount:</strong>{" "}
              {approvalData?.disbursed_amount?.toLocaleString()}
            </p>

            <p>
              <strong>Approved By:</strong> {approvalData?.approved_by || "N/A"}
            </p>
            <p>
              <strong>Approval Date:</strong> {approvalDate || "N/A"}
            </p>
          </div>

          <div>
            <h4>Reviews</h4>
            <p>
              <strong>First Review:</strong> {approvalData?.first_review}
            </p>
            <p>
              <strong>First Reviewer:</strong>{" "}
              {approvalData?.first_reviewer || "N/A"}
            </p>
            <p>
              <strong>First Review Date:</strong>{" "}
              {firstReviewDate ? firstReviewDate : "N/A"}
            </p>
            <p>
              <strong>Second Review:</strong> {approvalData?.second_review}
            </p>
            <p>
              <strong>Second Reviewer:</strong>{" "}
              {approvalData?.second_reviewer || "N/A"}
            </p>
            <p>
              <strong>Second Review Date:</strong>{" "}
              {secondReviewDate ? secondReviewDate : "N/A"}
            </p>
          </div>

          <div>
            <h4>Coustomer</h4>
            <p>
              <strong>Customer Name:</strong> {approvalData?.full_name}
            </p>
            <p>
              <strong>Customer ID:</strong> {approvalData?.customer_id}
            </p>

            <p>
              <strong>Monthly Salary:</strong> NLe
              {approvalData?.monthly_salary?.toLocaleString()}
            </p>

            {approvalData?.co_debtor === "yes" ? (
              <>
                <p>
                  <strong>Co-Debtor:</strong> {approvalData?.co_debtor}
                </p>
                <p>
                  <strong>Co-Debtor Name:</strong>{" "}
                  {approvalData?.co_debtor_name}
                </p>
                <p>
                  <strong>Co-Debtor Relation:</strong>{" "}
                  {approvalData?.co_debtor_relation}
                </p>
              </>
            ) : (
              <p>
                <strong>Co-Debtor:</strong> No Co-debtor
              </p>
            )}
            <p>
              <strong>Prior Loan History:</strong>{" "}
              {approvalData?.prior_loan_history}
            </p>
            <p>
              <strong>Owe Arrears Elsewhere:</strong>{" "}
              {approvalData?.owe_arrears_elsewhere}
            </p>
          </div>

          <div>
            <h4>Consent</h4>
            <p>
              <strong>Consent:</strong> {approvalData?.consent}
            </p>
            <p>
              <strong>Submission Date:</strong> {submissionDate || "N/A"}
            </p>
          </div>
        </div>
        <div className={styles.loanDepositionBtn}>
          {/* Buttons to trigger forms */}
          <button onClick={() => handleFormOpen("approve")}>
            Approve Loan
          </button>
          <button onClick={() => handleFormOpen("cancel")}>Cancel Loan</button>
          <button onClick={() => handleFormOpen("reject")}>Reject Loan</button>
          <button onClick={() => handleFormOpen("close")}>Close Loan</button>
        </div>

        {/* Dynamic Form Rendering */}
        <Modal isOpen={isModalOpen} onClose={closeForm}>
          {activeForm && (
            <div className={`${styles.bottomForm} ${styles.slideUp}`}>
              {activeForm === "approve" && (
                <ApprovalLoanForm
                  formData={formData}
                  handleInputChange={(e) => handleInputChange(e, true)}
                  handleFormSubmit={handleFormSubmit}
                  closeForm={closeForm}
                  loading={loading}
                  approvalData={approvalData}
                />
              )}
              {["cancel", "reject", "close"].includes(activeForm) && (
                <OtherActionForm
                  action={activeForm}
                  formData={otherActionFormData}
                  handleInputChange={handleInputChange}
                  handleFormSubmit={handleFormSubmit}
                  closeForm={closeForm}
                  loading={loading}
                />
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Approval;

//
function OtherActionForm({
  action,
  formData,
  handleInputChange,
  handleFormSubmit,
  closeForm,
  loading,
}) {
  const actionLabel = {
    cancel: "Cancel Loan",
    reject: "Reject Loan",
    close: "Close Loan",
  }[action];

  return (
    <form onSubmit={handleFormSubmit} className={styles.form}>
      <h3>{actionLabel}</h3>
      <div>
        <label>{actionLabel} By</label>
        <input
          type="text"
          name="approved_by"
          placeholder="Approver Name"
          value={formData?.approved_by}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Comments</label>
        <textarea
          name="comments"
          placeholder="Comments"
          value={formData?.comments}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.btnsDeposition}>
        <button type="button" onClick={closeForm}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : actionLabel}
        </button>
      </div>
    </form>
  );
}

//
function ApprovalLoanForm({
  formData,
  handleInputChange,
  handleFormSubmit,
  closeForm,
  loading,
  approvalData,
}) {
  return (
    <form onSubmit={handleFormSubmit} className={styles.form}>
      <h3>Approve Loan</h3>
      <div className={styles.currentLoanData}>
        <div>
          <label>Requested Loan Amount</label>
          <input
            type="number"
            placeholder="Loan amount requested"
            value={formData?.loan_amount || ""}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div>
          <label>Approve Amount</label>
          <input
            type="number"
            name="approved_amount"
            placeholder="Approved Amount"
            value={formData?.approved_amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Interest Rate</label>
          <input
            type="number"
            name="interest_rate"
            placeholder="Interest Rate"
            value={formData.interest_rate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Loan Period</label>
          <input
            type="number"
            name="loan_period"
            placeholder="Loan Period"
            value={formData.loan_period}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Monthly Payment</label>
          <input
            type="number"
            name="monthly_payment"
            placeholder="Monthly payment"
            value={formData.monthly_payment}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Processing Fee</label>
          <input
            type="number"
            name="processing_fee"
            placeholder="Processing fee"
            value={formData.processing_fee}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>

        <div>
          <label>Loan Total</label>
          <input
            type="number"
            name="total_amount"
            placeholder="total_amount"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>

        <div>
          <label>Disbursed Amount</label>
          <input
            type="number"
            name="disbursed_amount"
            placeholder="Disbursed Amount"
            value={formData.disbursed_amount}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>
      </div>

      <div className={styles.reviewNotes}>
        <h4>Review Notes:</h4>
        <p>First Review: {approvalData?.first_review_notes}</p>
        <p>Second Review: {approvalData?.second_review_notes}</p>
      </div>

      <div>
        <label>Approved By</label>
        <input
          type="text"
          name="approved_by"
          placeholder="Approver Name"
          value={formData.approved_by}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Comment</label>
        <textarea
          type="text"
          name="comments"
          placeholder="Approval Comments"
          value={formData.comments}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.btnsDeposition}>
        <button type="button" onClick={closeForm}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Approve Loan"}
        </button>
      </div>
    </form>
  );
}
