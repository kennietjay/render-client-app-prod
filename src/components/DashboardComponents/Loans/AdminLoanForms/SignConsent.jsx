import React, { useEffect, useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../LoanPayment.module.css";

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
          <label>
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

            <span>
              I declare that all the information I have provided are true and
              correct to best of my knowledge and at the time of submission of
              this application. Upon approval of this application, I accept to
              pay a two percent(2%) of the approved amount as a processing fee
              of this loan application. I further aknowledge that the amount is
              deducted at the time of receiving the loan. And I bear full
              responsible for the repayment of the capital approved plus the
              interest it will acrue over time. I authorize further processes of
              the application by entering my full name, initials and the date of
              submission.
            </span>
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
                placeholder="mm/dd/yyyy"
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
