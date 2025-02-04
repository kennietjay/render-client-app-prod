import React from "react";
import styles from "./Reports.module.css";

function Reports(props) {
  return (
    <div className={styles.reportPage}>
      <h3>Reports Page</h3>
      <ul>
        <li>
          <button>Payment Statements</button>
        </li>
        <li>
          <button>Loan Summary</button>
        </li>
        <li>
          <button>Others</button>
        </li>
      </ul>
    </div>
  );
}

export default Reports;
