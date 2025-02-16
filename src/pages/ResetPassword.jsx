import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function SignIn(props) {
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirm_password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    const newPassword = {
      password: formData.password,
    };

    setLoading(true);
    try {
      // Call resetPassword function from context with token and new password
      const response = await resetPassword(token, newPassword);
      setSuccess("Password has been reset successfully");
      setError(null);
      setTimeout(() => {
        navigate("/user/profile"); // Redirect to login page
      }, 3000); // Redirect after 3 seconds
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
              <img
                className={styles.logo}
                src="/images/logos/easylife_logo.png"
                alt="Easy life micro-finance logo."
              />
              <h3>Reset Your Password.</h3>
            </div>

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

            {success && <Alert variant="success">{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <div className={styles.inputControl}>
                <label htmlFor="password">New Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputControl}>
                <label htmlFor="confirm_password">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formBtns}>
                <button type="submit">Save</button>
              </div>
            </form>

            <div>
              <p>
                <Link to="/user/signin">Cancel</Link>
              </p>
            </div>

            <div className={styles.signupInstructions}>
              <p>
                Create a unique password that you’ll use to access your account
                online.
              </p>
              <div>
                <div>
                  <h5>Password requirements</h5>
                  <ul>
                    <li>8 characters</li>
                    <li>1 lowercase letter</li>
                    <li>1 uppercase letter</li>
                    <li>1 number</li>
                    <li>1 special character includes (! # $ % - _ = +) </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;
