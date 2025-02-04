import React, { useEffect, useState } from "react";
import BankForm from "../ProfileForms/BankForm";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import styles from "../Customers.module.css";
import isEqual from "lodash/isEqual";

import { Alert } from "react-bootstrap";
import { useBank } from "../../../../context/BankContext";

function Bank({ bank, customer, onUpdate }) {
  const { updateBank, getBank, createBank } = useBank();
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankId, setBankId] = useState("");
  const [bankData, setBankData] = useState(null);
  const [mode, setMode] = useState("view"); // "view", "edit", or "add"
  const [originalFormData, setOriginalFormData] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_address: "",
    bank_city: "",
    bank_chiefdom: "",
    bank_district: "",
  });

  const customerId = customer?.customer_id;

  // Automatically dismiss alerts after 30 seconds
  useEffect(() => {
    if (success || warning || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setWarning(null);
        setError(null);
      }, 3000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
    }
  }, [success, warning, error]);

  useEffect(() => {
    setLoading(true);
    try {
      if (bank && customer) {
        setBankData(bank);
        setBankId(bank?.id); // Ensure bankId is set

        setBankFormData({
          bank_name: bank.bank_name || "",
          account_name: bank.account_name || "",
          account_number: bank.account_number || "",
          bank_address: bank.bank_address || "",
          bank_city: bank.bank_city || "",
          bank_chiefdom: bank.bank_chiefdom || "",
          bank_district: bank.bank_district || "",
        });
      } else {
        console.log("Bank information is null or empty for customer ID:");
        setBankData(null);
        setBankFormData({
          bank_name: "",
          account_name: "",
          account_number: "",
          bank_address: "",
          bank_city: "",
          bank_chiefdom: "",
          bank_district: "",
        });
      }
    } catch (error) {
      console.error("Error fetching bank data:", error.message);
    } finally {
      setLoading(false);
    }
  }, [bank, customer]);

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    console.log("Changing mode to:", newMode);
    if (newMode === "edit" && bankData) {
      setOriginalFormData(bankFormData); // Save the current form data as original
    }
    setMode(newMode);
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, bankFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankFormData.bank_name || !customer?.customer_id) {
      setError("All required fields must be filled.");
      return;
    }

    try {
      setLoading(true);

      // Skip the update if no changes are detected
      if (mode === "edit" && !hasDataChanged()) {
        setWarning("No changes detected. Update skipped.");
        setMode("view");
        return;
      }

      const updatedBankData = {
        ...bankFormData,
        customer_id: customer?.customer_id,
      };

      let response;
      if (mode === "edit" && bankId) {
        response = await updateBank(customer?.customer_id, updatedBankData);
        onUpdate(updatedBankData); // Notify parent of the updated address
      } else if (mode === "add") {
        response = await createBank(updatedBankData);
      }

      if (response) {
        setBankData(response); // Update the local bank state with the updated data
        setSuccess("Bank details saved successfully!");
      }
      setMode("view"); // Close the form
      // await getBank(customer?.customer_id); // Refresh the bank data
    } catch (error) {
      setError("Failed to update or create bank details.");
      console.error("Error in handleSubmit:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.panel}>
          {mode === "view" ? (
            <div className={styles.bioGraphInfo}>
              <h3>Bank Information</h3>
              {success && (
                <Alert variant="success" className="success">
                  {success}
                </Alert>
              )}
              {warning && (
                <Alert variant="warning" className="warning">
                  {warning}
                </Alert>
              )}
              {error && <Alert className="danger">{error}</Alert>}

              {bankData ? (
                <div>
                  <div className={`${styles.bioDetails}`}>
                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Bank Name </span>: {bankData.bank_name}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Account Number </span>:{" "}
                          {bankData.account_number}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Account Name </span>: {bankData.account_name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Address </span>: {bankData.bank_address}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>City/Town </span>: {bankData.bank_city}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Chiefdom </span>: {bankData.bank_chiefdom}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>District</span>: {bankData.bank_district}
                        </p>
                      </div>
                    </div>
                    <div className={styles.bioInfoHeading}>
                      <button
                        className={styles.edit}
                        onClick={() => handleModeChange("edit")}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p>No bank information found.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <BankForm
                handleSubmit={handleSubmit}
                bankFormData={bankFormData}
                handleBankChange={handleBankChange}
                handleModeChange={handleModeChange}
                mode={mode}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Bank;
