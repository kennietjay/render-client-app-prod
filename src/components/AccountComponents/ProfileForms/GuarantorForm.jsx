import React from "react";
import styles from "../ProfileStyles/Guarantor.module.css";

function GuarantorForm({
  handleSubmit,
  guarantor,
  guarantorFormData,
  handleGuarantorChange,
  mode,
  setMode,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>{guarantor ? "Edit" : "Add"} Guarantor</h4>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="guarantor_last_name">Last Name:</label>
            <input
              type="text"
              id="guarantor_last_name"
              name="guarantor_last_name"
              value={guarantorFormData.guarantor_last_name}
              onChange={handleGuarantorChange}
            />
          </div>
        </div>
        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="guarantor_first_name">First Name:</label>
            <input
              type="text"
              id="guarantor_first_name"
              name="guarantor_first_name"
              value={guarantorFormData.guarantor_first_name}
              onChange={handleGuarantorChange}
            />
          </div>
          <div className={styles.inputControl}>
            <label htmlFor="guarantor_middle_name">Middle Name:</label>
            <input
              type="text"
              id="guarantor_middle_name"
              name="guarantor_middle_name"
              value={guarantorFormData.guarantor_middle_name}
              onChange={handleGuarantorChange}
            />
          </div>
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="guarantor_gender">Gender:</label>
            <input
              type="text"
              id="guarantor_gender"
              name="guarantor_gender"
              value={guarantorFormData.guarantor_gender}
              onChange={handleGuarantorChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="guarantor_relationship">Relationship:</label>
            <input
              type="text"
              id="guarantor_relationship"
              name="guarantor_relationship"
              value={guarantorFormData.guarantor_relationship}
              onChange={handleGuarantorChange}
            />
          </div>
        </div>

        <div className={styles.contactInput}>
          <div className={styles.inputControl}>
            <label htmlFor="guarantor_phone">Phone:</label>
            <input
              type="text"
              id="guarantor_phone"
              name="guarantor_phone"
              value={guarantorFormData.guarantor_phone}
              onChange={handleGuarantorChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label htmlFor="guarantor_email">Email:</label>
            <input
              type="text"
              id="guarantor_email"
              name="guarantor_email"
              value={guarantorFormData.guarantor_email}
              onChange={handleGuarantorChange}
            />
          </div>
        </div>

        <div className={styles.inputControl}>
          <label htmlFor="guarantor_address">Address:</label>
          <input
            type="text"
            id="guarantor_address"
            name="guarantor_address"
            value={guarantorFormData.guarantor_address}
            onChange={handleGuarantorChange}
          />
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_city">City/Town:</label>
              <input
                type="text"
                id="guarantor_city"
                name="guarantor_city"
                value={guarantorFormData.guarantor_city}
                onChange={handleGuarantorChange}
              />
            </div>

            <div className={styles.inputControl}>
              <label htmlFor="guarantor_section">Section:</label>
              <input
                type="text"
                id="guarantor_section"
                name="guarantor_section"
                value={guarantorFormData.guarantor_section}
                onChange={handleGuarantorChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_chiefdom">Chiefdom:</label>
              <input
                type="text"
                id="guarantor_chiefdom"
                name="guarantor_chiefdom"
                value={guarantorFormData.guarantor_chiefdom}
                onChange={handleGuarantorChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="guarantor_district">District:</label>
              <input
                type="text"
                id="guarantor_district"
                name="guarantor_district"
                value={guarantorFormData.guarantor_district}
                onChange={handleGuarantorChange}
              />
            </div>
          </div>
        </div>
        {/* Add other form fields similarly */}
        <div className={styles.submitBtns}>
          <button type="submit">
            {mode === "edit" ? "Save Changes" : "Add Guarantor"}
          </button>
          <button type="button" onClick={() => setMode("view")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default GuarantorForm;
