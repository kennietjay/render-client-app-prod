import React, { useState } from "react";
import { useLoan } from "../../../context/LoanContext";
import styles from "./LoanApproval.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import Approval from "./Approval";

function LoanApproval({ loan, handleApproval }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { firstReview, secondReview, approveLoan, getLoans } = useLoan();
  const {
    customer_id,
    status = `"applied" || "" ? "applied":"applied"`,
    first_review = "",
    second_review = "",
    approval = "",
  } = loan || {};

  const [showFirstReviewForm, setShowFirstReviewForm] = useState(false);
  const [showSecondReviewForm, setShowSecondReviewForm] = useState(false);

  const [firstReviewData, setFirstReviewData] = useState({
    first_reviewer: "",
    first_review_notes: "",
  });

  const [secondReviewData, setSecondReviewData] = useState({
    second_reviewer: "",
    second_review_notes: "",
  });

  const [approvalData, setApprovalData] = useState({
    approved_amount: "",
    approved_by: "",
    approval_comments: "",
    total_amount: loan?.total_amount,
    loan_amount: loan?.loan_amount,
    interest_rate: loan?.interest_rate,
    payment: loan?.payment,
    loan_period: loan?.loan_period,
    processing_fee: loan?.processing_fee,
    disbursed_amount: loan?.disbursed_amount,
    first_review_notes: loan?.first_review_notes,
    second_review_notes: loan?.second_review_notes,
  });

  const isFirstReviewClickable =
    (status === "applied" || status === "") &&
    (!first_review || first_review === "pending");

  const isSecondReviewClickable =
    first_review === "complete" &&
    (!second_review || second_review === "pending");

  const isFinalActionClickable =
    first_review === "complete" &&
    second_review === "complete" &&
    (!approval || approval === "pending");

  const isApprovalComplete =
    first_review === "complete" &&
    second_review === "complete" &&
    status === "approved";

  //
  const refreshLoan = async () => {
    try {
      await getLoans();
    } catch (error) {
      console.error("Error refreshing loan data:", error);
    }
  };

  //
  const handleFirstReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await firstReview(loan?.loan_id, customer_id, {
        ...firstReviewData,
        first_review: "complete",
        status: "processing", // Ensure this does not conflict with "processed"
      });
      alert("First review completed successfully.");

      setShowFirstReviewForm(false);

      await refreshLoan(); // Ensure loan data is refreshed
    } catch (error) {
      console.error("Error completing first review:", error);
      alert("Failed to complete first review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecondReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await secondReview(loan?.loan_id, customer_id, {
        ...secondReviewData,
        second_review: "complete",
        status: "processed", // Update the status to indicate it's processed
      });
      alert("Second review completed successfully.");
      setShowSecondReviewForm(false);
      await refreshLoan(); // Ensure loan data is refreshed
    } catch (error) {
      console.error("Error completing second review:", error);
      alert("Failed to complete second review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openApprovalPage = () => {
    if (handleApproval) {
      handleApproval(loan); // Pass the loan data to the handler
    } else {
      console.error("handleApproval is not defined");
    }
  };

  // const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Processing..." />
      ) : (
        <>
          <div className={styles.approval}>
            <div className={styles.reviews}>
              {/* First Review */}
              <div className={styles.reviewItem}>
                <div>
                  <strong>First Review Status:</strong>{" "}
                  {first_review || "Pending"}
                </div>
                <button
                  disabled={!isFirstReviewClickable}
                  className={`${styles.reviewButton} ${
                    isFirstReviewClickable
                      ? styles.activeButton
                      : styles.disabledButton
                  }`}
                  onClick={() => setShowFirstReviewForm(true)}
                >
                  First Review
                </button>
                {showFirstReviewForm && (
                  <form
                    onSubmit={handleFirstReviewSubmit}
                    className={styles.form}
                  >
                    <input
                      type="text"
                      placeholder="Reviewer Name"
                      value={firstReviewData.first_reviewer}
                      onChange={(e) =>
                        setFirstReviewData((prev) => ({
                          ...prev,
                          first_reviewer: e.target.value,
                        }))
                      }
                      required
                    />
                    <textarea
                      placeholder="Review Notes"
                      value={firstReviewData.first_review_notes}
                      onChange={(e) =>
                        setFirstReviewData((prev) => ({
                          ...prev,
                          first_review_notes: e.target.value,
                        }))
                      }
                      required
                      maxLength={50}
                    />
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Submit First Review"}
                    </button>
                  </form>
                )}
              </div>

              {/* Second Review */}
              <div className={styles.reviewItem}>
                <div>
                  <strong>Second Review Status:</strong>{" "}
                  {second_review || "Pending"}
                </div>
                <button
                  disabled={!isSecondReviewClickable}
                  className={`${styles.reviewButton} ${
                    isSecondReviewClickable
                      ? styles.activeButton
                      : styles.disabledButton
                  }`}
                  onClick={() => setShowSecondReviewForm(true)}
                >
                  Second Revie
                </button>
                {showSecondReviewForm && (
                  <form
                    onSubmit={handleSecondReviewSubmit}
                    className={styles.form}
                  >
                    <input
                      type="text"
                      placeholder="Reviewer Name"
                      value={secondReviewData.second_reviewer}
                      onChange={(e) =>
                        setSecondReviewData((prev) => ({
                          ...prev,
                          second_reviewer: e.target.value,
                        }))
                      }
                      required
                    />
                    <textarea
                      placeholder="Review Notes"
                      value={secondReviewData.second_review_notes}
                      onChange={(e) =>
                        setSecondReviewData((prev) => ({
                          ...prev,
                          second_review_notes: e.target.value,
                        }))
                      }
                      required
                      maxLength={50}
                    />
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Submit Second Review"}
                    </button>
                  </form>
                )}
              </div>

              {/* Final Action */}
              <div className={styles.finalAction}>
                <button
                  disabled={!isFinalActionClickable || isApprovalComplete}
                  className={`${styles.finalButton} ${
                    isFinalActionClickable && !isApprovalComplete
                      ? styles.activeButton
                      : styles.disabledButton
                  }`}
                  onClick={() => openApprovalPage(loan)}
                >
                  Final Action
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LoanApproval;
