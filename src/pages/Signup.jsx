import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatPhoneNumber } from "../../utils/phoneUtils";

function Signup(props) {
  const { createUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "Ama",
    last_name: "Doe",
    email: "elmf.sl24@gmail.com",
    phone: "076456789",
    password: "password123",
    confirm_password: "password123",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to capitalize each part of a name (including hyphenated names)
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
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

    const formattedFirstName = capitalizeName(formData.first_name);
    const formattedLastName = capitalizeName(formData.last_name);
    const formattedEmail = formData.email.toLowerCase();

    const finalFormData = {
      ...formData,
      phone: formattedPhone,
      first_name: formattedFirstName,
      last_name: formattedLastName,
      email: formattedEmail,
    };

    console.log("Formatted Form Data: ", finalFormData);

    const newUser = {
      first_name: finalFormData.first_name,
      last_name: finalFormData.last_name,
      email: finalFormData.email,
      phone: finalFormData.phone,
      password: finalFormData.password,
    };

    try {
      const response = await createUser(newUser);

      if (response.success) {
        setSuccess(response.msg);
        setError(null); // Ensure error is cleared
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          confirm_password: "",
        });
      } else {
        setError(response.msg);
        setSuccess(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess(null);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !formData.first_name ||
  //     !formData.last_name ||
  //     !formData.email ||
  //     !formData.phone ||
  //     !formData.password ||
  //     !formData.confirm_password
  //   ) {
  //     setError("All fields are required");
  //     return;
  //   }

  //   if (formData.password !== formData.confirm_password) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   if (!isValidEmailFormat(formData.email)) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }

  //   if (!isRecognizedEmailDomain(formData.email)) {
  //     setError(
  //       "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
  //     );
  //     return;
  //   }

  //   const formattedPhone = formatPhoneNumber(formData.phone);
  //   if (!formattedPhone) {
  //     setError("Please enter a valid Sierra Leone phone number.");
  //     return;
  //   }

  //   // Format the first and last names to capitalize each part (including hyphenated names)
  //   const formattedFirstName = capitalizeName(formData.first_name);
  //   const formattedLastName = capitalizeName(formData.last_name);

  //   // Format email and username to lowercase
  //   const formattedEmail = formData.email.toLowerCase();

  //   const finalFormData = {
  //     ...formData,
  //     phone: formattedPhone,
  //     first_name: formattedFirstName,
  //     last_name: formattedLastName,
  //     email: formattedEmail,
  //   };

  //   console.log("Formatted Form Data: ", finalFormData);

  //   const newUser = {
  //     first_name: finalFormData.first_name,
  //     last_name: finalFormData.last_name,
  //     email: finalFormData.email,
  //     phone: finalFormData.phone,
  //     password: finalFormData.password,
  //   };

  //   try {
  //     // Save the final formatted data
  //     const response = await createUser(newUser);

  //     setFormData({
  //       first_name: "",
  //       last_name: "",
  //       email: "",
  //       phone: "",
  //       password: "password123",
  //     });
  //     setSuccess(response.msg);
  //     setError("");
  //   } catch (error) {
  //     setError(error);
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
        <div className={styles.wrapper}>
          <div className={styles.bubbleBackground}>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
          </div>

          <div className={styles.formContainer}>
            {error && (
              <Alert
                variant="warning"
                className="warning"
                dismissible
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                variant="success"
                className="warning"
                dismissible
                onClose={() => setSuccess("")}
              >
                {success}
              </Alert>
            )}
            <div>
              <div className={styles.formSubHeader}>
                <i className="fa-solid fa-user-plus"></i>
                <p>Customer Sign Up</p>
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
                  <button type="submit">Sign up</button>
                </div>
              </form>
              <p>
                Already have an account?{" "}
                <Link to="/user/signin">Login here</Link>
              </p>
              <p>
                <Link to="/">Cancel</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;

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
