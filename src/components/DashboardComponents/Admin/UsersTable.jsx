import React, { useEffect, useState } from "react";
import styles from "./UsersTable.module.css";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import SmallModal from "../../SmallModal";
import { useAuth } from "../../../context/AuthContext";
import UpdateUser from "./UpdateUser";
import { Alert } from "react-bootstrap";
import LoadingSpinner from "../../LoadingSpinner";

const UsersTable = ({ handleCustomerSelect, handleCustomerSubMenuClick }) => {
  const { allUsers } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const [isSmallModalOpen, setSmallModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
  });

  const openSmallModal = (user) => {
    setSmallModalOpen(true);
    setSelectedUser(user);
  };

  const closeSmallModal = () => {
    setSmallModalOpen(false);
    setSelectedUser(null);
  };

  const openSidebar = (user) => {
    setIsSideBarOpen(true);
    setSelectedUser(user);
    console.log(user);
  };

  const closeSidebar = () => {
    setSelectedUser(null);
    setIsSideBarOpen(false);
  };

  const handleChange = (e) => {
    //
    const { name, value } = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  //
  const [currentPage, setCurrentPage] = useState(1);
  const UsersPerPage = 10;

  const totalPages = Math.ceil(allUsers?.length / UsersPerPage);
  const indexOfLastUser = currentPage * UsersPerPage;
  const indexOfFirstUser = indexOfLastUser - UsersPerPage;
  const currentUsers = allUsers?.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.tableRoot}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>ID</th>
            <th className={styles.tableHeadCell}>Name</th>
            <th className={styles.tableHeadCell}>Phone</th>
            <th className={styles.tableHeadCell}>Email</th>
            <th className={styles.tableHeadCell}>Status</th>
            <th className={styles.tableHeadCell}>Role</th>
            <th className={`${styles.tableHeadCell} `}>Act</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {currentUsers?.map((user) => (
            <tr key={user?.id} className={styles.tableRow}>
              {/* ID */}
              <td className={styles.tableCell}>{user?.id || "N/A"}</td>
              {/* Name */}
              <td className={styles.tableCell}>
                <Link onClick={() => openSidebar(user)}>
                  {`${user?.first_name || "Unknown"} ${user?.last_name || ""}`}
                </Link>
              </td>

              {/* Phone */}
              <td className={styles.tableCell}>{user?.email || "N/A"}</td>

              <td className={styles.tableCell}>{user?.phone || "N/A"}</td>

              {/* Status */}
              <td className={styles.tableCell}>
                {user.status ? (
                  <div className={styles.statusWrapper}>
                    <div
                      className={`${styles.statusDot} ${
                        user.status === "active"
                          ? styles.statusActive
                          : user?.status === "inactive"
                          ? styles.statusInactive
                          : user?.status === "on_leave"
                          ? styles.statusOnLeave
                          : user?.status === "terminated"
                          ? styles.statusTerminated
                          : styles.statusUnknown
                      }`}
                    ></div>
                    {capitalizeWords(user.status)}
                  </div>
                ) : (
                  "N/A"
                )}
              </td>

              {/* Role */}
              <td className={styles.tableCell}>
                {user?.roles?.length > 0
                  ? capitalizeWords(
                      user.roles.map((role) => role.name).join(", ")
                    )
                  : "No roles"}
              </td>

              {/* Actions */}
              <td className={styles.tableCell}>
                <button
                  className={styles.iconButton}
                  onClick={() => openSmallModal(user)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {/* Pagination */}
          <tr>
            <td colSpan="7" className={`${styles.paginationCell}`}>
              {/* Uncomment and use the pagination logic as needed */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Small Modal for Activating/Deactivating Accounts */}
      {isSmallModalOpen && (
        <SmallModal
          isOpen={isSmallModalOpen}
          onClose={closeSmallModal}
          formData={formData}
          handleChange={handleChange}
        >
          <View
            formData={formData}
            selectedUser={selectedUser}
            handleChange={handleChange}
          />
        </SmallModal>
      )}

      {isSidebarOpen && (
        <UpdateUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />
      )}
    </div>
  );
};

export default UsersTable;

function View({ selectedUser }) {
  const [isStatusChnage, setIsStatusChnage] = useState(false);
  const [isPasswordChnage, setIsPasswordChnage] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editPassword, setEditPassword] = useState({
    password: "",
    confirm_password: "",
  });
  const [editStatus, setEditStatus] = useState({
    status: "",
  });

  const handleChangeStatus = (e) => {
    const { name, value } = e.target;
    setEditStatus({ ...editStatus, [name]: value });
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setEditPassword({ ...editPassword, [name]: value });
  };

  const openPasswordChange = () => {
    setIsPasswordChnage(true);
  };
  const closePasswordChange = () => {
    setIsPasswordChnage(false);
  };

  const openStatusChange = () => {
    setIsStatusChnage(true);
  };
  const closeStatusChange = () => {
    setIsStatusChnage(false);
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
        <div>
          <div className={styles.manageUser}>
            <p>Manage User: {selectedUser.first_name}</p>
            <div>
              <button onClick={openStatusChange}>Manage User Status</button>
              <button onClick={openPasswordChange}>Change User Password</button>
            </div>
          </div>
          {isPasswordChnage && (
            <ChangePassword
              isPasswordChnage={isPasswordChnage}
              closePasswordChange={closePasswordChange}
              selectedUser={selectedUser}
              handleChangePassword={handleChangePassword}
              editPassword={editPassword}
              setEditPassword={setEditPassword}
            />
          )}
          {isStatusChnage && (
            <ManageStatus
              isStatusChnage={isStatusChnage}
              closeStatusChange={closeStatusChange}
              selectedUser={selectedUser}
              handleChangeStatus={handleChangeStatus}
              setEditStatus={setEditStatus}
              editStatus={editStatus}
            />
          )}
        </div>
      )}
    </>
  );
}

function ManageStatus({
  selectedUser,
  isStatusChnage,
  closeStatusChange,
  handleChangeStatus,
  editStatus,
  // handeleStatusSubmit,
}) {
  const { updateUser } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handeleStatusSubmit = async (e) => {
    e.preventDefault();

    if (!editStatus.status) {
      alert("Status field is required.");
    }

    const newStatus = {
      status: editStatus.status,
      customer_id: selectedUser?.customer_id,
    };

    setLoading(true);
    try {
      console.log(newStatus);
      const response = await updateUser(selectedUser?.id, newStatus);

      if (response.success) {
        setSuccess(`User status changed successfully.`);
      } else {
        setError("Status change failed. Try again!");
      }
    } catch (error) {
      setError(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }

    console.log(editStatus);
  };

  return (
    <div>
      <SmallModal isOpen={isStatusChnage} onClose={closeStatusChange}>
        <form onSubmit={handeleStatusSubmit}>
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
          <div>
            <p>
              Changing status for user:{" "}
              <strong>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </strong>
            </p>
            <p>
              Current Status: {capitalizeWords(selectedUser?.status || "N/A")}
            </p>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputControl}>
              <label htmlFor="status">Status</label>
              <select
                type="text"
                id="status"
                name="status"
                value={editStatus?.status || ""}
                onChange={handleChangeStatus}
              >
                <option>Select</option>
                <option value="active">Activate</option>
                <option value="inactive">Deactivate</option>
                <option value="terminated">Terminate</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <button type="submit">{loading ? "Processing" : "Save"}</button>
          </div>
        </form>
      </SmallModal>
    </div>
  );
}

function ChangePassword({
  selectedUser,
  isPasswordChnage,
  closePasswordChange,
  handleChangePassword,
  editPassword,
}) {
  const { changePassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handelePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!editPassword.password || !editPassword.confirm_password) {
      alert("All fields are require");
      return;
    }

    if (editPassword.password !== editPassword.confirm_password) {
      alert("New passwords do not match.");
      return;
    }

    const newPassword = {
      password: editPassword?.password,
      customer_id: selectedUser?.customer_id,
    };

    setLoading(true);
    try {
      console.log(newPassword);
      const response = await changePassword(newPassword);

      if (response.success) {
        setSuccess("Password changed successfully.");
      } else {
        setError("Password changed failed");
      }
    } catch (error) {
      setError(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SmallModal isOpen={isPasswordChnage} onClose={closePasswordChange}>
        <form onSubmit={handelePasswordSubmit}>
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
          <div>
            <p>
              Update password for user:{" "}
              <strong>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </strong>
            </p>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputControl}>
              <label htmlFor="status">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={editPassword?.password || ""}
                placeholder="Type new password"
                onChange={handleChangePassword}
              />
            </div>
            <div className={styles.inputControl}>
              <label htmlFor="status">Confirma New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={editPassword?.confirm_password || ""}
                placeholder="Confirm new password"
                onChange={handleChangePassword}
              />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Processing" : "Save"}
          </button>
        </form>
      </SmallModal>
    </div>
  );
}
