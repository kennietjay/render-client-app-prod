import React from "react";
import styles from "../ProfileStyles/ProfileHome.module.css";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

function BioHeader(props) {
  const { user } = useAuth();

  const currentUser = user ? user : <p>Check name</p>;

  return (
    <div>
      <div className={styles.profileNav}>
        <div className={styles.panel}>
          {currentUser && (
            <div className={styles.userHeading}>
              <h1>
                {currentUser.first_name} {currentUser.middle_name}{" "}
                {currentUser.last_name}
              </h1>
              <p>{currentUser.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BioHeader;
