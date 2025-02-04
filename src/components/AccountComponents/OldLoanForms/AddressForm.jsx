import React, { useEffect, useState } from "react";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";
import LoadingSpinner from "../../../components/LoadingSpinner";

function AddressForm({ formData, nextStep, prevStep, handleFormData }) {
  const [contactData, setContactData] = useState(formData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update hasCoDebtor based on the value of the co_debtor radio buttons
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    handleFormData({ address: contactData });

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
            <h4>Customer Address</h4>
            <div className={styles.sectionMargin}>
              <div className={styles.sectionMargin}>
                <div className={styles.inputControl}>
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={contactData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <label htmlFor="city">City/Town:</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={contactData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.inputControl}>
                      <label htmlFor="section">Section:</label>
                      <input
                        type="text"
                        id="section"
                        name="section"
                        value={contactData.section}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <label htmlFor="chiefdom">Chiefdom:</label>
                      <input
                        type="text"
                        id="chiefdom"
                        name="chiefdom"
                        value={contactData.chiefdom}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.inputControl}>
                      <label htmlFor="district">District:</label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={contactData.district}
                        onChange={handleInputChange}
                      />
                    </div>
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

export default AddressForm;
