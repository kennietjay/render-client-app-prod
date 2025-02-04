import React from "react";
import styles from "../Customers.module.css"; // CSS module

function EmployerForm({
  handleSubmit,
  employer,
  employerFormData,
  handleEmployerChange,
  handleModeChange,
  mode,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>{employer ? "Edit" : "Add"} Employer information</h4>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Employing Authority:</label>
            <input
              type="text"
              id="employing_authority"
              name="employing_authority"
              value={employerFormData.employing_authority}
              onChange={handleEmployerChange}
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
              value={employerFormData.employer_name}
              onChange={handleEmployerChange}
            />
          </div>
        </div>

        <div className={`${styles.contactInput} ${styles.twoColumns}`}>
          <div className={styles.inputControl}>
            <label htmlFor="occupation">Occupation:</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={employerFormData.occupation}
              onChange={handleEmployerChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="employee_code">Employee Code:</label>
            <input
              type="text"
              id="employee_code"
              name="employee_code"
              value={employerFormData.employee_code}
              onChange={handleEmployerChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="current_position">Current Position:</label>
            <input
              type="text"
              id="current_position"
              name="current_position"
              value={employerFormData.current_position}
              onChange={handleEmployerChange}
            />
          </div>
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="employer_phone">Phone:</label>
            <input
              type="text"
              id="employer_phone"
              name="employer_phone"
              value={employerFormData.employer_phone}
              onChange={handleEmployerChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="employer_email">Email:</label>
            <input
              type="text"
              id="employer_email"
              name="employer_email"
              value={employerFormData.employer_email}
              onChange={handleEmployerChange}
            />
          </div>
        </div>

        <div className={styles.inputControl}>
          <label htmlFor="employer_address">Address:</label>
          <input
            type="text"
            id="employer_address"
            name="employer_address"
            value={employerFormData.employer_address}
            onChange={handleEmployerChange}
          />
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="employer_city">City/Town:</label>
              <input
                type="text"
                id="employer_city"
                name="employer_city"
                value={employerFormData.employer_city}
                onChange={handleEmployerChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="employer_chiefdom">Chiefdom:</label>
              <input
                type="text"
                id="employer_chiefdom"
                name="employer_chiefdom"
                value={employerFormData.employer_chiefdom}
                onChange={handleEmployerChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="employer_district">District:</label>
              <input
                type="text"
                id="employer_district"
                name="employer_district"
                value={employerFormData.employer_district}
                onChange={handleEmployerChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.submitBtns}>
          <button type="submit">
            {mode === "edit" ? "Save Changes" : "Add Employer"}
          </button>
          <button type="button" onClick={() => handleModeChange("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployerForm;
