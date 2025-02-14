import React, { useEffect, useState } from "react";
import styles from "./Staff.module.css";
import { Alert } from "react-bootstrap";
import { useStaff } from "../../../context/StaffContext";
import LoadingSpinner from "../../LoadingSpinner";

function AddStaff({ closeActionModal }) {
  const { createStaff } = useStaff();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "Amara",
    last_name: "Tamia",
    middle_name: "T",
    gender: "Male",
    date_of_birth: "12/12/2000",
    email: "kennie4tamia@gmail.com",
    phone: "076234567",
    role_id: "7",
    department: "Management",
    employment_date: "12/13/2024",
    password: "password",
    confirm_password: "password",
  });

  // Automatically dismiss alerts after 30 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);

        setError(null);
      }, 3000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
    }
  }, [success, error]);

  // Helper function to validate date
  const isValidDate = (date) => !isNaN(Date.parse(date));

  // Function to capitalize names
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  // Format phone number for Sierra Leone
  const formatPhoneNumber = (phone) => {
    let cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
      cleanedPhone = cleanedPhone.slice(1);
    }

    if (/^\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
    }

    if (/^232\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
    }

    return null;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirm_password ||
      !formData.date_of_birth
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!isValidDate(formData.date_of_birth)) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (!isValidEmailFormat(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isRecognizedEmailDomain(formData.email)) {
      setError(
        "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
      );
      return;
    }

    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!formattedPhone) {
      setError("Please enter a valid Sierra Leone phone number.");
      return;
    }

    // Create final data object
    const finalFormData = {
      ...formData,
      phone: formattedPhone,
      first_name: capitalizeName(formData.first_name),
      last_name: capitalizeName(formData.last_name),
      middle_name: capitalizeName(formData.middle_name),
      email: formData.email.toLowerCase(),
      department: formData.department, // Use formData directly
      employment_date: formData.employment_date, // Use formData directly
    };

    const newUser = {
      ...finalFormData,
      role_id: parseInt(formData.role_id, 10),
    };

    console.log("New User:", newUser);

    // Submit to backend
    setLoading(true);
    try {
      const response = await createStaff(newUser);
      setSuccess("Staff created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "Male",
        date_of_birth: "",
        email: "",
        phone: "",
        role_id: "",
        department: "",
        employment_date: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      setError(error.response?.data?.msg || "Failed to create staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.closeBtn}>
              <i onClick={closeActionModal} className="fa-solid fa-xmark"></i>
            </div>
            {success && (
              <Alert variant="success" className="warning">
                {success}
              </Alert>
            )}

            {error && (
              <Alert variant="warning" className="warning">
                {error}
              </Alert>
            )}
            <h4 className={styles.title}>Add a Staff</h4>

            <div className={styles.formGroup}>
              {/* First Name */}
              <div className={styles.inputControl}>
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Middle Name */}
              <div className={styles.inputControl}>
                <label htmlFor="middle_name">Middle Name:</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div className={styles.inputControl}>
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className={styles.inputControl}>
                <label htmlFor="gender">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className={styles.inputControl}>
                <label htmlFor="date_of_birth">Date of Birth:</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className={styles.inputControl}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className={styles.inputControl}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className={styles.inputControl}>
                <label htmlFor="role_id">Role:</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="2">Basic</option>
                  <option value="4">Cashier</option>
                  <option value="5">Loan Officer</option>
                  <option value="6">Manager</option>
                  <option value="7">Finance Admin</option>
                  <option value="8">Auditor</option>
                  <option value="9">System Admin</option>
                </select>
              </div>

              {/* Department */}
              <div className={styles.inputControl}>
                <label htmlFor="department">Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Employment Date */}
              <div className={styles.inputControl}>
                <label htmlFor="employment_date">Employment Date:</label>
                <input
                  type="date"
                  name="employment_date"
                  value={formData.employment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className={styles.inputControl}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className={styles.inputControl}>
                <label htmlFor="confirm_password">Confirm Password:</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default AddStaff;

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
