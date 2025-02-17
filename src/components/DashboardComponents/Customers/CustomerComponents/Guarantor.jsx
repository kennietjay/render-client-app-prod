import React, { useState, useEffect } from "react";
import styles from "../Customers.module.css";
import GuarantorForm from "../ProfileForms/GuarantorForm";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Alert } from "react-bootstrap";

import { useGuarantor } from "../../../../context/GuarantorContext";
import isEqual from "lodash/isEqual";

function Guarantor({ guarantors, customer, onUpdate }) {
  const { updateGuarantor, createGuarantor, getOneGuarantor } = useGuarantor(); // Consuming data from context

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [selectedGuarantorId, setSelectedGuarantorId] = useState(null);
  const [guarantorFormData, setGuarantorFormData] = useState({
    guarantor_first_name: "",
    guarantor_last_name: "",
    guarantor_middle_name: "",
    guarantor_gender: "",
    guarantor_phone: "",
    guarantor_email: "",
    guarantor_relationship: "",
    guarantor_occupation: "",
    guarantor_address: "",
    guarantor_section: "",
    guarantor_city: "",
    guarantor_chiefdom: "",
    guarantor_district: "",
  });
  const [mode, setMode] = useState("view"); // "view", "edit", or "add"

  const customerId = customer?.customer_id;

  useEffect(() => {
    if (!customerId) {
      console.error("Customer ID is undefined");
    }
  }, [customerId]);

  useEffect(() => {
    console.log("Guarantor Props:", { guarantors, customer });
  }, [guarantors, customer]);

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

  // Initialize data
  const handleGuarantorChange = (e) => {
    const { name, value } = e.target;
    setGuarantorFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "add") {
      setGuarantorFormData({
        guarantor_first_name: "",
        guarantor_last_name: "",
        guarantor_middle_name: "",
        guarantor_gender: "",
        guarantor_phone: "",
        guarantor_email: "",
        guarantor_relationship: "",
        guarantor_occupation: "",
        guarantor_address: "",
        guarantor_section: "",
        guarantor_city: "",
        guarantor_chiefdom: "",
        guarantor_district: "",
      });
      setSelectedGuarantorId(null);
    }
  };

  const handleEditClick = (guarantor) => {
    // Ensure you pass the correct guarantor object to this function
    setGuarantorFormData({
      guarantor_first_name: guarantor.guarantor_first_name || "",
      guarantor_last_name: guarantor.guarantor_last_name || "",
      guarantor_middle_name: guarantor.guarantor_middle_name || "",
      guarantor_gender: guarantor.guarantor_gender || "",
      guarantor_phone: guarantor.guarantor_phone || "",
      guarantor_email: guarantor.guarantor_email || "",
      guarantor_relationship: guarantor.guarantor_relationship || "",
      guarantor_occupation: guarantor.guarantor_occupation || "",
      guarantor_address: guarantor.guarantor_address || "",
      guarantor_section: guarantor.guarantor_section || "",
      guarantor_city: guarantor.guarantor_city || "",
      guarantor_chiefdom: guarantor.guarantor_chiefdom || "",
      guarantor_district: guarantor.guarantor_district || "",
    });
    setSelectedGuarantorId(guarantor.id);
    setOriginalFormData(guarantor);
    setGuarantorFormData(guarantor);
    setMode("edit");
  };

  //
  const resetForm = () => {
    setGuarantorFormData({
      guarantor_first_name: "",
      guarantor_last_name: "",
      guarantor_middle_name: "",
      guarantor_gender: "",
      guarantor_phone: "",
      guarantor_email: "",
      guarantor_relationship: "",
      guarantor_occupation: "",
      guarantor_address: "",
      guarantor_section: "",
      guarantor_city: "",
      guarantor_chiefdom: "",
      guarantor_district: "",
    });
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, guarantorFormData);
  };

  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Submitting Guarantor Data:", guarantorFormData);

      if (mode === "edit" && selectedGuarantorId) {
        const response = await updateGuarantor(
          customer?.customer_id,
          selectedGuarantorId,
          guarantorFormData
        );

        // Replace the updated guarantor in the list
        const updatedGuarantors = guarantors?.map((g) =>
          g.id === selectedGuarantorId ? response.guarantor : g
        );

        // Propagate the updated data to the parent
        onUpdate({
          ...customer,
          guarantors: updatedGuarantors, // Pass updated guarantors
        });

        setSuccess("Guarantor updated successfully!");
        setMode("view");
      } else if (mode === "add") {
        const response = await createGuarantor(
          guarantorFormData,
          customer?.customer_id
        );

        // Add the new guarantor to the list
        const updatedGuarantors = [...guarantors, response.guarantor];

        // Propagate the updated data to the parent
        onUpdate({
          ...customer,
          guarantors: updatedGuarantors, // Pass updated guarantors
        });

        setSuccess("Guarantor added successfully!");
        setMode("view");
      }

      // Reset the form after submission
      setGuarantorFormData({
        guarantor_first_name: "",
        guarantor_last_name: "",
        guarantor_middle_name: "",
        guarantor_gender: "",
        guarantor_phone: "",
        guarantor_email: "",
        guarantor_relationship: "",
        guarantor_occupation: "",
        guarantor_address: "",
        guarantor_section: "",
        guarantor_city: "",
        guarantor_chiefdom: "",
        guarantor_district: "",
      });
    } catch (error) {
      console.error("Error submitting guarantor:", error.message);
      setError(error.message || "Failed to submit guarantor.");
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
              <h3>Guarantors Information</h3>
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

              {customer?.guarantors?.length > 0
                ? guarantors?.map((guarantor, index) => (
                    <div
                      key={guarantor.id || index}
                      className={styles.guarantorDetails}
                    >
                      {/* {guarantor.map((guarantor) => ( */}
                      <div className={styles.guarantorCard}>
                        <div className={styles.guarantorBioDetails}>
                          <p>{index + 1} Guarantor </p>
                          <div className={styles.guarantorBioDetail}>
                            <div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>First Name</span>:{" "}
                                  {guarantor.guarantor_first_name}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Middle Name</span>:{" "}
                                  {guarantor.guarantor_middle_name}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Last Name</span>:{" "}
                                  {guarantor.guarantor_last_name}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Gender</span>:{" "}
                                  {guarantor.guarantor_gender}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Phone</span>:{" "}
                                  {guarantor.guarantor_phone}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Email</span>:{" "}
                                  {guarantor.guarantor_email}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Occupation</span>:{" "}
                                  {guarantor.guarantor_occupation}
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Relationship</span>:{" "}
                                  {guarantor.guarantor_relationship}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Address</span>:{" "}
                                  {guarantor.guarantor_address}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Section</span>:{" "}
                                  {guarantor.guarantor_section}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>City/Town</span>:{" "}
                                  {guarantor.guarantor_city}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>Chiefdom</span>:{" "}
                                  {guarantor.guarantor_chiefdom}
                                </p>
                              </div>
                              <div className={styles.bioRow}>
                                <p>
                                  <span>District</span>:{" "}
                                  {guarantor.guarantor_district}
                                </p>
                              </div>
                            </div>

                            <div className={styles.bioInfoHeading}>
                              <button
                                onClick={() => handleEditClick(guarantor)}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ))} */}
                    </div>
                  ))
                : null}
              <div>
                <div className={styles.addBtns}>
                  <button
                    disabled={error}
                    className={styles.edit}
                    onClick={() => handleModeChange("add")}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <GuarantorForm
                handleSubmit={handleSubmit}
                guarantorFormData={guarantorFormData}
                handleGuarantorChange={handleGuarantorChange}
                mode={mode}
                setMode={setMode}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Guarantor;
