import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import UsersTable from "./UsersTable";
import { useAuth } from "../../../context/AuthContext";
import AddUser from "../../AddUser";

function Admin({
  handleCustomerSubMenuClick,
  customers,
  handleCustomerSelect,
}) {
  const { allUsers, getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      await getAllUsers();
      setLoading(false);
    };
    fetchUsers();
  }, [getAllUsers]);

  // Sync users with the latest allUsers
  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  // Function to add a new user to the list and refresh data
  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Add user instantly
    getAllUsers(); // ✅ Fetch latest users from backend
  };

  // Function to update a user in the list
  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  // Function to remove a user
  const removeUser = async (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  // Open and close modal
  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  //
  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.adminPage}>
          <h3>Admin</h3>

          <div>
            <div className={styles.adminHeader}>
              <p>All Application Users</p>
              <button onClick={openSignup}>Add User</button>
            </div>
            <UsersTable
              loading={loading}
              users={users}
              addUser={addUser}
              updateUser={updateUser}
              removeUser={removeUser}
              isSignupOpen={isSignupOpen}
              closeSignup={closeSignup}
            />
          </div>
        </div>
      )}

      {/* AddUser modal must be outside to prevent nesting issues */}
      {isSignupOpen && (
        <AddUser
          isSignupOpen={isSignupOpen}
          closeSignup={closeSignup}
          addUser={addUser}
        />
      )}
    </>
  );
}

export default Admin;
