import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useStaff } from "../context/StaffContext";
import LoadingSpinner from "../components/LoadingSpinner";

function StaffSignin(props) {
  const { signInStaff } = useStaff();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "password123",
  });
  const [key, setKey] = useState(0); // Use key to re-render
  const location = useLocation();

  useEffect(() => {
    // Reset state if coming from footer link with reset flag
    if (location.state?.reset) {
      setError(null);
      setSuccess(null);
      setFormData({ email: "", password: "" });
      setKey((prevKey) => prevKey + 1); // Force component re-render
    }
  }, [location.state?.reset]); // Watch the reset flag in state

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
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

    // Format email and username to lowercase
    const formattedEmail = formData.email.toLowerCase();

    const credentials = {
      email: formattedEmail,
      password: formData.password,
    };

    setLoading(true);
    setError(null); // Reset errors

    try {
      const response = await signInStaff(credentials);

      if (response?.success) {
        setSuccess(response?.success);
        setFormData({ email: "", password: "" });
        navigate("/staff/dashboard#top");
      } else {
        setError(response?.error);
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Ensure spinner stops in all cases
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
        <div key={key} className={styles.wrapper}>
          <div className={styles.bubbleBackground}>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formSubHeader}>
              <i className="fa-solid fa-right-to-bracket"></i>
              <p>Employee Sign In</p>
            </div>

            {/* Show error alert if there's an error */}
            {error && (
              <Alert
                variant="warning"
                dismissible
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Show success alert if there's a success message */}
            {success && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSuccess(null)}
              >
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
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
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formBtns}>
                <button type="submit">Sign in</button>
              </div>
            </form>

            <div>
              <Link
                className={styles.forgotPassword}
                to="/user/forgot-password"
              >
                Forgot password.
              </Link>
              <p>
                <Link to="/">Cancel</Link>
              </p>

              <p>
                Need help accessing your account? <br />
                Contact system administrator
                <Link to="/contact"> here.</Link>
              </p>
            </div>
            <div>
              <p>
                <Link to="/user/signin">Login as a customer</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffSignin;

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
