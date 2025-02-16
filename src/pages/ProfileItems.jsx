import React, { useState } from "react";
import SmallModal from "../components/SmallModal";
import { Alert } from "react-bootstrap";
import styles from "../pages/Signup.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileItems = ({ isSmallModalOpen, closeSmallModal }) => {
  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false);
  const handleCloseSmallModal = () => {
    closeSmallModal();
  };

  const openInnerModal = () => setIsInnerModalOpen(true);
  const closeInnerModal = () => setIsInnerModalOpen(false);

  return (
    <div>
      <SmallModal isOpen={isSmallModalOpen}>
        <div className={styles.profilePasswordChange}>
          <h3>Profile Actions</h3>
          <ul className={styles.profileItems}>
            <li onClick={openInnerModal}>Change Password</li>
          </ul>
          <button onClick={handleCloseSmallModal} className={styles.closeBtn}>
            close
          </button>
          <div>
            <ChangePassword
              closeInnerModal={closeInnerModal}
              isInnerModalOpen={isInnerModalOpen}
              setIsInnerModalOpen={setIsInnerModalOpen}
            />
          </div>
        </div>
      </SmallModal>
    </div>
  );
};

const ChangePassword = ({ loading, isInnerModalOpen, closeInnerModal }) => {
  const { changePassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  //   const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    closeInnerModal();
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

    const newPasswordData = {
      password: formData.password,
    };
    // console.log(formData);

    const response = await changePassword(newPasswordData);
    if (response.error) {
      setError(response.error);
      setSuccess(null);
    } else {
      setSuccess(response.success);
      setError(null);
      setFormData({ confirm_password: "", password: "" });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <SmallModal isOpen={isInnerModalOpen}>
      <div className={styles.profilePasswordChange}>
        <div className={styles.formHeader}>
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
            <Link onClick={handleCloseModal}>Cancel</Link>
          </p>
        </div>
      </div>
    </SmallModal>
  );
};

export default ProfileItems;
