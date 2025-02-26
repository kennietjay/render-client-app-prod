import React, { useRef, useState } from "react";
import styles from "./Reports.module.css";
import Modal from "../../Modal";
import { useTransaction } from "../../../context/TransactionContext";
import { Link } from "react-router-dom";
import Statements from "./Statements";

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  // Open the correct modal
  const openModal = (report) => setSelectedReport(report);

  // Close the modal
  const closeModal = () => setSelectedReport(null);

  return (
    <div className={styles.reportPage}>
      <h3>Reports</h3>
      <ul className={styles.reports}>
        <li>
          <Link onClick={() => openModal("statement")}>Payment Statements</Link>
        </li>
        {/* <li>
          <Link onClick={() => openModal("loan")}>Loan Summary</Link>
        </li> */}
        <li>
          <Link onClick={() => openModal("others")}>Others</Link>
        </li>
      </ul>

      {selectedReport && (
        <Modal isOpen={!!selectedReport} onClose={closeModal}>
          {selectedReport === "others" && <Others closeModal={closeModal} />}
          {/* {selectedReport === "loan" && <LoanSummary closeModal={closeModal} />} */}
          {selectedReport === "statement" && (
            <PaymentStatement closeModal={closeModal} />
          )}
        </Modal>
      )}
    </div>
  );
}

export default Reports;

//
function PaymentStatement({ closeModal }) {
  const { getPaymentsByLoanId } = useTransaction();
  const [loanId, setLoanId] = useState({ loan_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  //
  const printRef = useRef(); // Reference for the print area

  function printStatement() {
    const printContent = printRef.current.innerHTML;
    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    // Append the iframe to the body
    document.body.appendChild(iframe);

    // Write the print content to the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.write(printContent);
    iframeDoc.close();

    // Print the iframe content
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100); // Small delay to ensure printing is done
  }

  //
  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Typing: ${name} = ${value}`); // ✅ Debug log

    setLoanId((prevState) => ({
      ...prevState,
      [name]: value, // ✅ Ensure state updates properly
    }));
  };

  //
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    setPayments([]); // ✅ Clear previous results

    console.log("Fetching payments for Loan ID:", loanId); // ✅ Debug log

    if (!loanId) {
      setError("Please enter a valid Loan ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await getPaymentsByLoanId(loanId);

      console.log("✅ Received Payments:", response.data); // ✅ Debugging log

      if (!response || response.length === 0) {
        console.warn("⚠ No payments found for Loan ID:", loanId);
        setError("No payments found for this Loan ID.");
      } else {
        setPayments(response); // ✅ Set received data
      }
    } catch (error) {
      console.error("🚨 Error fetching payments:", error);
      setError(error.message || "Failed to fetch payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(payments);

  return (
    <div className={styles.reportBackground}>
      <h3>Payment Statement</h3>
      <button onClick={closeModal} className={styles.closeBtns}>
        x
      </button>
      <button className={styles.printBtn} onClick={printStatement}>
        Print
      </button>

      <div className={styles.searchLoan}>
        <input
          type="text"
          name="loan_id"
          value={loanId.loan_id || ""}
          onChange={handleInputChange}
          placeholder="Enter Loan ID"
        />
        <button onClick={fetchPayments} className={styles.searchButton}>
          Search
        </button>
      </div>

      {/* Wrap the statement inside the printRef */}
      <div ref={printRef}>
        <Statements />
      </div>
    </div>
  );
}

//  ✅ Modal Components
function Others({ closeModal }) {
  const { getPaymentsByLoanOrCustomerId } = useTransaction();
  const [loanId, setLoanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  // ✅ Handle input change
  const handleInputChange = (e) => {
    setLoanId(e.target.value);
  };

  const fetchPayments = async () => {
    if (!loanId.trim()) {
      setError("Please enter a Loan ID or Customer ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setPayments([]); // Clear previous results

    try {
      const response = await getPaymentsByLoanOrCustomerId(loanId);

      console.log("Received Payments:", response); // ✅ Debugging log

      // ✅ Ensure response has data
      if (!response || response?.length === 0) {
        setError("No payments found for this ID.");
      } else {
        setPayments(response); // ✅ Correct way to set data
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError(error.message || "Failed to fetch payments. Please try again.");
    }

    setLoading(false);
  };

  // const response = await getPaymentsByLoanOrCustomerId(loanId);
  return (
    <div className={styles.reportBackground}>
      <h3>Payment Statements</h3>

      {/* Search Input */}
      <div>
        <label>
          Enter Loan/Customer ID
          <input
            type="text"
            value={loanId}
            onChange={handleInputChange}
            placeholder="Enter Loan ID or Customer ID"
          />
        </label>
        <button onClick={fetchPayments} className={styles.searchButton}>
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Loading State */}
      {loading && <p>Loading payments...</p>}

      {/* Results Display */}
      {!loading && payments.length > 0 && (
        <div className={styles.paymentResults}>
          <h4>Payment Records</h4>
          <ul>
            {payments.map((payment) => (
              <li key={payment.id}>
                <strong>Loan ID:</strong> {payment.loan_id} |{" "}
                <strong>Customer ID:</strong> {payment.customer_id} |{" "}
                <strong>Amount:</strong> ${payment.amount} |{" "}
                <strong>Date:</strong> {payment.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Close Modal Button */}
      <button onClick={closeModal} className={styles.closeBtns}>
        x
      </button>
    </div>
  );
}

//
function LoanSummary({ closeModal }) {
  return (
    <div className={styles.reportBackground}>
      <h3>Loan Summary</h3>
      <button onClick={closeModal} className={styles.closeBtns}>
        x
      </button>
    </div>
  );
}
