import React, { useEffect, useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";
import { handleDateInput } from "../../../../utils/dateUtils";

//
const convertToDBFormat = (date) => {
  if (!date) return null; // ✅ Ensure we return null instead of "Invalid date"

  const parts = date.split("-");
  if (parts.length !== 3) return null; // ✅ Prevent sending invalid data

  const [day, month, year] = parts;
  if (!day || !month || !year) return null;

  // ✅ Ensure correct format: YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

function SignConsent({
  prevStep,
  nextStep,
  closeModal,
  formData,
  handleFormData,
}) {
  const [consentData, setConsentData] = useState(formData);
  const [error, setError] = useState(null);

  // Update consentData whenever formData changes
  useEffect(() => {
    setConsentData(formData);
  }, [formData]);

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
        <h4>Acknoledgement and Consent</h4>
        <div className={styles.consentInput}>
          <input
            type="checkbox"
            name="consent"
            value="consent signed" // Correct value
            checked={consentData.consent === "consent signed"} // Ensure correct tracking
            onChange={(e) =>
              setConsentData((prev) => ({
                ...prev,
                consent: e.target.checked ? "consent signed" : "",
              }))
            } // Handle change properly
          />
          <label>
            <p>
              I declare that all the information provided about/by me are true
              and correct at the time of submission of my application.
            </p>
            <p>
              Upon approval of this application, i accept to percent(2%) of the
              approved amount as a processing fee of my loan application.
            </p>
          </label>
        </div>
        <div>
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
              <label>Initial(signature):</label>
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
                onChange={handleInputChange} // ✅ Allow typing
                onBlur={handleDateBlur} // ✅ Validate on blur
              />
            </div>
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
