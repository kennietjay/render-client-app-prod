import React, { useEffect, useState } from "react";
import styles from "./UsersTable.module.css";
import SideBar from "../../SideBar";
import { useAuth } from "../../../context/AuthContext";
import { Alert } from "react-bootstrap";

function UpdateUser({
  isSidebarOpen,
  closeSidebar,
  selectedUser,
  setSelectedUser,
  updateUserData,
}) {
  const { updateUser } = useAuth();
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Format date for input[type="date"]
  const formatDateToInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Ensures YYYY-MM-DD format
  };

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    //
    setLoading(true);
    const updatedUserData = {
      ...selectedUser,
    };

    const response = await updateUser(selectedUser?.id, updatedUserData);
    if (response.success) {
      setSuccess("User updated successfully.");
      updateUserData(selectedUser);
    } else {
      setError("User update failed.");
    }
    setLoading(false);
  };

  return (
    <SideBar isOpen={isSidebarOpen} onClose={closeSidebar}>
      <div className={styles.updateStaff}>
        <h4>Update User</h4>
        <form onSubmit={handleUpdateUserSubmit}>
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

          <div className={styles.inputControl}>
            <label>User ID:</label>
            <input
              type="text"
              value={selectedUser?.id || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, id: e.target.value })
              }
              readOnly
            />
          </div>
          <div className={styles.inputControl}>
            <label>First Name:</label>
            <input
              type="text"
              value={selectedUser?.first_name || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, first_name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputControl}>
            <label>Middle Name:</label>
            <input
              type="text"
              value={selectedUser?.middle_name || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  middle_name: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.inputControl}>
            <label>Last Name:</label>
            <input
              type="text"
              value={selectedUser?.last_name || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, last_name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputControl}>
            <label>Email:</label>
            <input
              type="text"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.inputControl}>
            <label>Date of Birth:</label>
            <input
              type="date"
              value={formatDateToInput(selectedUser?.date_of_birth) || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  date_of_birth: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.inputControl}>
            <label>Gender:</label>
            <select
              type="text"
              value={(selectedUser?.gender || "").toLowerCase()}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className={styles.inputControl}>
            <label>Status:</label>
            <select
              type="text"
              value={selectedUser?.status || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, status: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className={styles.inputControl}>
            <label>Phone:</label>
            <input
              type="tel"
              value={selectedUser?.phone || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />
          </div>
          <div className={styles.inputControl}>
            <label>Second Phone:</label>
            <input
              type="tel"
              value={selectedUser?.second_phone || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  second_phone: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.actionButtons}>
            <button type="submit">{loading ? "Processing" : "Save"}</button>
            <button type="button" onClick={closeSidebar}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
}

export default UpdateUser;
