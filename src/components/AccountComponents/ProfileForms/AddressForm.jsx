import React from "react";
import styles from "../ProfileStyles/ProfileHome.module.css"; // CSS module

function AddressForm({
  contact,
  handleSubmit,
  contactFormData,
  handleChange,
  handleModeChange,
  mode,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>{contact ? "Edit" : "Add"} Contact Address</h4>
        <div className={styles.inputControl}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={contactFormData.address || ""}
            onChange={handleChange}
          />
        </div>
        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="city">City/Town:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={contactFormData.city || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="section">Section:</label>
              <input
                type="text"
                id="section"
                name="section"
                value={contactFormData.section || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="chiefdom">Chiefdom:</label>
              <input
                type="text"
                id="chiefdom"
                name="chiefdom"
                value={contactFormData.chiefdom || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="district">District:</label>
              <input
                type="text"
                id="district"
                name="district"
                value={contactFormData.district || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitBtns}>
          <button type="submit">
            {mode === "edit" ? "Save Changes" : "Add Contact"}
          </button>
          <button type="button" onClick={() => handleModeChange("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
