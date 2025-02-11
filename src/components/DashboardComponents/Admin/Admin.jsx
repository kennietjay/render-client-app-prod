import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import UsersTable from "./UsersTable";
import { useAuth } from "../../../context/AuthContext";

function Admin({
  handleCustomerSubMenuClick,
  customers,
  handleCustomerSelect,
}) {
  const { allUsers, getAllUsers } = useAuth();
  const [users, setUsers] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(allUsers);

  useEffect(() => {
    // async function fetchUsers() {
    //   await getAllUsers();
    // }
    // fetchUsers();
    setUsers(allUsers);
  }, [allUsers]);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.customerPage}>
          <h3>Admin</h3>

          <div>
            <p>All Application Users</p>
            <UsersTable users={users} loading={loading} />
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
