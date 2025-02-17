import React, { useEffect, useState } from "react";
import styles from "../LoanPayment.module.css";
import LoadingSpinner from "../../../LoadingSpinner";

import { Alert } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthContext";
import {
  handleDateInput,
  convertToDBFormat,
  formatDateForDisplay,
} from "/utils/dateUtils.js";

function CustomerForm({
  formData,
  nextStep,
  prevStep,
  closeModal,
  handleFormData,
}) {
  const { getUserById, getUserByEmailOrPhone } = useAuth();
  const [searchUser, setSearchUser] = useState(null);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(formData);
  const [userId, setUserId] = useState(""); // Track the entered user ID
  const [loading, setLoading] = useState(false);

  // Update form data when profile is fetched
  useEffect(() => {
    setLoading(true);
    if (searchUser) {
      setCustomerData((prevData) => ({
        ...prevData,
        id: searchUser.id,
        last_name: searchUser.last_name || "",
        first_name: searchUser.first_name || "",
        middle_name: searchUser.middle_name || "",
        gender: searchUser?.gender || "", // Add default fallback
        date_of_birth: formatDateForDisplay(searchUser?.date_of_birth || ""), // Format date
        email: searchUser.email || "",
        phone: searchUser.phone || "",
        other_phone: searchUser.other_phone || "",
      }));
    }
    setLoading(false);
  }, [searchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prev) => ({
      ...prev,
      [name]: value, // Keep user input as-is
    }));
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value); // Update userId with the entered ID
  };

  const handleFetchProfile = async () => {
    if (!userId) {
      console.error("Please enter a user ID.");
      return;
    }

    try {
      setLoading(true);
      const response = await getUserByEmailOrPhone(userId); // Fetch user using the entered user ID
      if (response) {
        setSearchUser(response);
      }
      console.log(response);
    } catch (error) {
      setError(error);
      console.error("Error fetching user user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  //
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert DD-MM-YYYY to YYYY-MM-DD before sending
    const formattedDOB = convertToDBFormat(customerData.date_of_birth);

    if (!formattedDOB) {
      setError("Invalid date format. Use DD-MM-YYYY.");
      return;
    }

    const finalData = {
      ...customerData,
      date_of_birth: formattedDOB, // ✅ Convert before sending to backend
    };

    handleFormData({ customer: finalData });
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
              <Alert variant="warning" className="warning">
                {error}
              </Alert>
            )}
            <div className={styles.sectionMargin}>
              <div>
                <div
                  className={`${styles.inputLayout} ${styles.searchCustomer}`}
                >
                  <div className={styles.inputControl}>
                    <label>Enter User ID:</label>
                    <input
                      type="text"
                      id="user_id"
                      name="user_id"
                      value={userId}
                      onChange={handleUserIdChange}
                    />
                  </div>
                  <button type="button" onClick={handleFetchProfile}>
                    Get User
                  </button>
                </div>

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
                      type="text"
                      id="date_of_birth"
                      name="date_of_birth"
                      placeholder="DD-MM-YYYY"
                      value={customerData?.date_of_birth || ""}
                      onChange={handleInputChange} // Allow users to type freely
                      onBlur={(e) =>
                        handleDateInput(e, setError, setCustomerData)
                      } // Format & validate when user exits input
                    />

                    {/* <input
                      type="text"
                      id="date_of_birth"
                      name="date_of_birth"
                      placeholder="mm/dd/yyyy"
                      value={
                        formatDateToInput(customerData?.date_of_birth) || ""
                      }
                      onChange={handleInputChange}
                    /> */}
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
