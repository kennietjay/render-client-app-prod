import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function SignInOld(props) {
  const { signinUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

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

    const finalFormData = {
      ...formData,
      email: formattedEmail,
    };

    console.log("Formatted Form Data: ", finalFormData);

    const credentials = {
      email: formData.email,
      password: formData.password,
    };

    const response = await signinUser(credentials);

    if (response.error) {
      setError(response.error);
    } else {
      setSuccess(response.success);
      setFormData({ email: "", password: "password123" });
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
        <div className={styles.wrapper}>
          <div className={styles.bubbleBackground}>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
          </div>
          <div className={styles.container}>
            <div className={styles.formContainer}>
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

              <div className={styles.formSubHeader}>
                <i className="fa-solid fa-right-to-bracket"></i>
                <h3>Sign In</h3>
              </div>

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
                  Do not have an account?{" "}
                  <Link to="/user/signup">Register here</Link>
                </p>
                <p>
                  <Link to="/home">Cancel</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignInOld;

// Email Validation Functions
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
