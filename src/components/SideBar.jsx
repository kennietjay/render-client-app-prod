import React from "react";
import styles from "./SideBar.module.css"; // Import the CSS module

const SideBar = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ""}`}
      onClick={closeModal} // Close sidebar on overlay click
    >
      <div
        className={`${styles.modalContent} ${isOpen ? styles.slideIn : ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        {children}
      </div>
    </div>
  );
};

export default SideBar;
