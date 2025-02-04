import { useEffect, useState, useMemo } from "react";
import styles from "../ProfileStyles/ProfileHome.module.css"; // CSS module
import LoadingSpinner from "../../LoadingSpinner";
import BioForm from "../ProfileForms/BioForm";
import isEqual from "lodash/isEqual";

import { Alert } from "react-bootstrap";
import { formatDates } from "../../../../utils/formatDateOfBirth";
import { useCustomer } from "../../../context/CustomerContext";
import { useAuth } from "../../../context/AuthContext";

function Bio() {
  const { user, updateUser } = useAuth();
  const { customer, fetchCustomer } = useCustomer();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [bioFormData, setBioFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    other_phone: "",
    email: "",
    date_of_birth: "",
    gender: "",
  });

  const [mode, setMode] = useState("view");

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

  const displayData = useMemo(() => {
    return customer ? { ...user, ...customer } : user;
  }, [user, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBioFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    console.log("Changing mode to:", newMode);
    if (newMode === "edit" && displayData) {
      setOriginalFormData(bioFormData); // Save the current form data as original
    }
    setMode(newMode);
  };

  useEffect(() => {
    if (displayData) {
      setBioFormData({
        first_name: displayData.first_name || "",
        last_name: displayData.last_name || "",
        middle_name: displayData.middle_name || "",
        phone: displayData.phone || "",
        other_phone: displayData.other_phone || "",
        email: displayData.email || "",
        date_of_birth: displayData.date_of_birth || "",
        gender: displayData.gender || "",
      });
    }
  }, [displayData]);

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, bioFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Profile ID is not available.");
      console.error("Profile ID is not available.");
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

      const response = await updateUser(user.id, bioFormData);
      // setSuccess("Profile updated successfully!");
      setBioFormData(response.msg);
      await fetchCustomer();
    } catch (error) {
      setError(error);

      console.error(error);
    } finally {
      setLoading(false);
    }
    setMode("view");
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
              <h1>Bio Graph</h1>
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

              {displayData && (
                <div className={styles.bioDetails}>
                  <div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>First Name </span>: {displayData.first_name || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Middle Name </span>:{" "}
                        {displayData.middle_name || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Last Name </span>: {displayData.last_name || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Gender </span>: {displayData.gender || ""}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Birthday</span>:{" "}
                        {formatDates(displayData.date_of_birth) || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Email </span>: {displayData.email || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Mobile </span>: {displayData.phone || ""}
                      </p>
                    </div>
                    <div className={styles.bioRow}>
                      <p>
                        <span>Second Phone </span>:{" "}
                        {displayData.other_phone || ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.bioInfoHeading}>
                <button
                  className={styles.edit}
                  onClick={() => handleModeChange("edit")}
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.panel}>
              <BioForm
                handleChange={handleChange}
                handleModeChange={handleModeChange}
                handleSubmit={handleSubmit}
                bioFormData={bioFormData}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Bio;
