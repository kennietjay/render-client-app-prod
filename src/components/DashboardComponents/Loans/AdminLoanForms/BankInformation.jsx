import React, { useState } from "react";
// import styles from "./LoanApplication.module.css";
import styles from "../LoanPayment.module.css";
import LoadingSpinner from "../../../LoadingSpinner";

function BankInformation({
  nextStep,
  closeModal,
  prevStep,
  handleFormData,
  formData,
}) {
  const [bankData, setBankData] = useState(formData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankData({ ...bankData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    handleFormData({ bank: bankData });
    setLoading(false);
    nextStep();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <button onClick={closeModal} className={styles.closeBtn}>
              X
            </button>
            <h4>Bank and Account Information</h4>
            <div className={styles.sectionMargin}>
              <div className={styles.inputLayout}>
                <div className={styles.inputControl}>
                  <label>Bank Name:</label>
                  <input
                    type="text"
                    id="bank_name"
                    name="bank_name"
                    value={bankData.bank_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.inputLayout}>
                <div className={styles.inputControl}>
                  <label>Account Number:</label>
                  <input
                    type="text"
                    id="account_number"
                    name="account_number"
                    value={bankData.account_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.inputControl}>
                  <label>Account Name:</label>
                  <input
                    type="text"
                    id="account_name"
                    name="account_name"
                    value={bankData.account_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.sectionMargin}>
              <h4>Bank Address</h4>
              <div className={`${styles.inputLayout}`}>
                <div className={styles.inputControl}>
                  <label>Bank Address:</label>
                  <input
                    type="text"
                    id="bank_address"
                    name="bank_address"
                    value={bankData.bank_address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.contactDetails}>
                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>City/Town:</label>
                    <input
                      type="text"
                      id="bank_city"
                      name="bank_city"
                      value={bankData.bank_city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Chiefdom:</label>
                    <input
                      type="text"
                      id="bank_chiefdom"
                      name="bank_chiefdom"
                      value={bankData.bank_chiefdom}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>District:</label>
                    <input
                      type="text"
                      id="bank_district"
                      name="bank_district"
                      value={bankData.bank_district}
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
      )}
    </>
  );
}

export default BankInformation;
