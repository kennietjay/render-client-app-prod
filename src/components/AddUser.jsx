import React, { useState } from "react";
import styles from "../components/DashboardComponents/Loans/LoanPayment.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { handleDateInput, convertToDBFormat } from "/utils/dateUtils.js";
import { formatPhoneNumber } from "../../utils/phoneUtils";

function AddUser({ isAddUserOpen, onSubmit, closeAddUser, addUser }) {
  const { createUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize form fields with default values
  const [formData, setFormData] = useState({
    first_name: "Ama",
    middle_name: "",
    last_name: "Doe",
    email: "",
    gender: "Male",
    date_of_birth: "23-10-1984",
    phone: "076860509",
    password: "password",
    confirm_password: "password",
  });

  // ✅ Handle Input Change (Prevent Date Format Issues)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setFormData((prev) => ({
        ...prev,
        date_of_birth: value, // Keep input as DD-MM-YYYY
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Capitalize first letters of names (including hyphenated names)
  const capitalizeName = (name) =>
    name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");

  // Format Sierra Leone phone numbers
  // const phoneNumber = formatPhoneNumber(formData.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.date_of_birth ||
      !formData.gender ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!isValidEmailFormat(formData.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isRecognizedEmailDomain(formData.email)) {
      setError("Use a recognized email domain (Gmail, Yahoo, Outlook, etc.).");
      return;
    }

    const formattedDOB = convertToDBFormat(formData.date_of_birth);
    if (!formattedDOB) {
      setError("Invalid date format. Use DD-MM-YYYY.");
      return;
    }

    const formattedData = {
      ...formData,
      date_of_birth: formattedDOB,
      first_name: capitalizeName(formData.first_name),
      last_name: capitalizeName(formData.last_name),
      email: formData.email.toLowerCase(),
    };

    try {
      const response = await createUser(formattedData);

      if (response.success) {
        setSuccess(response.success);
        setError(null);
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          gender: "",
          date_of_birth: "",
          phone: "",
          password: "",
          confirm_password: "",
        });
        closeAddUser();
      } else {
        setError(response.error || "Something went wrong.");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading..."
        />
      ) : (
        <div className={styles.wrapper}>
          <Modal isOpen={isAddUserOpen} onClose={closeAddUser}>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <span className={styles.closeBtn} onClick={closeAddUser}>
                  X
                </span>
                <div className={styles.formSubHeader}>
                  <i className="fa-solid fa-user-plus"></i>
                  <p>Add New User</p>
                </div>

                {error && (
                  <Alert
                    variant="warning"
                    dismissible
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    variant="success"
                    dismissible
                    onClose={() => setSuccess(null)}
                  >
                    {success}
                  </Alert>
                )}

                {/* First Name */}
                <div className={styles.inputControl}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Middle Name */}
                <div className={styles.inputControl}>
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div className={styles.inputControl}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className={styles.inputControl}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className={styles.inputControl}>
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className={styles.inputControl}>
                  <label>Date of Birth</label>
                  <input
                    type="text"
                    name="date_of_birth"
                    placeholder="DD-MM-YYYY"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    onBlur={(e) => handleDateInput(e, setError, setFormData)}
                  />
                </div>

                {/* Phone */}
                <div className={styles.inputControl}>
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className={styles.inputControl}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Confirm Password */}
                <div className={styles.inputControl}>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formBtns}>
                  <button type="submit">Sign Up</button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default AddUser;

// Email Validation
const recognizedEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
];

const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isRecognizedEmailDomain = (email) => {
  const domain = email.split("@")[1];
  return recognizedEmailDomains.includes(domain) || domain.endsWith(".org");
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (
//     !formData.first_name ||
//     !formData.last_name ||
//     !formData.email ||
//     !formData.phone ||
//     !formData.date_of_birth ||
//     !formData.gender ||
//     !formData.password ||
//     !formData.confirm_password
//   ) {
//     setError("All fields are required.");
//     return;
//   }

//   if (formData.password !== formData.confirm_password) {
//     setError("Passwords do not match.");
//     return;
//   }

//   if (!isValidEmailFormat(formData.email)) {
//     setError("Enter a valid email address.");
//     return;
//   }

// if (!isRecognizedEmailDomain(formData.email)) {
//   setError("Use a recognized email domain (Gmail, Yahoo, Outlook, etc.).");
//   return;
// }

//   const formattedPhone = formatPhoneNumber(formData.phone);
//   if (!formattedPhone) {
//     setError("Enter a valid Sierra Leone phone number.");
//     return;
//   }

//   // ✅ Convert date format before sending
//   const formattedDOB = convertToDBFormat(formData.date_of_birth);

//   if (!formattedDOB) {
//     setError("Invalid date format. Use DD-MM-YYYY.");
//     return;
//   }

//   const formattedData = {
//     ...formData,
//     date_of_birth: formattedDOB, // ✅ Ensure correct format is sent
//     first_name: capitalizeName(formData.first_name),
//     last_name: capitalizeName(formData.last_name),
//     middle_name: capitalizeName(formData.middle_name || ""),
//     gender: capitalizeName(formData.gender || ""),
//     email: formData.email.toLowerCase(),
//     phone: formattedPhone,
//   };

//   try {
//     const response = await createUser(formattedData);

//     if (response.success) {
//       if (onSubmit) onSubmit(response);

//       addUser();
//       // Reset form and display success message
//       setFormData({
//         first_name: "",
//         middle_name: "",
//         last_name: "",
//         email: "",
//         gender: "",
//         date_of_birth: "",
//         phone: "",
//         password: "",
//         confirm_password: "",
//       });
//       closeAddUser(); // Close modal

//       setSuccess("User created successfully!");
//       setError(null);
//     } else {
//       setError(response.msg);
//     }
//   } catch (error) {
//     setError(error?.msg || "An error occurred while creating the user.");
//   }
// };
