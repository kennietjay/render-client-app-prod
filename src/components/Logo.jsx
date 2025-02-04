import React from "react";
import styles from "./Logo.module.css";

function Logo(props) {
  return (
    <div className={styles.logoContainer}>
      <img
        src="/images/logos/easylife_logo.png"
        alt="Easy Life Microfinance SL Ltd logo."
      />
      <div>
        Easy Life <br /> Microfinance
      </div>
    </div>
  );
}

export default Logo;
