import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function SignIn(props) {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Email field is required");
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

    const passwordResetEmail = {
      email: finalFormData.email,
    };

    setLoading(true);
    try {
      // Save the final formatted data
      const response = await forgotPassword(passwordResetEmail);

      if (response.success) {
        setSuccess("Password reset requested. Check your email.");
        setError(null);

        // Redirect based on user role
        const role = response.success?.role;

        setTimeout(() => {
          if (role === "staff") {
            navigate("/staff/signin");
          } else {
            navigate("/user/signin");
          }
        }, 5000); // Redirect after 3 seconds
      }

      console.log(response);
    } catch (error) {
      setError(error.message);
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
        <div className={styles.wrapper}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>Request password reset.</h3>
            </div>

            {success && <Alert variant="success">{success}</Alert>}

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

            <form onSubmit={handleSubmit}>
              <div className={styles.inputControl}>
                <label htmlFor="email">Enter your email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formBtns}>
                <button type="submit">Submit</button>
              </div>
            </form>

            <div>
              <p>
                <Link to="/user/profile">Cancel</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;

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
