import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import UsersTable from "./UsersTable";
import AddUser from "../../AddUser";

function Admin({
  users,
  addUser,
  updateUserData,
  removeUser,
  loading,

  isAddUserOpen,
  openAddUser,
  closeAddUser,
}) {
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
              <button onClick={openAddUser}>Add User</button>
            </div>
            <UsersTable
              loading={loading}
              users={users}
              addUser={addUser}
              updateUserData={updateUserData}
              removeUser={removeUser}
            />
          </div>
        </div>
      )}

      {isAddUserOpen && (
        <AddUser
          isAddUserOpen={isAddUserOpen}
          openAddUser={openAddUser}
          closeAddUser={closeAddUser}
          addUser={addUser}
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
// import AddUser from "../../AddUser";

// function Admin({ allUsers, getAllUsers }) {
//   const [users, setUsers] = useState(allUsers || []);
//   const [loading, setLoading] = useState(false);
//   const [isSignupOpen, setIsSignupOpen] = useState(false);

//   useEffect(() => {
//     setUsers(allUsers); // Sync with updated allUsers from props
//   }, [allUsers]);

//   // Function to add a new user to the list and refresh data
//   const addUser = async (newUser) => {
//     setUsers((prevUsers) => [...prevUsers, newUser]); // ✅ Append new user

//     try {
//       const updatedUsers = await getAllUsers(); // ✅ Fetch fresh data
//       setUsers(updatedUsers); // ✅ Ensure latest data is used
//     } catch (error) {
//       console.error("Error refreshing users after adding:", error);
//     }
//   };

//   // Function to update a user in the list
//   const updateUser = async (updatedUser) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
//     );

//     try {
//       const updatedUsers = await getAllUsers(); // ✅ Fetch latest data
//       setUsers(updatedUsers);
//     } catch (error) {
//       console.error("Error refreshing users after updating:", error);
//     }
//   };

//   // Function to remove a user
//   const removeUser = async (userId) => {
//     await getAllUsers(); // ✅ Refetch users from API
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
//         <div className={styles.adminPage}>
//           <h3>Admin</h3>

//           <div>
//             <div className={styles.adminHeader}>
//               <p>All Application Users</p>
//               <button onClick={openSignup}>Add User</button>
//             </div>
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
