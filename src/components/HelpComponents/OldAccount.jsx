import React from "react";
import styles from "../../pages//Profile.module.css";
import { useUser } from "../../contexts/UserContext";
// import Demographics from "./Demographics";
// import Trustee from "./Trustee";
// import Business from "./Business";

function Accounts() {
  const { profile } = useUser();
  console.log(profile);
  return (
    <div className={styles.accountContainer}>
      <h4>Account Information</h4>
      <Overview profile={profile} />
    </div>
  );
}

export default Accounts;

function Overview({ profile }) {
  console.log(profile.verified);

  const accountStatus = profile.verified === false ? "Unverified" : "Active";

  function maskPassword(password) {
    // Limit the length to 10 dots
    const maxLength = 10;
    return ".".repeat(Math.min(password.length, maxLength));
  }

  return (
    <div className={styles.formContainer}>
      <h4>Account Overview</h4>
      <div className={styles.contactDetails}>
        <div className={styles.tableContainer}>
          <table className="table">
            <thead className={styles.tableHead}>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {profile && (
                <tr>
                  <td>{profile.user_name}</td>
                  <td>{profile.email}</td>
                  <td>{maskPassword(profile.password)}</td>
                  <td>{accountStatus}</td>
                  <td>
                    <i className="fa-solid fa-gear"></i>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
