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
  const [users, setUsers] = useState(allUsers);
  const [loading, setLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Update the local state when `allUsers` changes
  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  // Function to add a new user to the list
  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  // Function to update a user in the list
  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  // Function to remove a user from the list
  const removeUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  //
  const openSignup = () => {
    setIsSignupOpen(true);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  //
  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.customerPage}>
          <h3>Admin</h3>

          <div>
            <p>All Application Users</p>

            <button onClick={openSignup}>Add User</button>

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
          addUser={addUser} // Pass the addUser function to AddUser
        />
      )}
    </>
  );
}

export default Admin;

//
// import React, { useEffect, useState } from "react";
// import styles from "./Admin.module.css";
// import LoadingSpinner from "../../LoadingSpinner";
// import UsersTable from "./UsersTable";
// import { useAuth } from "../../../context/AuthContext";
// import AddUser from "../../AddUser";

// function Admin({
//   handleCustomerSubMenuClick,
//   customers,
//   handleCustomerSelect,
// }) {
//   const { allUsers, getAllUsers } = useAuth();
//   const [users, setUsers] = useState(allUsers);
//   const [loading, setLoading] = useState(false);
//   const [isSignupOpen, setIsSignupOpen] = useState(false);

//   // Fetch users when the component mounts
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       await getAllUsers();
//       setLoading(false);
//     };
//     fetchUsers();
//   }, [getAllUsers]);

//   // Sync users with the latest allUsers
//   useEffect(() => {
//     setUsers(allUsers);
//   }, [allUsers]);

//   // // Function to add a new user to the list
//   // const addUser = (newUser) => {
//   //   setUsers((prevUsers) => [...prevUsers, newUser]);
//   // };

//   // // Function to remove a user from the list
//   // const removeUser = (userId) => {
//   //   setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//   // };

//   // Function to add a new user to the list and refresh data
//   const addUser = async (newUser) => {
//     await getAllUsers(); // Fetch updated user list after adding
//   };

//   // Function to update a user in the list
//   const updateUser = (updatedUser) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
//     );
//   };

//   // Function to remove a user
//   const removeUser = async (userId) => {
//     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//   };

//   // Open and close modal
//   const openSignup = () => setIsSignupOpen(true);
//   const closeSignup = () => setIsSignupOpen(false);

//   //
//   return (
//     <>
//       {loading ? (
//         <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
//       ) : (
//         <div className={styles.customerPage}>
//           <h3>Admin</h3>

//           <div>
//             <p>All Application Users</p>

//             <button onClick={openSignup}>Add User</button>

//             <UsersTable
//               loading={loading}
//               users={users}
//               addUser={addUser}
//               updateUser={updateUser}
//               removeUser={removeUser}
//               isSignupOpen={isSignupOpen}
//               closeSignup={closeSignup}
//             />
//           </div>
//         </div>
//       )}

//       {/* AddUser modal must be outside to prevent nesting issues */}
//       {isSignupOpen && (
//         <AddUser
//           isSignupOpen={isSignupOpen}
//           closeSignup={closeSignup}
//           addUser={addUser}
//         />
//       )}
//     </>
//   );
// }

// export default Admin;
