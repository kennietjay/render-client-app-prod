import React, { useEffect, useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";

function SignConsent({
  prevStep,
  nextStep,
  closeModal,
  formData,
  handleFormData,
}) {
  const [consentData, setConsentData] = useState(formData);

  // Update consentData whenever formData changes
  useEffect(() => {
    setConsentData(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      // Checkbox handling for string value instead of array
      setConsentData((prevData) => ({
        ...prevData,
        [name]: e.target.checked ? value : "",
      }));
    } else if (type === "radio") {
      // Radio button handling for Yes/No
      setConsentData({ ...consentData, [name]: value });
    } else {
      // Other inputs
      setConsentData({ ...consentData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormData({ consent: consentData });
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
                type="date"
                id="submission_date"
                name="submission_date"
                value={consentData.submission_date}
                onChange={handleInputChange}
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
