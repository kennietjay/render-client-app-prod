import React from "react";
import styles from "./SideBarMedium.module.css"; // Import the CSS module

const SideBar = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ""}`}
      onClick={closeModal}
    >
      <div
        className={`${styles.modalContent} ${isOpen ? styles.slideIn : ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default SideBar;
