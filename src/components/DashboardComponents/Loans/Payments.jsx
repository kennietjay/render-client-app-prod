import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LoanPayment.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import formatDateAndTime from "/utils/formatDateAndTime";
import debounce from "lodash.debounce";
import { useLoan } from "../../../context/LoanContext";
import { useTransaction } from "../../../context/TransactionContext";
import { useStaff } from "../../../context/StaffContext";
import { Alert } from "react-bootstrap";

//Calculate total outstanding
function calculateOutstandingBalance(loan, payments = []) {
  if (!loan || !loan?.loan_id) return 0;
  // Filter payments for this loan ID only
  const loanPayments = payments.filter(
    (payment) => payment?.loan_id === loan.loan_id
  );
  // Calculate total paid for this loan
  const totalPaid = loanPayments.reduce(
    (sum, payment) => sum + parseFloat(payment?.amount || 0),
    0
  );
  // Calculate the outstanding balance
  const outstandingBalance = parseFloat(loan?.total_amount || 0) - totalPaid;

  return Math.max(outstandingBalance, 0).toFixed(2);
}

//Calculate total amount paid
const calculateTotalAmountPaid = (payments, loanId) => {
  if (!loanId || !Array.isArray(payments)) return 0;

  return payments
    .filter((payment) => payment?.loan_id === loanId) // ✅ Filter payments by loan ID
    .reduce((total, payment) => total + parseFloat(payment?.amount || 0), 0); // ✅ Sum amounts
};

//
function LoanPayments() {
  const { getLoanById, recordPayment } = useLoan();
  const { getPayments, payments } = useTransaction();
  const { getStaffProfile } = useStaff();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);
  const [paymentData, setPaymentData] = useState({
    loan_id: "",
    amount: "",
    payment_method: "",
    transaction_id: generateTransactionId(),
    remarks: "",
    staff_id: "", // Set staff ID from the current user
  });
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [searchError, setSearchError] = useState("");
  const { formattedDate: approvalDate } = formatDateAndTime(
    loanDetails?.approval_date
  );
  const debouncedFetchLoanDetails = useRef();

  // Automatically dismiss alerts after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
    }
  }, [success, error]);

  // Generate a 12-digit transaction ID
  function generateTransactionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000); // 8 random digits
    return `${year}${month}${randomDigits}`;
  }

  // Fetch loan details on search
  const fetchLoanDetails = useCallback(
    async (loanId) => {
      if (!loanId) return null;

      setLoading(true);

      try {
        const staffProfile = await getStaffProfile();
        const details = await getLoanById(loanId);

        if (staffProfile?.id) {
          setPaymentData((prevData) => ({
            ...prevData,
            staff_id: staffProfile?.id,
          }));
        } else {
          console.error("Failed to fetch staff profile:", staffProfile);
        }

        if (details && details.loan_id) {
          setLoanDetails(details);
          setPaymentData((prevData) => ({
            ...prevData,
            loan_id: loanId,
          }));
          setError(null);
          setSearchError("");
          return details; // 🔴 Make sure to return the details
        } else {
          setLoanDetails(null);
          setError("Loan not found for the entered ID.");
          return null;
        }
      } catch (error) {
        setSearchError("Loan ID not found. Please try again.");
        setLoanDetails(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getLoanById, getStaffProfile]
  );

  // Debounced function for fetching loan details
  useEffect(() => {
    debouncedFetchLoanDetails.current = debounce(fetchLoanDetails, 1500); // 1.5 seconds delay
    return () => debouncedFetchLoanDetails.current.cancel();
  }, [fetchLoanDetails]);

  // Re-fetch loan details and payments when fetchTrigger changes
  useEffect(() => {
    if (paymentData?.loan_id) {
      getPayments(paymentData?.loan_id);
    }
  }, [fetchTrigger, getPayments, paymentData?.loan_id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Trigger debounced search for loan_id field
    if (name === "loan_id") {
      debouncedFetchLoanDetails.current(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentData?.amount || !paymentData?.payment_method) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (
      (loanDetails?.status === "applied" ||
        loanDetails?.status === "processing") &&
      !loanDetails?.approval_date
    ) {
      setError("Loan has not been approved or processed.");
      return;
    }

    if (loanDetails?.status === "processed" && !loanDetails?.approval_date) {
      setError("Loan is not approved.");
      return;
    }

    if (loanDetails?.status === "paid" && loanDetails.balance_after === 0) {
      setError("No further payment to process, this loan is fully paid.");
      return;
    }

    if (["canceled", "closed", "rejected"].includes(loanDetails?.status)) {
      setError(`Cannot process payment, this loan is ${loanDetails?.status}.`);
      return;
    }

    setLoading(true);

    const newPayment = {
      ...paymentData,
      customer_id: loanDetails?.customer_id,
    };

    try {
      const response = await recordPayment(newPayment, paymentData?.loan_id);

      // ✅ Log response for debugging
      console.log("Payment API Response:", response);

      // ✅ Fix: Check for `msg` field instead
      if (response?.msg?.toLowerCase().includes("success")) {
        setSuccess(response.msg || "Payment recorded successfully!");

        // ✅ Re-fetch loan details after successful payment
        await getPayments();

        // ✅ Reset Form Fields
        setPaymentData({
          loan_id: paymentData?.loan_id,
          amount: "",
          payment_method: "",
          transaction_id: generateTransactionId(),
          remarks: "",
          staff_id: paymentData?.staff_id,
        });

        // ✅ Trigger Data Refresh
        setFetchTrigger((prev) => !prev);
      } else {
        setError(response?.msg || "Failed to process payment.");
      }
    } catch (error) {
      setError(error?.message || "An error occurred while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!paymentData?.amount || !paymentData?.payment_method) {
  //     alert("Please fill in all the required fields.");
  //     return;
  //   }

  //   if (
  //     (loanDetails?.status === "applied" ||
  //       loanDetails?.status === "processing") &&
  //     !loanDetails?.approval_date
  //   ) {
  //     setError("Loan has not been approved or processed.");
  //     return;
  //   }

  //   if (loanDetails?.status === "processed" && !loanDetails?.approval_date) {
  //     setError("Loan is not approved.");
  //     return;
  //   }

  //   if (loanDetails?.status === "paid" && loanDetails.balance_after === 0) {
  //     setError("No further payment to process, this loan is fully paid.");
  //     return;
  //   }

  //   if (["canceled", "closed", "rejected"].includes(loanDetails?.status)) {
  //     setError(`Cannot process payment, this loan is ${loanDetails?.status}.`);
  //     return;
  //   }

  //   setLoading(true);

  //   const newPayment = {
  //     ...paymentData,
  //     customer_id: loanDetails?.customer_id,
  //   };

  //   try {
  //     const response = await recordPayment(newPayment, paymentData?.loan_id);

  //     // ✅ Fix: Check if response contains an actual success flag
  //     if (response?.success) {
  //       setSuccess("Payment recorded successfully!");

  //       // ✅ Re-fetch loan details after successful payment
  //       await getPayments();

  //       // ✅ Reset Form Fields
  //       setPaymentData({
  //         loan_id: paymentData?.loan_id,
  //         amount: "",
  //         payment_method: "",
  //         transaction_id: generateTransactionId(),
  //         remarks: "",
  //         staff_id: paymentData?.staff_id,
  //       });

  //       // ✅ Trigger Data Refresh
  //       setFetchTrigger((prev) => !prev);
  //     } else {
  //       setError(response?.message || "Failed to process payment.");
  //     }

  //     //
  //   } catch (error) {
  //     setError(error?.message || "An error occurred while processing payment.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Calculate outstanding balance
  const outstandingBalance = calculateOutstandingBalance(loanDetails, payments);

  //Total amount paid
  const totalAmountPaid = calculateTotalAmountPaid(
    payments,
    loanDetails?.loan_id
  );

  // Get payments only for the selected loan ID
  const filteredPayments = payments?.filter(
    (payment) =>
      String(payment?.loan_id).trim() === String(loanDetails?.loan_id).trim()
  );

  // Get the latest payment based on the highest payment ID
  const latestPayment =
    filteredPayments?.sort((a, b) => Number(b.id) - Number(a.id))[0] || null; // ✅ Sort by highest numeric ID

  // console.log("Filtered Payments:", filteredPayments);
  // console.log("Latest Payment by Payment ID:", latestPayment);

  //
  return (
    <>
      {!loanDetails && loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.loanPaymentContainer}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h4 className={styles.title}>Loan Payment Form</h4>

              {/* {success && <Alert variant="success">{success}</Alert>} */}

              {success && (
                <Alert variant="success" className="warning">
                  {success}
                </Alert>
              )}

              {error && (
                <Alert variant="warning" className="warning">
                  {error}
                </Alert>
              )}

              {/* Loan ID Input with Search */}
              <div className={styles.inputControl}>
                <label htmlFor="loan_id">Loan ID:</label>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    id="loan_id"
                    name="loan_id"
                    placeholder="Enter Loan ID"
                    value={paymentData.loan_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {searchError && (
                  <p className={styles.errorText}>{searchError}</p>
                )}
              </div>

              {/* Display Loan Details */}
              {loanDetails && (
                <div className={styles.loanDetails}>
                  <p>
                    <strong>Customer ID:</strong> {loanDetails?.customer_id}
                  </p>
                  <p>
                    <strong>Loan ID:</strong> {loanDetails?.loan_id}
                  </p>
                  <p>
                    <strong>Loan Amount:</strong> NLe{" "}
                    {loanDetails?.total_amount}
                  </p>
                  <p>
                    <strong>Outstanding Balance:</strong> NLe{" "}
                    {outstandingBalance}
                  </p>
                  <p>
                    <strong>Last Payment:</strong> NLe{" "}
                    {latestPayment?.amount ? latestPayment.amount : 0}
                  </p>
                  <p>
                    <strong>Approval Date:</strong>{" "}
                    {approvalDate ? approvalDate : "N/A"}
                  </p>

                  <p>
                    <strong>Total To-Date:</strong> NLe
                    {totalAmountPaid}
                  </p>
                </div>
              )}

              {/* Payment Details */}
              <div className={styles.inputControl}>
                <label htmlFor="amount">Payment Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter payment amount"
                  value={paymentData?.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputControl}>
                <label htmlFor="payment_method">Payment Method:</label>
                <input
                  type="text"
                  id="payment_method"
                  name="payment_method"
                  placeholder="e.g., Cash, Bank Transfer"
                  value={paymentData.payment_method}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputControl}>
                <label htmlFor="remarks">Remarks:</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Optional remarks"
                  value={paymentData.remarks}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LoanPayments;

//
//
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import styles from "./LoanPayment.module.css";
// import LoadingSpinner from "../../LoadingSpinner";
// import formatDateAndTime from "/utils/formatDateAndTime";

// import debounce from "lodash.debounce";

// import { useLoan } from "../../../context/LoanContext";
// import { useTransaction } from "../../../context/TransactionContext";
// import { useStaff } from "../../../context/StaffContext";
// import { Alert } from "react-bootstrap";

// function LoanPayments() {
//   const { getLoanById, recordPayment, loan } = useLoan();
//   const { getPayments, payments } = useTransaction();

//   const { getStaffProfile } = useStaff();
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [paymentData, setPaymentData] = useState({
//     loan_id: "",
//     amount: "",
//     payment_method: "",
//     transaction_id: generateTransactionId(),
//     remarks: "",
//     staff_id: "", // Set staff ID from the current user
//   });
//   const [fetchTrigger, setFetchTrigger] = useState(false);
//   const [searchError, setSearchError] = useState("");
//   const { formattedDate: approvalDate } = formatDateAndTime(
//     loanDetails?.approval_date
//   );
//   const debouncedFetchLoanDetails = useRef();

//   // Automatically dismiss alerts after 30 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//         setError(null);
//       }, 5000); // 30 seconds
//       return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
//     }
//   }, [success, error]);
//   //

//   // useEffect(() => {
//   //   // Fetch the staff ID associated with the logged-in user
//   //   const fetchStaffId = async () => {
//   //     setLoading(true);

//   //     const staffProfile = await getStaffProfile();
//   //     await getPayments();

//   //     // if (currentUser?.id) {
//   //     try {
//   //       if (staffProfile?.id) {
//   //         setPaymentData((prevData) => ({
//   //           ...prevData,
//   //           staff_id: staffProfile.id,
//   //         }));
//   //       } else {
//   //         console.error("Failed to fetch staff profile:", staffProfile);
//   //       }
//   //     } catch (error) {
//   //       setError(error);
//   //       console.error("Error fetching staff ID:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //     // }
//   //   };

//   //   fetchStaffId();
//   // }, [getStaffProfile, getPayments]);

//   // Generate a 12-digit transaction ID
//   function generateTransactionId() {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
//     const randomDigits = Math.floor(100000000 + Math.random() * 900000000); // 8 random digits
//     return `${year}${month}${randomDigits}`;
//   }

//   // Fetch loan details on search
//   const fetchLoanDetails = useCallback(
//     async (loanId) => {
//       if (!loanId) return;

//       setLoading(true);

//       try {
//         const staffProfile = await getStaffProfile();
//         const details = await getLoanById(loanId);

//         //
//         try {
//           if (staffProfile?.id) {
//             setPaymentData((prevData) => ({
//               ...prevData,
//               staff_id: staffProfile?.id,
//             }));
//           } else {
//             console.error("Failed to fetch staff profile:", staffProfile);
//           }
//         } catch (error) {
//           setError(error);
//           console.error("Error fetching staff ID:", error);
//         } finally {
//           setLoading(false);
//         }

//         //
//         if (details && details.loan_id) {
//           setLoanDetails(details);
//           setPaymentData((prevData) => ({
//             ...prevData,
//             loan_id: loanId,
//           }));
//           setError(null); // Clear previous errors
//           setSearchError(""); // Clear search errors
//         } else {
//           setLoanDetails(null);
//           setError("Loan not found that match the ID entered");
//         }

//         console.log(details);
//       } catch (error) {
//         setSearchError("Loan ID not found. Please try again.", error);
//         setLoanDetails(null);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [getLoanById, getStaffProfile]
//   );

//   // Debounced function for fetching loan details
//   useEffect(() => {
//     debouncedFetchLoanDetails.current = debounce(fetchLoanDetails, 1500); // 500ms delay
//     return () => debouncedFetchLoanDetails.current.cancel();
//   }, [fetchLoanDetails]);

//   //
//   const handleLoanSearch = async () => {
//     setSearchError("");

//     if (!paymentData?.loan_id) {
//       setSearchError("Please enter a Loan ID.");
//       setError("Please enter a Loan ID.");
//       return;
//     }

//     await fetchLoanDetails(paymentData?.loan_id); // Fetch loan details
//   };

//   // Use effect to re-fetch loan details and payments when fetchTrigger changes
//   useEffect(() => {
//     if (paymentData.loan_id) {
//       getPayments();
//     }
//   }, [fetchTrigger, getPayments, fetchLoanDetails, paymentData?.loan_id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));

//     // Trigger debounced search for loan_id field
//     if (name === "loan_id") {
//       debouncedFetchLoanDetails.current(value);
//     }
//   };

//   //
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!paymentData?.amount || !paymentData?.payment_method) {
//       alert("Please fill in all the required fields.");
//       return;
//     }

//     if (
//       (loanDetails?.status !== "approved" &&
//         loanDetails?.status !== "paying") ||
//       !loanDetails?.approval_date
//     ) {
//       setError(
//         "Cannot process payment. Loan is not approved or needs attention."
//       );
//       return;
//     }

//     setLoading(true);
//     const newPayment = {
//       ...paymentData,
//       customer_id: loanDetails?.customer_id,
//     };

//     try {
//       const response = await recordPayment(newPayment, paymentData?.loan_id);

//       if (response?.ok) {
//         setSuccess(success.message);

//         // Re-fetch loan details and payments
//         const updatedLoanDetails = await fetchLoanDetails(paymentData?.loan_id);

//         // await getPayments();
//         // Trigger data refresh
//         setFetchTrigger((prev) => !prev);

//         if (updatedLoanDetails) {
//           setLoanDetails(updatedLoanDetails);
//         }

//         // Reset form fields
//         setPaymentData({
//           loan_id: paymentData?.loan_id,
//           amount: "",
//           payment_method: "",
//           transaction_id: generateTransactionId(),
//           remarks: "",
//           staff_id: paymentData?.staff_id,
//         });
//       } else {
//         setError(response?.message || "Failed to record payment.");
//       }
//     } catch (error) {
//       setError(error?.message || "An error occurred while processing payment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const outstandingBalance = calculateOutstandingBalance(loanDetails, payments);

//   return (
//     <>
//       {!loanDetails && loading ? (
//         <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
//       ) : (
//         <div className={styles.loanPaymentContainer}>
//           <div className={styles.formContainer}>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               <h4 className={styles.title}>Loan Payment Form</h4>

//               {success && (
//                 <Alert variant="success" className="warning">
//                   {success}
//                 </Alert>
//               )}
//               {error && (
//                 <Alert variant="warning" className="warning">
//                   {error}
//                 </Alert>
//               )}

//               {/* Loan ID Input with Search */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="loan_id">Loan ID:</label>
//                 <div className={styles.searchContainer}>
//                   <input
//                     type="text"
//                     id="loan_id"
//                     name="loan_id"
//                     placeholder="Enter Loan ID"
//                     value={paymentData.loan_id}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <button
//                     type="button"
//                     className={styles.searchButton}
//                     onClick={handleLoanSearch}
//                   >
//                     Search
//                   </button>
//                 </div>
//                 {searchError && (
//                   <p className={styles.errorText}>{searchError}</p>
//                 )}
//               </div>

//               {/* Display Loan Details */}
//               {loanDetails && (
//                 <div className={styles.loanDetails}>
//                   <p>
//                     <strong>Loan ID:</strong> {loanDetails?.loan_id}
//                   </p>
//                   <p>
//                     <strong>Loan Amount:</strong> NLe{loanDetails?.total_amount}
//                   </p>
//                   <p>
//                     <strong>Outstanding Balance:</strong> NLe
//                     {outstandingBalance}
//                   </p>
//                   <p>
//                     <strong>Approval Date:</strong>{" "}
//                     {approvalDate ? approvalDate : "N/A"}
//                   </p>
//                   <p>
//                     <strong>Customer ID:</strong> {loanDetails?.customer_id}
//                   </p>
//                 </div>
//               )}

//               {/* Payment Details */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="amount">Payment Amount:</label>
//                 <input
//                   type="number"
//                   id="amount"
//                   name="amount"
//                   placeholder="Enter payment amount"
//                   value={paymentData.amount}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className={styles.inputControl}>
//                 <label htmlFor="payment_method">Payment Method:</label>
//                 <input
//                   type="text"
//                   id="payment_method"
//                   name="payment_method"
//                   placeholder="e.g., Cash, Bank Transfer"
//                   value={paymentData.payment_method}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className={styles.inputControl}>
//                 <label htmlFor="remarks">Remarks:</label>
//                 <textarea
//                   id="remarks"
//                   name="remarks"
//                   placeholder="Optional remarks"
//                   value={paymentData.remarks}
//                   onChange={handleInputChange}
//                 ></textarea>
//               </div>

//               <div className={styles.buttonContainer}>
//                 <button
//                   type="submit"
//                   className={styles.submitButton}
//                   disabled={loading}
//                 >
//                   {loading ? "Processing..." : "Submit Payment"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default LoanPayments;

// //
// function calculateOutstandingBalance(loan, payments) {
//   if (!loan) return 0;

//   // Filter payments for the specific loan ID
//   const loanPayments = payments?.filter(
//     (payment) => payment?.loan_id === loan?.loan_id
//   );

//   // Calculate the total paid amount
//   const totalPaid = loanPayments?.reduce(
//     (sum, payment) => sum + parseFloat(payment?.amount || 0),
//     0
//   );

//   // Calculate the outstanding balance
//   const outstandingBalance = parseFloat(loan?.total_amount || 0) - totalPaid;

//   console.log(outstandingBalance);

//   // Ensure the balance cannot go below zero
//   return Math.max(outstandingBalance, 0);
// }
