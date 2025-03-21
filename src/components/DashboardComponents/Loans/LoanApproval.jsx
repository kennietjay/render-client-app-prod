import React, { useState, useEffect } from "react";
import { useLoan } from "../../../context/LoanContext";
import styles from "./LoanApproval.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import { Alert } from "react-bootstrap";

import { useAuth } from "../../../context/AuthContext";
import { useStaff } from "../../../context/StaffContext";

function LoanApproval({
  reviewedLoan,
  handleApproval,
  handleLoanReviews,
  setReviewSuccess,
  reviewSuccess,
  setReviewError,
  reviewError,
}) {
  const [loading, setLoading] = useState(false);
  const { firstReview, secondReview, getLoans } = useLoan();
  const { user } = useAuth();
  const { hasRole } = useStaff();
  const {
    customer_id,
    status = "applied",
    first_review = "",
    second_review = "",
  } = reviewedLoan || {};

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

  // Derived state for button disabling
  const [isFirstReviewComplete, setIsFirstReviewComplete] = useState(
    first_review === "complete"
  );
  const [isSecondReviewComplete, setIsSecondReviewComplete] = useState(
    second_review === "complete"
  );

  // Update derived state when `loan` prop changes
  useEffect(() => {
    setIsFirstReviewComplete(first_review === "complete");
    setIsSecondReviewComplete(second_review === "complete");
  }, [first_review, second_review]);

  const isFirstReviewClickable =
    (status === "applied" || status === "") &&
    (!first_review || first_review === "pending") &&
    !isFirstReviewComplete;

  const isSecondReviewClickable =
    first_review === "complete" &&
    (!second_review || second_review === "pending") &&
    !isSecondReviewComplete;

  const refreshLoan = async () => {
    try {
      await getLoans();
    } catch (error) {
      console.error("Error refreshing loan data:", error);
    }
  };

  const handleFirstReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await firstReview(reviewedLoan?.loan_id, customer_id, {
        ...firstReviewData,
        first_review: "complete",
        status: "processing",
      });

      if (response.success) {
        // alert("First review completed successfully.");
        setReviewSuccess("First review completed successfully.");
        setShowFirstReviewForm(false);
        setIsFirstReviewComplete(true); // Immediately update the button's disabled state
      } else {
        setReviewError(response.error?.data?.message);
      }

      // Update the parent state with the new loan data
      handleLoanReviews({
        ...reviewedLoan,
        first_review: "complete",
        status: "processing",
      });

      await refreshLoan(); // Refresh loan data
    } catch (error) {
      setReviewError("Error completing first review:", error);
      console.error("Error completing first review:", error);
      // alert("Failed to complete first review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecondReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await secondReview(reviewedLoan?.loan_id, customer_id, {
        ...secondReviewData,
        second_review: "complete",
        status: "processed",
      });

      if (response.success) {
        // alert("Second review completed successfully.");
        setReviewSuccess("Second review completed successfully.");

        //
        setShowSecondReviewForm(false);
        setIsSecondReviewComplete(true); // Immediately update the button's disabled state
      }

      // Update the parent state with the new loan data
      handleLoanReviews({
        ...reviewedLoan,
        first_review: "complete",
        status: "processing",
      });

      await refreshLoan(); // Refresh loan data
    } catch (error) {
      setReviewError("Error completing second review:");
      console.error("Error completing second review:", error);
      alert("Failed to complete second review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Processing..." />
      ) : (
        <>
          <div className={styles.approval}>
            {reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}
            {reviewError && <Alert variant="warning">{reviewError}</Alert>}

            <div className={styles.reviews}>
              {/* First Review */}
              <div className={styles.reviewItem}>
                <div>
                  <strong>First Review Status:</strong>{" "}
                  {first_review || "Pending"}
                </div>

                <>
                  {hasRole(user, [
                    "system admin",
                    "admin finance",
                    "manager",
                  ]) && (
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
                  )}

                  {/*  */}
                  {!hasRole(user, ["system admin"]) && (
                    <p>You do not have access to this section.</p>
                  )}
                </>

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

                <>
                  {hasRole(user, ["system admin", "manager"]) && (
                    <button
                      disabled={!isSecondReviewClickable}
                      className={`${styles.reviewButton} ${
                        isSecondReviewClickable
                          ? styles.activeButton
                          : styles.disabledButton
                      }`}
                      onClick={() => setShowSecondReviewForm(true)}
                    >
                      Second Review
                    </button>
                  )}

                  {/*  */}
                  {!hasRole(user, ["system admin"]) && (
                    <p>You do not have access to this section.</p>
                  )}
                </>
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
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LoanApproval;

// import React, { useState } from "react";
// import { useLoan } from "../../../context/LoanContext";
// import styles from "./LoanApproval.module.css";
// import LoadingSpinner from "../../LoadingSpinner";
// import { Alert } from "react-bootstrap";
// // import Approval from "./Approval";

// function LoanApproval({ loan, handleApproval }) {
//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(null);
//   const [error, setError] = useState(null);
//   const { firstReview, secondReview, getLoans } = useLoan();
//   const {
//     customer_id,
//     status = `"applied" || "" ? "applied":"applied"`,
//     first_review = "",
//     second_review = "",
//   } = loan || {};

//   const [showFirstReviewForm, setShowFirstReviewForm] = useState(false);
//   const [showSecondReviewForm, setShowSecondReviewForm] = useState(false);
//   const [firstReviewData, setFirstReviewData] = useState({
//     first_reviewer: "",
//     first_review_notes: "",
//   });

//   const [secondReviewData, setSecondReviewData] = useState({
//     second_reviewer: "",
//     second_review_notes: "",
//   });

//   const isFirstReviewClickable =
//     (status === "applied" || status === "") &&
//     (!first_review || first_review === "pending");

//   const isSecondReviewClickable =
//     first_review === "complete" &&
//     (!second_review || second_review === "pending");

//   //
//   const refreshLoan = async () => {
//     try {
//       await getLoans();
//     } catch (error) {
//       console.error("Error refreshing loan data:", error);
//     }
//   };

//   //
//   const handleFirstReviewSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await firstReview(loan?.loan_id, customer_id, {
//         ...firstReviewData,
//         first_review: "complete",
//         status: "processing", // Ensure this does not conflict with "processed"
//       });

//       if (response.success) {
//         alert("First review completed successfully.");
//         setSuccess("First review completed successfully.");
//         setShowFirstReviewForm(false);
//       }
//       setSuccess("First review completed successfully.");
//       setShowFirstReviewForm(false);

//       await refreshLoan(); // Ensure loan data is refreshed
//     } catch (error) {
//       setError("Error completing second review:");
//       console.error("Error completing first review:", error);
//       alert("Failed to complete first review. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSecondReviewSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await secondReview(loan?.loan_id, customer_id, {
//         ...secondReviewData,
//         second_review: "complete",
//         status: "processed", // Update the status to indicate it's processed
//       });

//       if (response.success) {
//         alert("Second review completed successfully.");
//       }
//       alert("Second review completed successfully.");
//       setSuccess("First review completed successfully.");
//       setShowSecondReviewForm(false);
//       await refreshLoan(); // Ensure loan data is refreshed
//     } catch (error) {
//       console.error("Error completing second review:", error);
//       setError("Error completing second review:");
//       alert("Failed to complete second review. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <LoadingSpinner size={60} color="#FF5722" message="Processing..." />
//       ) : (
//         <>
//           <div className={styles.approval}>
//             {/* {success && <Alert variant="success">{success}</Alert>} */}
//             {success && <Alert variant="success">{success}</Alert>}
//             {error && <Alert variant="warning">{error}</Alert>}

//             <div className={styles.reviews}>
//               {/* First Review */}
//               <div className={styles.reviewItem}>
//                 <div>
//                   <strong>First Review Status:</strong>{" "}
//                   {first_review || "Pending"}
//                 </div>
//                 <button
//                   disabled={!isFirstReviewClickable}
//                   className={`${styles.reviewButton} ${
//                     isFirstReviewClickable
//                       ? styles.activeButton
//                       : styles.disabledButton
//                   }`}
//                   onClick={() => setShowFirstReviewForm(true)}
//                 >
//                   First Review
//                 </button>
//                 {showFirstReviewForm && (
//                   <form
//                     onSubmit={handleFirstReviewSubmit}
//                     className={styles.form}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Reviewer Name"
//                       value={firstReviewData.first_reviewer}
//                       onChange={(e) =>
//                         setFirstReviewData((prev) => ({
//                           ...prev,
//                           first_reviewer: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                     <textarea
//                       placeholder="Review Notes"
//                       value={firstReviewData.first_review_notes}
//                       onChange={(e) =>
//                         setFirstReviewData((prev) => ({
//                           ...prev,
//                           first_review_notes: e.target.value,
//                         }))
//                       }
//                       required
//                       maxLength={50}
//                     />
//                     <button type="submit" disabled={loading}>
//                       {loading ? "Processing..." : "Submit First Review"}
//                     </button>
//                   </form>
//                 )}
//               </div>

//               {/* Second Review */}
//               <div className={styles.reviewItem}>
//                 <div>
//                   <strong>Second Review Status:</strong>{" "}
//                   {second_review || "Pending"}
//                 </div>
//                 <button
//                   disabled={!isSecondReviewClickable}
//                   className={`${styles.reviewButton} ${
//                     isSecondReviewClickable
//                       ? styles.activeButton
//                       : styles.disabledButton
//                   }`}
//                   onClick={() => setShowSecondReviewForm(true)}
//                 >
//                   Second Revie
//                 </button>
//                 {showSecondReviewForm && (
//                   <form
//                     onSubmit={handleSecondReviewSubmit}
//                     className={styles.form}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Reviewer Name"
//                       value={secondReviewData.second_reviewer}
//                       onChange={(e) =>
//                         setSecondReviewData((prev) => ({
//                           ...prev,
//                           second_reviewer: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                     <textarea
//                       placeholder="Review Notes"
//                       value={secondReviewData.second_review_notes}
//                       onChange={(e) =>
//                         setSecondReviewData((prev) => ({
//                           ...prev,
//                           second_review_notes: e.target.value,
//                         }))
//                       }
//                       required
//                       maxLength={50}
//                     />
//                     <button type="submit" disabled={loading}>
//                       {loading ? "Processing..." : "Submit Second Review"}
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export default LoanApproval;
