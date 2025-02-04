import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

function StaffSignup({ isModalOpen, closeModal }) {
  const { createStaff, error, loading } = useAuth();
  const [inputError, setInputError] = useState();
  const [formData, setFormData] = useState({
    first_name: "Ama",
    last_name: "Doe",
    middle_name: "",
    gender: "Male",
    date_of_birth: "2001-09-11",
    email: "elmf.sl24@gmail.com",
    phone: "076600701",
    role_id: "",
    password: "password123",
    confirm_password: "password123",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date_of_birth" && value === "") {
      setFormData({ ...formData, [name]: null }); // Use null for empty dates
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // Function to capitalize each part of a name (including hyphenated names)
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  // Function to format phone number to +232-XX-XXXXXX
  const formatPhoneNumber = (phone) => {
    let cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
      cleanedPhone = cleanedPhone.slice(1); // Remove leading 0
    }

    if (/^\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
    }

    if (/^232\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setInputError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setInputError("Passwords do not match.");
      return;
    }

    if (!isValidEmailFormat(formData.email)) {
      setInputError("Please enter a valid email address.");
      return;
    }

    if (!isRecognizedEmailDomain(formData.email)) {
      setInputError(
        "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
      );
      return;
    }

    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!formattedPhone) {
      setInputError("Please enter a valid Sierra Leone phone number.");
      return;
    }

    // Format the first and last names to capitalize each part (including hyphenated names)
    const formattedFirstName = capitalizeName(formData.first_name);
    const formattedLastName = capitalizeName(formData.last_name);
    const formattedMiddleName = capitalizeName(formData.middle_name);

    // Format email and username to lowercase
    const formattedEmail = formData.email.toLowerCase();

    const finalFormData = {
      ...formData,
      phone: formattedPhone,
      first_name: formattedFirstName,
      last_name: formattedLastName,
      email: formattedEmail,
      middle_name: formattedMiddleName,
    };

    console.log("Formatted Form Data: ", finalFormData);

    const newUser = {
      first_name: finalFormData.first_name,
      last_name: finalFormData.last_name,
      middle_name: finalFormData.middle_name,
      gender: finalFormData.gender,
      date_of_birth: finalFormData.dob,
      email: finalFormData.email,
      phone: finalFormData.phone,
      role: finalFormData.role_id,
      password: finalFormData.password,
    };

    try {
      // Save the final formatted data

      await createStaff(newUser);

      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        date_of_birth: "",
        gender: "",
        email: "",
        phone: "",
        role_id: "",
        password: "password123",
        confirm_password: "password123",
      });

      setInputError("");
    } catch (error) {
      setInputError(error.message);
    }
  };

  const handleCloseModal = () => {
    closeModal();
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
        <div className={styles.wrapper}>
          <div className={styles.bubbleBackground}>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
          </div>

          <Modal isOpen={isModalOpen}>
            <div className={styles.formContainer}>
              {/*  */}

              {inputError && (
                <Alert
                  variant="warning"
                  className="warning"
                  dismissible
                  onClose={() => setInputError("")}
                >
                  {inputError}
                </Alert>
              )}
              {error && (
                <Alert
                  variant="warning"
                  className="warning"
                  dismissible
                  onClose={() => setInputError("")}
                >
                  {error}
                </Alert>
              )}

              <div className={styles.formSubHeader}>
                <i className="fa-solid fa-right-to-bracket"></i>
                <h3>Sign Up a Staff</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.inputControl}>
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="middle_name">Middle Name(Optional)</label>
                  <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="gender">Gender:</label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputLayout}>
                  <div className={styles.inputControl}>
                    <label>Loan Type:</label>
                    <select
                      name="role_id"
                      value={formData.role_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="2">Basic</option>
                      <option value="4">Cashier</option>
                      <option value="5">Loan Officer</option>
                      <option value="6">Finance Admin</option>
                      <option value="7">Auditor</option>
                      <option value="8">Manager</option>
                      <option value="9">System Admin</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputControl}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputControl}>
                  <label htmlFor="confirm_password">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formBtns}>
                  <button type="submit" onClick={handleCloseModal}>
                    Submit
                  </button>
                </div>
              </form>

              <div>
                <p>
                  Already have an account?{" "}
                  <Link to="/staff/signin#top">Login here</Link>
                </p>
                <p>
                  <Link to="/">Cancel</Link>
                </p>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default StaffSignup;

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
