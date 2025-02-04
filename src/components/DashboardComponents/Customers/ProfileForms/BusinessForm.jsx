import React from "react";
import { Alert } from "react-bootstrap";
import styles from "../Customers.module.css";

function BusinessForm({
  handleSubmit,
  businessList,
  inputError,
  setShowAlert,
  businessFormData,
  handleBusinessChange,
  mode,
  setMode,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>{businessList ? "Edit" : "Add"} Contact Address</h4>

        {inputError && (
          <Alert
            variant="warning"
            className="warning"
            dismissible
            onClose={() => setShowAlert(false)}
          >
            {inputError}
          </Alert>
        )}
        <div className={styles.inputControl}>
          <label htmlFor="business_name">Business/Organization Name:</label>
          <input
            type="text"
            id="business_name"
            name="business_name"
            value={businessFormData.business_name}
            onChange={handleBusinessChange}
          />
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="ownership_type">
              Ownership Type (eg, Partnership):
            </label>
            <input
              type="text"
              id="ownership_type"
              name="ownership_type"
              value={businessFormData.ownership_type}
              onChange={handleBusinessChange}
            />
          </div>
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="business_type">Business Type:</label>
            <input
              type="text"
              id="business_type"
              name="business_type"
              value={businessFormData.business_type}
              onChange={handleBusinessChange}
            />
          </div>
          <div className={styles.inputControl}>
            <label>Capital</label>
            <input
              type="text"
              id="capital"
              name="capital"
              value={businessFormData.capital}
              onChange={handleBusinessChange}
            />
          </div>
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="business_phone">Phone:</label>
            <input
              type="text"
              id="business_phone"
              name="business_phone"
              value={businessFormData.business_phone}
              onChange={handleBusinessChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="business_email">Email:</label>
            <input
              type="text"
              id="business_email"
              name="business_email"
              value={businessFormData.business_email}
              onChange={handleBusinessChange}
            />
          </div>
        </div>

        <div className={styles.inputControl}>
          <label htmlFor="business_address">Address:</label>
          <input
            type="text"
            id="business_address"
            name="business_address"
            value={businessFormData.business_address}
            onChange={handleBusinessChange}
          />
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="business_city">City/Town:</label>
              <input
                type="text"
                id="business_city"
                name="business_city"
                value={businessFormData.business_city}
                onChange={handleBusinessChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="business_section">Section:</label>
              <input
                type="text"
                id="business_section"
                name="business_section"
                value={businessFormData.business_section}
                onChange={handleBusinessChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="business_chiefdom">Chiefdom:</label>
              <input
                type="text"
                id="business_chiefdom"
                name="business_chiefdom"
                value={businessFormData.business_chiefdom}
                onChange={handleBusinessChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="business_district">District:</label>
              <input
                type="text"
                id="business_district"
                name="business_district"
                value={businessFormData.business_district}
                onChange={handleBusinessChange}
              />
            </div>
          </div>
        </div>
        {/* Add other form fields similarly */}
        <div className={styles.submitBtns}>
          <button type="submit">
            {mode === "edit" ? "Save Changes" : "Add Business"}
          </button>
          <button type="button" onClick={() => setMode("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BusinessForm;
