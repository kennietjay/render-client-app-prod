import React from "react";
import styles from "./Statements.module.css";

function Statements({ payments, loanId }) {
  if (!Array.isArray(payments) || payments.length === 0) {
    return <div>No payment data available</div>;
  }

  // ---- Utilities ------------------------------------------------------------
  const pickFirst = (...vals) =>
    vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "");
  const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const fmtCurrency = (amount) => `NLe ${toNumber(amount).toFixed(2)}`;
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Always work with the payments sorted by date asc
  const sorted = [...payments].sort(
    (a, b) =>
      new Date(a?.transaction_date || a?.date) -
      new Date(b?.transaction_date || b?.date)
  );

  const firstPayment = sorted[0];
  const lastPayment = sorted[sorted.length - 1];
  const firstDate = firstPayment?.transaction_date || firstPayment?.date;
  const lastDate = lastPayment?.transaction_date || lastPayment?.date;

  // ---- Extract loan / customer / user / contactDetails with fallbacks -------
  const loan = firstPayment?.loan || null;
  const customer = loan?.customer || firstPayment?.customer || null; // prefer via loan
  const user = customer?.user || null;

  // ContactDetails may live under customer.contactDetails; sometimes address is a nested object on customer
  const contact = customer?.contactDetails || null;
  const addressObj = customer?.address || null; // { address, city, district, section, chiefdom, ... }

  // IDs
  const loanNumber = pickFirst(
    loan?.loan_id,
    loanId,
    firstPayment?.loan_id,
    "—"
  );
  const customerId = pickFirst(
    loan?.customer_id,
    customer?.customer_id,
    firstPayment?.customer_id,
    "—"
  );

  // Name -> prefer User; then loan.full_name; then “Customer #ID”
  const fullName =
    pickFirst(
      [user?.first_name, user?.middle_name, user?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim(),
      loan?.full_name
    ) || `Customer #${customerId}`;

  // Phone / email -> prefer ContactDetails, then User
  const phone = pickFirst(contact?.phone, user?.phone);
  const email = pickFirst(contact?.email, user?.email);

  // Address — prefer ContactDetails (addressLine1/address), then parts from customer.address
  const street = pickFirst(
    contact?.addressLine1,
    contact?.address,
    addressObj?.address
  );
  const city = pickFirst(contact?.city, addressObj?.city);
  const postal = pickFirst(
    contact?.postal_code,
    contact?.zip,
    contact?.zipCode
  );

  const addressLine1 = [street].filter(Boolean).join(", ");
  const addressLine2 = [city, postal].filter(Boolean).join(", ");
  const addressLine3 = [contact?.country].filter(Boolean).join(", ");
  const addressString = [addressLine1, addressLine2, addressLine3]
    .filter(Boolean)
    .join(", ");

  // Totals
  const totalAmount = sorted.reduce((sum, p) => sum + toNumber(p.amount), 0);

  return (
    <div id="print-root" className={styles.statement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.companyInfo}>
          <h2>EasyLife Microfinance Ltd</h2>
          <p>Kenema Shopping Plaza, Kenema</p>
          <p>Sierra Leone | Phone: +232 76 726824</p>
        </div>
        <div className={styles.statementTitle}>
          <h1>LOAN PAYMENT STATEMENT</h1>
          <p>Statement Date: {fmtDate(new Date())}</p>
        </div>
      </div>

      {/* Customer Details (uniform, no card) */}
      <section className={styles.customerInfo}>
        <div className={styles.companyInfo}>
          <h2>{fullName}</h2>
          <div className={styles.infoRow}>
            <p>
              <strong>Phone: </strong> {phone || "—"}
            </p>
            <p>
              <strong>Email: </strong> {email || "—"}
            </p>
            {addressString && (
              <p>
                <strong>Address: </strong> {addressString}
              </p>
            )}
          </div>
        </div>

        {/*  */}
        <div className={styles.companyInfo}>
          <div className={styles.infoRow}>
            <h2>Loan ID: {loanNumber}</h2>
          </div>
          <p>
            <strong>Customer Number: </strong> {customerId}
          </p>
          <div className={styles.infoRow}>
            <p>
              <strong>Statement Period: </strong> {fmtDate(firstDate)} –{" "}
              {fmtDate(lastDate)}
            </p>
            <p>
              <strong>Loan Status: </strong> {loan?.status || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className={styles.summary}>
        <h3>Account Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span>Total Payments Made:</span>
            <strong>{fmtCurrency(totalAmount)}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Current Balance:</span>
            <strong>{fmtCurrency(lastPayment?.balance_after)}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Number of Payments:</span>
            <strong>{sorted.length}</strong>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className={styles.paymentSection}>
        <h3>Payment History</h3>
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Remarks</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <tr key={p.id || p.transaction_id || idx}>
                <td>{fmtDate(p.transaction_date || p.date)}</td>
                <td className={styles.mono}>{p.transaction_id || "—"}</td>
                <td className={styles.amount}>{fmtCurrency(p.amount)}</td>
                <td>{p.payment_method || "—"}</td>
                <td>{p.remarks || "—"}</td>
                <td className={styles.amount}>
                  {fmtCurrency(p.balance_after)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Total Amount Paid:</span>
          <strong>{fmtCurrency(totalAmount)}</strong>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.paymentInstructions}>
          <h4>Payment Instructions</h4>
          <p>Please make payments to:</p>
          <p>
            <strong>EasyLife Microfinance Ltd</strong>
            <br />
            Kenema Shopping Plaza, Kenema.
            <br />
            Sierra Leone
          </p>
        </div>

        <div className={styles.notes}>
          <h4>Important Notes</h4>
          <p>
            • Payments made after statement date will appear on next statement
          </p>
          <p>• Contact customer service for any inquiries</p>
          <p>• Keep this statement for your records</p>
        </div>
      </div>

      <div className={styles.confidential}>
        <p>CONFIDENTIAL - For customer use only</p>
      </div>
    </div>
  );
}

export default Statements;
