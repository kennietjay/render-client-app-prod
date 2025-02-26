import React from "react";
import styles from "../../AccountComponents/ProfileStyles/ProfileHome.module.css"; // CSS module
import { handleDateInput } from "../../../../utils/dateUtils";

function BioForm({
  handleChange,
  handleSubmit,
  handleModeChange,
  bioFormData,
  setBioFormData,
  loading,
  setError,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={`${styles.inputControl}`}>
              <label>Last Name:</label>
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
              <label>First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={bioFormData.first_name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label>Middle Name:</label>
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
                value={bioFormData?.date_of_birth || ""}
                onChange={handleChange}
                onBlur={(e) => handleDateInput(e, setError, setBioFormData)}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label>Gender:</label>
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
              <label>Email:</label>
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
              <label>Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={bioFormData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.inputControl}`}>
              <label>Second Phone:</label>
              <input
                type="text"
                id="second_phone"
                name="second_phone"
                value={bioFormData.second_phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitBtns}>
          <button type="submit">{loading ? "Processing" : "Save"}</button>
          <button type="button" onClick={() => handleModeChange("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BioForm;
