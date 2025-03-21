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
