// LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.css"; // Import the CSS for animations

const LoadingSpinner = ({ size = 50, color = "className", message = "" }) => {
  return (
    <div className={styles.loadingContainer}>
      <div
        className={styles.loadingSpinner}
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent transparent transparent`,
        }}
      ></div>
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
