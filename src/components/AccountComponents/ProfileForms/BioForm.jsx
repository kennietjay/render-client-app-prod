import React from "react";
import styles from "../ProfileStyles/ProfileHome.module.css"; // CSS module
import { formatDates } from "../../../../utils/formatDateOfBirth";

function BioForm({
  handleChange,
  handleSubmit,
  handleModeChange,
  bioFormData,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={bioFormData.last_name || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="first_name">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={bioFormData.first_name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="middle_name">Middle Name:</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={bioFormData.middle_name || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={`${styles.contactInput} `}>
            <div className={`${styles.inputControl}`}>
              <label>Date of Birth:</label>
              <input
                type="text"
                id="date_of_birth"
                name="date_of_birth"
                value={formatDates(bioFormData.date_of_birth || "")}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="gender">Gender:</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={bioFormData.gender || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.contactInput}>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={bioFormData.email || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.contactInput}>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={bioFormData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label htmlFor="other_phone">Second Phone:</label>
              <input
                type="text"
                id="other_phone"
                name="other_phone"
                value={bioFormData.other_phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitBtns}>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => handleModeChange("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BioForm;
