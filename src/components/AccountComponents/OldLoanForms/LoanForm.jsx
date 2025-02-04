import React, { useEffect, useState } from "react";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";

// Function to format numbers with commas
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Function to remove commas and convert back to a number
const removeCommas = (value) => {
  return value.replace(/,/g, "");
};

function LoanForm({ nextStep, prevStep, handleFormData, formData }) {
  const [loanData, setLoanData] = useState(formData);
  const [hasCoDebtor, setHasCoDebtor] = useState(formData.co_debtor === "yes");
  const [inputError, setInputError] = useState("");

  // Calculate interest, total amount, and payment when loanData changes
  const interest =
    Number(loanData.loan_amount) * Number(loanData.interest_rate);

  const total_amount = Number(loanData.loan_amount) + Number(interest);

  const monthly_payment = Number(loanData.loan_period)
    ? Math.ceil(total_amount / Number(loanData.loan_period))
    : 0;

  useEffect(() => {
    // Update loanData to include derived fields
    setLoanData((prevData) => ({
      ...prevData,
      total_amount,
      monthly_payment,
    }));
  }, [
    loanData.loan_amount,
    monthly_payment,
    total_amount,
    loanData.interest_rate,
    loanData.loan_period,
  ]);

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      if (name === "loan_purpose") {
        // Checkbox handling for loan_purpose
        if (e.target.checked) {
          // If checked, add value to loan_purpose array
          setLoanData((prevData) => ({
            ...prevData,
            loan_purpose: Array.isArray(prevData.loan_purpose)
              ? [...prevData.loan_purpose, value]
              : [value], // If it's not an array, create a new array with the value
          }));
        } else {
          // If unchecked, remove value from loan_purpose array
          setLoanData((prevData) => ({
            ...prevData,
            loan_purpose: prevData.loan_purpose.filter(
              (item) => item !== value
            ),
          }));
        }
      }
    } else if (type === "radio") {
      // Handle radio inputs
      if (name === "co_debtor") {
        setHasCoDebtor(value === "yes");
      }
      setLoanData({ ...loanData, [name]: value });
    } else {
      // Handle other inputs, including formatted fields
      if (name === "loan_amount" || name === "monthly_salary") {
        const formattedValue = formatNumberWithCommas(removeCommas(value));
        setLoanData({ ...loanData, [name]: removeCommas(value) });
        e.target.value = formattedValue; // Display formatted value
      } else {
        setLoanData({ ...loanData, [name]: value });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert loan_purpose array to a string before submission
    const loanPurposeString = Array.isArray(loanData.loan_purpose)
      ? loanData.loan_purpose.join(", ")
      : "";

    const newLoanData = {
      ...loanData,
      loan_purpose: loanPurposeString,
      user_fid: formData?.user_fid,
      customer_id: formData?.isReturningCustomer
        ? formData?.customer.customer_id
        : null,
      co_debtor: hasCoDebtor ? "yes" : "no",
      co_debtor_name: hasCoDebtor ? loanData.co_debtor_name : null,
      co_debtor_relation: hasCoDebtor ? loanData.co_debtor_relation : null,
    };

    handleFormData({ loan: newLoanData });
    nextStep();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>Enter Loan Details</h4>
        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Loan Type:</label>
            <select
              name="loan_type"
              value={loanData.loan_type || ""}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Salary Loan">Salary Loan</option>
              <option value="Personal Loan">Micro/Personal Loan</option>
              <option value="Group Loan">Group Loan</option>
              <option value="Individual Loan">Individual Business Loan</option>
            </select>
          </div>
        </div>

        {/* Loan Amount and Amount in Words */}
        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Loan Amount:</label>
            <input
              type="text"
              name="loan_amount"
              value={formatNumberWithCommas(loanData.loan_amount) || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputControl}>
            <label>Amount In Words:</label>
            <input
              type="text"
              name="amount_in_words"
              value={loanData.amount_in_words || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Interest Rate and Loan Period */}
        <div className={`${styles.inputLayout}`}>
          <div className={styles.inputControl}>
            <label>Interest Rate:</label>
            <select
              name="interest_rate"
              value={loanData.interest_rate || ""}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="0.2">20%</option>
              <option value="0.25">25%</option>
              <option value="0.30">30%</option>
            </select>
          </div>
          <div className={styles.inputControl}>
            <label>Loan Period (months):</label>
            <input
              type="text"
              name="loan_period"
              value={loanData.loan_period || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Payment and Total Amount */}
        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Payment:</label>
            <input
              type="text"
              name="monthly_payment"
              value={formatNumberWithCommas(monthly_payment) || ""}
              readOnly
            />
          </div>
          <div className={styles.inputControl}>
            <label>Total Amount:</label>
            <input
              type="text"
              name="total_amount"
              value={formatNumberWithCommas(total_amount) || ""}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Monthly Salary:</label>
            <input
              type="text"
              id="monthly_salary"
              name="monthly_salary"
              value={formatNumberWithCommas(loanData.monthly_salary) || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label>Salary In Words:</label>
            <input
              type="text"
              id="salary_in_words"
              name="salary_in_words"
              value={loanData.salary_in_words || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Loan Purpose */}
        <div className={styles.inputLayout}>
          <div>
            <label>Loan Purpose</label>
            {[
              "Home Improvement",
              "Personal Expenses",
              "Education",
              "Medical Expenses",
              "Business Investment",
              "Vehicle Purchase",
              "Others",
            ].map((purpose) => (
              <div key={purpose}>
                <label>
                  <input
                    type="checkbox"
                    name="loan_purpose"
                    value={purpose}
                    checked={loanData.loan_purpose?.includes(purpose)}
                    onChange={handleInputChange}
                  />
                  {purpose}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Co-Debtor Information */}
        <div className={styles.sectionMargin}>
          <h4>Co-Debtor Information</h4>
          <div>
            <label>Do you have a co-debtor for this loan?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="co_debtor"
                  value="no"
                  checked={!hasCoDebtor}
                  onChange={handleInputChange}
                />
                No
              </label>
              <label>
                <input
                  type="radio"
                  name="co_debtor"
                  value="yes"
                  checked={hasCoDebtor}
                  onChange={handleInputChange}
                />
                Yes
              </label>
            </div>
          </div>

          {hasCoDebtor && ( // Conditionally render co-debtor fields
            <div className={`${styles.inputLayout}`}>
              <div className={styles.inputControl}>
                <label>Co-Debtor Name:</label>
                <input
                  type="text"
                  name="co_debtor_name"
                  value={loanData.co_debtor_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputControl}>
                <label>Relationship:</label>
                <input
                  type="text"
                  name="co_debtor_relation"
                  value={loanData.co_debtor_relation || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Loan History */}
        <div className={styles.sectionMargin}>
          <h4>Loan History</h4>
          <div>
            <label>Have you loaned before?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="prior_loan_history"
                  value="yes"
                  checked={loanData.prior_loan_history === "yes"}
                  onChange={handleInputChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="prior_loan_history"
                  value="no"
                  checked={loanData.prior_loan_history === "no"}
                  onChange={handleInputChange}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label>Have you ever loaned with Easy Life Microfinance?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="loaned_with_easylife"
                  value="yes"
                  checked={loanData.loaned_with_easylife === "yes"}
                  onChange={handleInputChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="loaned_with_easylife"
                  value="no"
                  checked={loanData.loaned_with_easylife === "no"}
                  onChange={handleInputChange}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label>
              Do you owe any arrears with another financial institution?
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="owe_arrears_elsewhere"
                  value="yes"
                  checked={loanData.owe_arrears_elsewhere === "yes"}
                  onChange={handleInputChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="owe_arrears_elsewhere"
                  value="no"
                  checked={loanData.owe_arrears_elsewhere === "no"}
                  onChange={handleInputChange}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.addNavBtnContainer}>
          <button
            type="button"
            className={styles.formNavBtn}
            onClick={prevStep}
          >
            Prev
          </button>
          <button type="submit" className={styles.formNavBtn}>
            Next
          </button>
        </div>
      </form>
      {inputError && <p className={styles.error}>{inputError}</p>}
    </div>
  );
}

export default LoanForm;
