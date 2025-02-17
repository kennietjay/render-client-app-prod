import React, { useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../LoanPayment.module.css";
import { Alert } from "react-bootstrap";

function EmployerForm({
  formData,
  nextStep,
  closeModal,
  prevStep,
  handleFormData,
}) {
  const [employerData, setEmployerData] = useState(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEmployerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormData({ employer: employerData });
    nextStep();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button onClick={closeModal} className={styles.closeBtn}>
          X
        </button>
        <h4>Employment Information</h4>

        <div className={styles.sectionMargin}>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Employing Authority:</label>
              <input
                type="text"
                id="employing_authority"
                name="employing_authority"
                value={employerData.employing_authority}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Employer Name/Institution:</label>
              <input
                type="text"
                id="employer_name"
                name="employer_name"
                value={employerData.employer_name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={`${styles.inputLayout}`}>
            <div className={styles.inputControl}>
              <label htmlFor="occupation">Occupation:</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={employerData.occupation}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="employee_code">Employee Code:</label>
              <input
                type="text"
                id="employee_code"
                name="employee_code"
                value={employerData.employee_code}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={`${styles.inputLayout}`}>
            <div className={styles.inputControl}>
              <label htmlFor="current_position">Current Position:</label>
              <input
                type="text"
                id="current_position"
                name="current_position"
                value={employerData.current_position}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label htmlFor="employer_phone">Phone:</label>
            <input
              type="text"
              id="employer_phone"
              name="employer_phone"
              value={employerData.employer_phone}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="employer_email">Email:</label>
            <input
              type="text"
              id="employer_email"
              name="employer_email"
              value={employerData.employer_email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.sectionMargin}>
          <h4>Employer Address</h4>
          <div className={`${styles.inputLayout}`}>
            <div className={styles.inputControl}>
              <label htmlFor="employer_address">Address:</label>
              <input
                type="text"
                id="employer_address"
                name="employer_address"
                value={employerData.employer_address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.contactDetails}>
            <div className={styles.inputLayout}>
              <div className={styles.inputControl}>
                <label htmlFor="employer_city">City/Town:</label>
                <input
                  type="text"
                  id="employer_city"
                  name="employer_city"
                  value={employerData.employer_city}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputControl}>
                <label htmlFor="employer_chiefdom">Chiefdom:</label>
                <input
                  type="text"
                  id="employer_chiefdom"
                  name="employer_chiefdom"
                  value={employerData.employer_chiefdom}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.inputLayout}>
              <div className={styles.inputControl}>
                <label htmlFor="employer_district">District:</label>
                <input
                  type="text"
                  id="employer_district"
                  name="employer_district"
                  value={employerData.employer_district}
                  onChange={handleInputChange}
                />
              </div>
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

export default EmployerForm;
