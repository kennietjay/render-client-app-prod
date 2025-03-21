import React, { useEffect, useState } from "react";
import styles from "../LoanPayment.module.css";
import {
  handleDateInput,
  // convertToDBFormat,
} from "/utils/dateUtils.js";
import { Alert } from "react-bootstrap";

//
const convertToDBFormat = (date) => {
  if (!date) return null; // ✅ Prevent sending empty date

  const parts = date.split("-");
  if (parts.length !== 3) return null; // ✅ Ensure correct format

  const [day, month, year] = parts;
  if (!day || !month || !year) return null;

  // ✅ Ensure valid numeric values
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  // ✅ Convert to MySQL format: YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

function SignConsent({
  prevStep,
  nextStep,
  closeModal,
  formData,
  handleFormData,
  inputError,
}) {
  const [consentData, setConsentData] = useState(formData);
  const [error, setError] = useState(null); // ✅ FIXED: Initialize as null

  // Update consentData whenever formData changes
  useEffect(() => {
    setConsentData(formData);
  }, [formData]);

  useEffect(() => {
    setConsentData((prev) => ({
      ...prev,
      submission_date: getTodayDate(),
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    if (name === "submission_date") {
      // ✅ Allow user to type freely without immediate validation
      setConsentData((prev) => ({ ...prev, [name]: value }));
    } else if (type === "checkbox") {
      setConsentData((prevData) => ({
        ...prevData,
        [name]: e.target.checked ? value : "",
      }));
    } else {
      setConsentData({ ...consentData, [name]: value });
    }
  };

  // ✅ Validate date when the user leaves the field
  const handleDateBlur = (e) => {
    handleDateInput(e, setError, setConsentData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Convert date to correct format
    // ✅ Convert and validate date before submission
    const formattedSubmissionDate = convertToDBFormat(
      consentData.submission_date
    );

    // ✅ Validate that the date conversion worked
    if (
      !formattedSubmissionDate ||
      formattedSubmissionDate === "Invalid date"
    ) {
      setError("Please enter a valid date in the format DD-MM-YYYY.");
      return;
    }

    // ✅ Pass the correctly formatted date to the next step
    handleFormData({
      consent: { ...consentData, submission_date: formattedSubmissionDate },
    });

    nextStep();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button onClick={closeModal} className={styles.closeBtn}>
          X
        </button>
        <h4>Acknowledgement and Consent</h4>

        {inputError && (
          <Alert value="warning" className="warning" dismissible>
            {inputError}
          </Alert>
        )}

        {error && (
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className={styles.consentInput}>
          <label>
            <input
              type="checkbox"
              name="consent"
              value="consent signed"
              checked={consentData.consent === "consent signed"}
              onChange={(e) =>
                setConsentData((prev) => ({
                  ...prev,
                  consent: e.target.checked ? "consent signed" : "",
                }))
              }
            />
            <span>
              I declare that all the information I have provided are true and
              correct to the best of my knowledge at the time of submission of
              this application. Upon approval of this application, I accept to
              pay a two percent (2%) of the approved amount as a processing fee.
              I acknowledge that this amount is deducted at the time of
              receiving the loan, and I bear full responsibility for the
              repayment of the approved capital plus accrued interest over time.
              I authorize further processing of the application by entering my
              full name, initials, and the date of submission.
            </span>
          </label>
        </div>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Applicant&apos;s Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={consentData.full_name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputControl}>
            <label>Initial (Signature):</label>
            <input
              type="text"
              id="applicant_initial"
              name="applicant_initial"
              value={consentData.applicant_initial}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Today&apos;s Date:</label>
            <input
              type="text"
              id="submission_date"
              name="submission_date"
              placeholder="dd-mm-yyyy"
              value={consentData.submission_date}
              onChange={handleInputChange}
              onBlur={handleDateBlur}
            />
          </div>
        </div>

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
    </div>
  );
}

export default SignConsent;
