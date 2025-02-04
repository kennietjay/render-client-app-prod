import React, { useState, useEffect } from "react";
import styles from "../Customers.module.css";

import BusinessForm from "../ProfileForms/BusinessForm";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import isEqual from "lodash/isEqual";

import { Alert } from "react-bootstrap";
import { useCustomer } from "../../../../context/CustomerContext";
import { useBusiness } from "../../../../context/BusinessContext";

function Business() {
  const { businesses, updateBusiness, createBusiness } = useBusiness();
  const { customer } = useCustomer();
  const [originalFormData, setOriginalFormData] = useState(null);
  const [businessFormData, setBusinessFormData] = useState({
    business_name: "",
    ownership_type: "",
    business_type: "",
    capital: "",
    business_address: "",
    business_section: "",
    business_city: "",
    business_chiefdom: "",
    business_district: "",
    business_phone: "",
    business_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("view");
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);

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

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setWarning(null);
    setSuccess(null);
    if (newMode === "add") {
      setBusinessFormData({
        business_name: "",
        ownership_type: "",
        business_type: "",
        capital: "",
        business_phone: "",
        business_email: "",
        business_address: "",
        business_section: "",
        business_city: "",
        business_chiefdom: "",
        business_district: "",
      });
      setSelectedBusinessId(null);
    }
  };

  const handleEditClick = (business) => {
    setBusinessFormData({
      business_name: business.business_name || "",
      ownership_type: business.ownership_type || "",
      business_type: business.business_type || "",
      capital: business.capital || "",
      business_phone: business.business_phone || "",
      business_email: business.business_email || "",
      business_address: business.business_address || "",
      business_section: business.business_section || "",
      business_city: business.business_city || "",
      business_chiefdom: business.business_chiefdom || "",
      business_district: business.business_district || "",
    });
    setOriginalFormData(business);
    setBusinessFormData(business);
    setSelectedBusinessId(business.id);
    setMode("edit");
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, businessFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Skip submission if no changes are detected in edit mode
      if (mode === "edit" && !hasDataChanged()) {
        setWarning("No changes detected. Update skipped.");
        setMode("view");

        setLoading(false); // Stop the loading spinner
        return;
      }

      if (mode === "edit" && selectedBusinessId) {
        await updateBusiness(customerId, selectedBusinessId, businessFormData);
        setSuccess("Business updated successfully!");
      } else if (mode === "add") {
        const newBusiness = await createBusiness({
          ...businessFormData,
          customer_id: customerId,
        });
        setSuccess("Business added successfully!");
        setOriginalFormData(newBusiness); // Save the newly created business as the original data
      }

      // Reset form and mode after successful submission
      setMode("view");
      setOriginalFormData(businessFormData); // Update originalFormData to reflect the current state
    } catch (error) {
      setError("Failed to update or create business.");
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
              <h3>Business Information</h3>
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

              {businesses.length > 0 ? (
                businesses.map((business, index) => (
                  <div key={business.id} className={styles.guarantorDetails}>
                    {/* {business.map((business) => ( */}
                    <div className={styles.guarantorCard}>
                      <div className={styles.bioDetails}>
                        <p>{index + 1} Business </p>
                        <div className={styles.bioDetail}>
                          <div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Business Name</span>:{" "}
                                {business.business_name}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Ownership Type</span>:{" "}
                                {business.ownership_type}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Business Type</span>:{" "}
                                {business.business_type}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Capital</span>: {business.capital}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Phone</span>: {business.business_phone}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Email</span>: {business.business_email}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Address</span>:{" "}
                                {business.business_address}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Section</span>:{" "}
                                {business.business_section}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>City/Town</span>: {business.business_city}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>Chiefdom</span>:{" "}
                                {business.business_chiefdom}
                              </p>
                            </div>
                            <div className={styles.bioRow}>
                              <p>
                                <span>District</span>:{" "}
                                {business.business_district}
                              </p>
                            </div>
                          </div>

                          <div className={styles.bioInfoHeading}>
                            <button onClick={() => handleEditClick(business)}>
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ))} */}
                  </div>
                ))
              ) : (
                <div>
                  <div className={styles.addBtns}>
                    <button
                      disabled={error}
                      className={styles.edit}
                      onClick={() => handleModeChange("add")}
                    >
                      Add Guarantor
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <BusinessForm
                handleSubmit={handleSubmit}
                businessFormData={businessFormData}
                handleBusinessChange={handleBusinessChange}
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

export default Business;

//
{
  /* <div className={styles.panel}>
{mode === "view" ? (
  <div className={styles.bioGraphInfo}>
    <h3>Business Details</h3>
    {success && (
      <Alert
        variant="success"
        dismissible
        onClose={() => setSuccess(null)}
      >
        {success}
      </Alert>
    )}
    {warning && (
      <Alert variant="warning" dismissible>
        {warning}
      </Alert>
    )}
    {error && (
      <Alert variant="warning" className={styles.noDataAlert}>
        {error}
      </Alert>
    )}

    <div>
      {businesses.length > 0 ? (
        businesses.map((business, index) => (
          <div key={business.id} className={styles.businessCard}>
            <div className={styles.bioDetails}>
              <p>{index + 1} Business </p>
              <div className={styles.bioDetail}>
                <div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Business Name:</span>{" "}
                      {capitalizeWords(business.business_name) || ""}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Ownership Type:</span>{" "}
                      {capitalizeWords(business.ownership_type) || ""}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Business Type:</span>{" "}
                      {capitalizeWords(business.business_type) || ""}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Capital:</span> {business.capital}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Phone:</span> {business.business_phone}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Email:</span> {business.business_email}
                    </p>
                  </div>
                </div>

                <div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Address:</span>{" "}
                      {business.business_address}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>City:</span> {business.business_city}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>Chiefdom:</span>{" "}
                      {capitalizeWords(business.business_chiefdom)}
                    </p>
                  </div>
                  <div className={styles.bioRow}>
                    <p>
                      <span>District:</span>{" "}
                      {capitalizeWords(business.business_district)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={styles.editBtn}
              onClick={() => handleEditClick(business)}
            >
              Edit
            </button>
          </div>
        ))
      ) : (
        <p>No Business</p>
      )}
    </div>

    <button
      className={styles.addBtn}
      onClick={() => handleModeChange("add")}
    >
      Add Business
    </button>
  </div>
) : (
  <BusinessForm
    handleSubmit={handleSubmit}
    businessFormData={businessFormData}
    handleBusinessChange={handleBusinessChange}
    setMode={setMode}
    mode={mode}
  />
)}
</div> */
}
