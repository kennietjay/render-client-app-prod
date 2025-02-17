import React, { useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../LoanPayment.module.css";
import { Alert } from "react-bootstrap";

function GuarantorForm({
  nextStep,
  prevStep,
  closeModal,
  handleFormData,
  formData,
}) {
  const [guarantorData, setGuarantorData] = useState(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuarantorData({ ...guarantorData, [name]: value });
  };

  //
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormData({ guarantor: guarantorData });
    nextStep();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {" "}
        <button onClick={closeModal} className={styles.closeBtn}>
          X
        </button>
        <h4>Guarantor Information</h4>
        <div className={styles.sectionMargin}>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_last_name">Last Name:</label>
              <input
                type="text"
                id="guarantor_last_name"
                name="guarantor_last_name"
                value={guarantorData.guarantor_last_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_first_name">First Name:</label>
              <input
                type="text"
                id="guarantor_first_name"
                name="guarantor_first_name"
                value={guarantorData.guarantor_first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_middle_name">Middle Name:</label>
              <input
                type="text"
                id="guarantor_middle_name"
                name="guarantor_middle_name"
                value={guarantorData.guarantor_middle_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.sectionMargin}>
          <h4>Guarantor Relation and Contact</h4>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_gender">Gender:</label>
              <input
                type="text"
                id="guarantor_gender"
                name="guarantor_gender"
                value={guarantorData.guarantor_gender}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_relationship">Relationship:</label>
              <input
                type="text"
                id="guarantor_relationship"
                name="guarantor_relationship"
                value={guarantorData.guarantor_relationship}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_phone">Phone:</label>
              <input
                type="text"
                id="guarantor_phone"
                name="guarantor_phone"
                value={guarantorData.guarantor_phone}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="guarantor_email">Email:</label>
              <input
                type="text"
                id="guarantor_email"
                name="guarantor_email"
                value={guarantorData.guarantor_email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.sectionMargin}>
          <h4>Guarantor Address</h4>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_address">Address:</label>
              <input
                type="text"
                id="guarantor_address"
                name="guarantor_address"
                value={guarantorData.guarantor_address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_city">City/Town:</label>
              <input
                type="text"
                id="guarantor_city"
                name="guarantor_city"
                value={guarantorData.guarantor_city}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="guarantor_section">Section:</label>
              <input
                type="text"
                id="guarantor_section"
                name="guarantor_section"
                value={guarantorData.guarantor_section}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_chiefdom">Chiefdom:</label>
              <input
                type="text"
                id="guarantor_chiefdom"
                name="guarantor_chiefdom"
                value={guarantorData.guarantor_chiefdom}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_district">District:</label>
              <input
                type="text"
                id="guarantor_district"
                name="guarantor_district"
                value={guarantorData.guarantor_district}
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

export default GuarantorForm;
