import React from "react";
import styles from "./SignupResponse.module.css";
import SmallModal from "../components/SmallModal";

function SignupResponse({
  onSignIn,
  onClose,
  message,
  openModal,
  isSignupResponse,
  closeResponse,
}) {
  const startLoanApplication = () => {
    closeResponse();
    openModal();
  };

  return (
    <SmallModal isOpen={isSignupResponse}>
      <div className={styles.responseContainer}>
        <div className={styles.responseBox}>
          <img
            src="/images/logos/easylife_logo.png"
            alt="Success Icon"
            className={styles.successIcon}
          />
          <h2 className={styles.responseTitle}>Signup Successful!</h2>
          <p className={styles.responseMessage}>
            {message || "Thank you for signing up. Start a loan application."}
          </p>
          <div className={styles.responseActions}>
            {/* <button onClick={onSignIn}>Go to Sign In</button> */}
            <button onClick={startLoanApplication}>
              Start Loan Application
            </button>
          </div>
        </div>
      </div>
    </SmallModal>
  );
}

export default SignupResponse;
