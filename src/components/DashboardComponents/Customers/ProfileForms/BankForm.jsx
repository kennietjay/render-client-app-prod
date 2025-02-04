import React from "react";
import styles from "../Customers.module.css"; // CSS module

function BankForm({
  handleSubmit,
  bank,
  bankFormData,
  handleBankChange,
  handleModeChange,
  mode,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>{bank ? "Edit" : "Add"} Bank information</h4>

        <div className={styles.inputLayout}>
          <div className={styles.inputControl}>
            <label>Bank Name:</label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              value={bankFormData.bank_name || ""}
              onChange={handleBankChange}
            />
          </div>
        </div>

        <div className={`${styles.contactInput} ${styles.twoColumns}`}>
          <div className={styles.inputControl}>
            <label>Account Name:</label>
            <input
              type="text"
              id="account_name"
              name="account_name"
              value={bankFormData.account_name || ""}
              onChange={handleBankChange}
            />
          </div>

          <div className={styles.inputControl}>
            <label>Account Number:</label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={bankFormData.account_number || ""}
              onChange={handleBankChange}
            />
          </div>
        </div>

        <div className={styles.inputControl}>
          <label>Address:</label>
          <input
            type="text"
            id="bank_address"
            name="bank_address"
            value={bankFormData.bank_address || ""}
            onChange={handleBankChange}
          />
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label>City/Town:</label>
              <input
                type="text"
                id="bank_city"
                name="bank_city"
                value={bankFormData.bank_city || ""}
                onChange={handleBankChange}
              />
            </div>
            <div className={styles.inputControl}>
              <label>Chiefdom:</label>
              <input
                type="text"
                id="bank_chiefdom"
                name="bank_chiefdom"
                value={bankFormData.bank_chiefdom || ""}
                onChange={handleBankChange}
              />
            </div>
          </div>
          <div className={styles.contactInput}>
            <div className={styles.inputControl}>
              <label>District:</label>
              <input
                type="text"
                id="bank_district"
                name="bank_district"
                value={bankFormData.bank_district || ""}
                onChange={handleBankChange}
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

export default BankForm;
