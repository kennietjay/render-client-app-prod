import React, { useEffect, useState } from "react";
import styles from "../ProfileStyles/ProfileHome.module.css";
import isEqual from "lodash/isEqual";
import LoadingSpinner from "../../LoadingSpinner";
import AddressForm from "../ProfileForms/AddressForm";

import { Alert } from "react-bootstrap";
import { useCustomer } from "../../../context/CustomerContext";
import { useAddress } from "../../../context/AddressContext";
import { useLoan } from "../../../context/LoanContext";

function Addresss() {
  const { updateAddress, address, getAddress } = useAddress();
  const { updateCustomerData } = useLoan();
  const { customer } = useCustomer();
  const [contact, setContact] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("view"); // "view", "edit", or "add"
  const [originalFormData, setOriginalFormData] = useState(null);
  const [contactFormData, setContactFormData] = useState({
    address: "",
    city: "",
    chiefdom: "",
    district: "",
    section: "",
    user_fid: "",
  });

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
    if (address) {
      setContact(address);
      setAddressId(address.id);
      setContactFormData({
        address: address.address || "",
        city: address.city || "",
        chiefdom: address.chiefdom || "",
        district: address.district || "",
        section: address.section || "",
      });
    } else {
      setContact(null);
      setError("Add your occupation and employer when you apply for a loan.");
      setLoading(false);
    }
    setLoading(false);
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    if (newMode === "edit" && contact) {
      setOriginalFormData(contactFormData); // Save the current form data as the original
    }
    setMode(newMode);
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, contactFormData);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactFormData || !customer?.customer_id || !addressId) {
      setError("Required data is missing for updating the address.");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting form with data:", contactFormData);

      if (mode === "edit" && !hasDataChanged()) {
        setWarning("No changes detected. Update skipped.");
        setMode("view");
        return;
      }

      const customerId = customer?.customer_id;
      const updatedAddress = { ...contactFormData, customerId };

      // Call the API to update the address
      const response = await updateAddress(updatedAddress);

      console.log("API response:", response);

      // Update local state
      setContact(response);
      setContactFormData({
        address: response.address,
        city: response.city,
        chiefdom: response.chiefdom,
        district: response.district,
        section: response.section,
      });

      // Update the customer object locally
      const updatedCustomer = { ...customer, address: response };
      updateCustomerData(customer?.customer_id, updatedCustomer);
      setSuccess("Address updated successfully!");

      await getAddress(customer?.customer_id);
      setMode("view"); // Switch back to view mode
    } catch (error) {
      console.error("Error updating address:", error.message);
      setError(error.message || "Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!contactFormData || !customer?.customer_id || !addressId) {
  //     setError("Required data is missing for updating the address.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     console.log("Submitting form with data:", contactFormData);

  //     if (mode === "edit" && !hasDataChanged()) {
  //       setWarning("No changes detected. Update skipped.");
  //       setMode("view");
  //       return;
  //     }

  //     const updatedAddress = {
  //       ...contactFormData,
  //       customerId: customer?.customer_id,
  //     };

  //     const response = await updateAddress(
  //       updatedAddress
  //       // addressId,
  //     );

  //     console.log("API response:", response);
  //     setContact(response); // Update local state with the new data
  //     setContactFormData({
  //       address: response.address,
  //       city: response.city,
  //       chiefdom: response.chiefdom,
  //       district: response.district,
  //       section: response.section,
  //     });

  //     setSuccess("Address updated successfully!");
  //     setMode("view"); // Switch back to view mode
  //     await getAddress();
  //   } catch (error) {
  //     console.error("Error updating address:", error.message);
  //     setError(error.response?.data?.message || "Failed to update address.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
              <h3>Address Details</h3>
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

              {customer && (
                <div>
                  <div className={`${styles.bioDetails}`}>
                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Address </span>: {contact?.address}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>City/Town </span>: {contact?.city}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Section </span>: {contact?.section}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Chiefdom </span>: {contact?.chiefdom}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>District</span>: {contact?.district}
                        </p>
                      </div>
                    </div>

                    <div className={styles.bioInfoHeading}>
                      {/* <button
                        className={styles.edit}
                        onClick={() => handleModeChange("edit")}
                      >
                        {mode.contact ? "View" : <span>Edit</span>}
                      </button> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <AddressForm
                contact={contact}
                handleSubmit={handleSubmit}
                contactFormData={contactFormData}
                handleChange={handleChange}
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

export default Addresss;
