import React from "react";
import styles from "./Statements.module.css"; // Adjust the import based on your file structure

function Statements() {
  return (
    <div className={styles.statement}>
      <h3>Loan Payment Statement</h3>

      <div className={styles.section}>
        <h4>Statement Details</h4>
        <p>
          <strong>Statement Period:</strong> December 13, 2006, to January 14,
          2007
        </p>
        <p>
          <strong>Customer Name:</strong> Commercial Loan Customer
        </p>
        <p>
          <strong>Customer ID:</strong> 80081839
        </p>
        <p>
          <strong>Loan Number:</strong> 700265862
        </p>
        <p>
          <strong>Statement Date:</strong> January 4, 2007
        </p>
        <p>
          <strong>Payment Due Date:</strong> January 14, 2007
        </p>
        <p>
          <strong>Amount Due:</strong> NLe 1,736.77
        </p>
      </div>

      <div className={styles.section}>
        <h4>Account Summary</h4>
        <p>
          <strong>Opening Loan Balance (12/01/2006):</strong> NLe 200,000.00
        </p>
        <p>
          <strong>Opening Interest (12/01/2006):</strong> NLe 270.11
        </p>
        <p>
          <strong>Interest Accrued (12/13/2006 to 01/14/2007):</strong> NLe
          1,466.66
        </p>
        <p>
          <strong>Interest Rate:</strong> 8.25%
        </p>
        <p>
          <strong>Days Accrued:</strong> 32
        </p>
        <p>
          <strong>Closing Loan Balance (01/14/2007):</strong> NLe 200,000.00
        </p>
        <p>
          <strong>Total Amount Due:</strong> NLe 1,736.77
        </p>
      </div>

      <div className={styles.section}>
        <h4>Payment Breakdown</h4>
        <table>
          <thead>
            <tr>
              <th>Loan #</th>
              <th>Current Principal</th>
              <th>Past Due Principal</th>
              <th>Current Interest/Fees</th>
              <th>Past Due Interest/Fees</th>
              <th>Total Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>700265862</td>
              <td>NLe 0.00</td>
              <td>NLe 0.00</td>
              <td>NLe 1,736.77</td>
              <td>NLe 0.00</td>
              <td>
                <strong>NLe 1,736.77</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h4>Payment Instructions</h4>
        <p>
          <strong>Amount Due:</strong> NLe 1,736.77
        </p>
        <p>
          <strong>Payment Due Date:</strong> January 14, 2007
        </p>
        <p>
          <strong>Refer Payment To:</strong>
        </p>
        <p>
          EasyLife Microfinance Ltd
          <br />
          P.O. Box 974675
          <br />
          Kenema, Nongowa Chiefdom
          <br />
          Sierra Leone
        </p>
      </div>

      <div className={styles.notes}>
        <h4>Important Notes</h4>
        <p>
          1. <strong>Activity After Statement Date:</strong> Any payments or
          transactions made after the statement date will appear on your next
          statement.
        </p>
        <p>
          2. <strong>Questions?</strong> Contact your client service
          professional or loan officer for assistance.
        </p>
      </div>
    </div>
  );
}

export default Statements;
