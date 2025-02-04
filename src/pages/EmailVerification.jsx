import React from "react";
import { Link } from "react-router-dom";

function EmailVerification(props) {
  return (
    <div className={`${"container"} ${"emailVerification"}`}>
      <img src="/easylife_logo.png" alt="Easy life microfinance logo" />
      <h3>Sign Up Confirmation.</h3>
      <p>Your email has been verified successfully.</p>
      <Link to="/auth/signin">Click here to sign in</Link>
    </div>
  );
}

export default EmailVerification;
