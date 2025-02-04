import React, { useEffect, useState } from "react";
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";
import LoadingSpinner from "../../../components/LoadingSpinner";

import { Alert } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

function CustomerForm({
  formData,
  nextStep,
  prevStep,
  closeModal,
  handleFormData,
}) {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(formData);
  const [loading, setLoading] = useState(false);

  // Format date for input[type="date"]
  const formatDateToInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Ensures YYYY-MM-DD format
  };

  // Update form data when profile is fetched
  useEffect(() => {
    setLoading(true);
    if (user) {
      setCustomerData((prevData) => ({
        ...prevData,
        id: user.id,
        last_name: user.last_name || "",
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        gender: user?.gender || "", // Add default fallback
        date_of_birth: formatDateToInput(user?.date_of_birth), // Format date
        email: user.email || "",
        phone: user.phone || "",
        other_phone: user.other_phone || "",
      }));
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormData({ customer: customerData });
    nextStep();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <button onClick={closeModal} className={styles.closeBtn}>
              X
            </button>
            <h4>Customer Information</h4>

            {error && (
              <Alert variant="error" className="warning">
                {error}
              </Alert>
            )}
            <div className={styles.sectionMargin}>
              <div>
                <div className={`${styles.inputLayout}`}>
                  <div className={styles.inputControl}>
                    <label>Last/Surname:</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={customerData.last_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>First Name:</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={customerData.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Middle Name:</label>
                    <input
                      type="text"
                      id="middle_name"
                      name="middle_name"
                      value={customerData.middle_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>Gender:</label>
                    <select
                      name="gender"
                      value={(customerData.gender || "").toLowerCase()} // Normalize to lowercase
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.inputControl}>
                    <label>Date of Birth:</label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={
                        formatDateToInput(customerData?.date_of_birth) || ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>Email:</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={customerData.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={customerData.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Second Phone Number:</label>
                    <input
                      type="text"
                      id="other_phone"
                      name="other_phone"
                      value={customerData.other_phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.addNavBtnContainer}>
              <button
                type="button"
                className={styles.formNavBtn}
                onClick={prevStep}
              >
                Prev
              </button>
              <button type="submit" className={styles.formNavBtn}>
                Next
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default CustomerForm;
