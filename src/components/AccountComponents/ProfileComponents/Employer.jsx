import React, { useEffect, useState } from "react";
import styles from "../ProfileStyles/ProfileHome.module.css";
import isEqual from "lodash/isEqual";

import { Alert } from "react-bootstrap";
import { useCustomer } from "../../../context/CustomerContext";
import { useEmployer } from "../../../context/EmployerContext";

import EmployerForm from "../ProfileForms/EmployerForm";
import LoadingSpinner from "../../LoadingSpinner";

function Employer() {
  const { employer, updateEmployer, getEmployer, createEmployer } =
    useEmployer();
  const { customer } = useCustomer();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employerId, setEmployerId] = useState("");
  const [employerData, setEmployerData] = useState(null);
  const [mode, setMode] = useState("view"); // "view", "edit", or "add"
  const [employerFormData, setEmployerFormData] = useState({
    employing_authority: "",
    employer_name: "",
    occupation: "",
    employee_code: "",
    employer_email: "",
    employer_phone: "",
    current_position: "",
    employer_address: "",
    employer_city: "",
    employer_chiefdom: "",
    employer_district: "",
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

  //
  useEffect(() => {
    try {
      setLoading(true);
      if (employer && customer) {
        // const employer = employerData;
        setEmployerData(employer);
        setEmployerId(employer?.id); // Ensure employerId is set

        setEmployerFormData({
          employing_authority: employer.employing_authority || "",
          employer_name: employer.employer_name || "",
          occupation: employer.occupation || "",
          current_position: employer.current_position || "",
          employee_code: employer.employee_code || "",
          employer_email: employer.employer_email || "",
          employer_phone: employer.employer_phone || "",
          employer_address: employer.employer_address || "",
          employer_city: employer.employer_city || "",
          employer_chiefdom: employer.employer_chiefdom || "",
          employer_district: employer.employer_district || "",
        });
      } else {
        console.log("Employer information is null or empty for customer ID:");
        setEmployerData(null);
        setEmployerFormData({
          address: "",
          city: "",
          chiefdom: "",
          district: "",
          section: "",
        });
      }
    } catch (error) {
      console.error("Error fetching employers in component:", error.message);
    } finally {
      setLoading(false);
    }
  }, [employer, customer]);

  //
  const handleEmployerChange = (e) => {
    const { name, value } = e.target;
    setEmployerFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    console.log("Changing mode to:", newMode);
    if (newMode === "edit" && employerData) {
      setOriginalFormData(employerFormData); // Save the current form data as original
    }
    setMode(newMode);
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, employerFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employerFormData.employer_name || !customer?.customer_id) {
      setError("All required fields must be filled.");
      return;
    }

    // Skip the update if no changes are detected
    if (mode === "edit" && !hasDataChanged()) {
      setWarning("No changes detected. Update skipped.");
      setMode("view");
      return;
    }

    try {
      setLoading(true);

      const updatedEmployer = {
        ...employerFormData,
        customerId: customer?.customer_id,
      };

      let response;
      if (mode === "edit" && employerId) {
        response = await updateEmployer(updatedEmployer);
      } else if (mode === "add") {
        response = await createEmployer(updatedEmployer);
      }

      if (response) {
        setEmployerData(response); // Update the local employer data
        setEmployerFormData({
          employing_authority: response.employing_authority,
          employer_name: response.employer_name,
          occupation: response.occupation,
          current_position: response.current_position,
          employee_code: response.employee_code,
          employer_email: response.employer_email,
          employer_phone: response.employer_phone,
          employer_address: response.employer_address,
          employer_city: response.employer_city,
          employer_chiefdom: response.employer_chiefdom,
          employer_district: response.employer_district,
        });
        setSuccess("Employer details updated successfully!");
      }

      await getEmployer(customer?.customer_id);
      setMode("view"); // Switch back to view mode
    } catch (error) {
      setError("Failed to update or create employer.");
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
              <h3>Occupation and Employer</h3>
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

              {employerData ? (
                <div>
                  <div className={`${styles.bioDetails}`}>
                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Employing Authority </span>:{" "}
                          {employer.employing_authority}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Institution </span>: {employer.employer_name}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Occupation </span>: {employer.occupation}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Current Posittion </span>:{" "}
                          {employer.current_position}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Pin Code </span>: {employer.employee_code}
                        </p>
                      </div>

                      <div className={styles.bioRow}>
                        <p>
                          <span>Employer Email </span>:{" "}
                          {employer.employer_email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Employer Phone </span>:{" "}
                          {employer.employer_phone}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Address </span>: {employer.employer_address}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>City/Town </span>: {employer.employer_city}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>Chiefdom </span>: {employer.employer_chiefdom}
                        </p>
                      </div>
                      <div className={styles.bioRow}>
                        <p>
                          <span>District</span>: {employer.employer_district}
                        </p>
                      </div>
                    </div>

                    <div className={styles.bioInfoHeading}>
                      <button
                        className={styles.edit}
                        onClick={() => handleModeChange("edit")}
                      >
                        {mode.employer ? "View" : <span>Edit</span>}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={styles.addBtns}></div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <EmployerForm
                handleSubmit={handleSubmit}
                employer={employer}
                employerFormData={employerFormData}
                handleEmployerChange={handleEmployerChange}
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

export default Employer;
