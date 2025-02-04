import React from "react";
import styles from "./Modal.module.css"; // Import the CSS module

const Modal = ({ isOpen, onClose, children, customClass }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${customClass || ""}`}
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className={`${styles.modal} ${customClass || ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
