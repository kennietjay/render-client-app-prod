import React, { useState } from "react";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";

function LoanRequirement({ nextStep, formData, closeModal }) {
  //   const [requirementData, setRequirementData] = useState(formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button onClick={closeModal} className={styles.closeBtn}>
          X
        </button>
        <h4>Loan Requirements/Checklist</h4>
        <div>
          <p>
            We are pleased to partner with individuals and institutions that
            fulfill the minimum requirements set by Easy Life Microfinance SL
            Ltd. To ensure a smooth and efficient loan transaction process, we
            require all prospective clients to provide the required legal
            documentation for themselves and the institutions they are
            associated with. The documentation is essential for verifying
            eligibility and establishing a clear understanding of the terms and
            conditions associated with our loan offerings.
          </p>
          <p>
            The following documents are required before submitting a loan
            application:
          </p>
          <div className={styles.requirement}>
            <ul>
              <li>
                Recommendation letter from head of institution(school, office,
                place of work, senior citizen, etc.) of client.
              </li>
              <li>
                Proof of employment: acceptance letter. Probation letter not
                accepted
              </li>
              <li>
                Evidence from bank, such as: Current and valid bank acount
                number or current and valid identity card or pin code.
              </li>
              <li>Printed bank statement.</li>
              <li>Two(2) recent passport pictures.</li>
              <li>
                Two(2) valid proof of identity such as: National ID card, Voter
                ID card, Motor Drivers' License, NASSIT ID card, Bank identity
                card.
              </li>
              <li>Must be at least 20 years old.</li>
              <li>Must be physically fit and mentally stable.</li>
              <li>Legal contact home, employment, and or business address.</li>
              <li>
                Valid and legal registered and working contact mobile phone
                number.
              </li>
              <li>Two(2) recent passport pictures of your guarantor.</li>
              <li>
                Must be resident in Sierra Leone/province for at least one-year.
              </li>
              <li>
                Original and certifity copy of the following
                <ul>
                  <li>
                    Land document includinng aggrement, survey plans, house
                    plan, coveyance.
                  </li>
                  <li>Business License</li>
                  <li>Life card of road worthy</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.addNavBtnContainer}>
          <button type="submit" className={styles.formNavBtn}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanRequirement;
