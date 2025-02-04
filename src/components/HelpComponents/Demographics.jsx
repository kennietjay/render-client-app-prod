import React, { useState } from "react";
import styles from "../../pages/Profile.module.css";
import { useUser } from "../../contexts/UserContext";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

function Demographics() {
  const { updateUser, profile, success, error } = useUser();
  const [inputError, setInputError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
  });
  const [editMode, setEditMode] = useState({ profile: false });

  useEffect(() => {
    setLoading(true);
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        middle_name: profile.middle_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
      });
    }
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (success) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = () => {
    setEditMode((prev) => ({ profile: !prev.profile }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (profile && profile.id) {
      try {
        await updateUser(profile.id, formData);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    } else {
      console.log("Profile ID is not available.");
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.formContainer}>
          <h4>Name and Contact Details</h4>

          <div className={styles.addEditBtn}>
            <button className={styles.edit} onClick={handleEditClick}>
              {editMode.profile ? (
                "View"
              ) : (
                <span>
                  <i className="fa-solid fa-pen-to-square"></i>Edit
                </span>
              )}
            </button>
          </div>

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
          {showAlert && (
            <Alert
              variant="success"
              className="warning"
              dismissible
              onClose={() => setShowAlert(false)}
            >
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.contactDetails}>
              <div className={styles.contactInput}>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="last_name">Last Name:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="first_name">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="middle_name">Middle Name:</label>
                  <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
              </div>

              <div className={styles.contactInput}>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="dob">Date of Birth:</label>
                  <input
                    type="text"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="gender">Gender:</label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
              </div>

              <div className={styles.contactInput}>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
                <div className={`${styles.inputControl}`}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode.profile}
                  />
                </div>
              </div>
            </div>
            {editMode.profile && <button type="submit">Save Changes</button>}
          </form>
        </div>
      )}
    </div>
  );
}

export default Demographics;
