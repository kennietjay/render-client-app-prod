import React, { useState } from "react";
import styles from "./TransferTable.module.css";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import SideBar from "../../SideBar";
import formatDateAndTime from "/utils/formatDateAndTime";

const TransferTable = ({ transferData }) => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transfersPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(transferData?.length / transfersPerPage);
  const indexOfLastTransfer = currentPage * transfersPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
  const currentTransfers = transferData?.slice(
    indexOfFirstTransfer,
    indexOfLastTransfer
  );

  const openModal = (transfer) => {
    setIsSidebarOpen(transfer);
    setSelectedTransfer(transfer);
  };
  const closeModal = () => {
    setSelectedTransfer(null);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.tableRoot}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeadCell}>ID</th>
              <th className={styles.tableHeadCell}>Date</th>
              <th className={styles.tableHeadCell}>Transfer Pin</th>
              <th className={styles.tableHeadCell}>Amount (Currency)</th>
              <th className={styles.tableHeadCell}>Equivalent (NLe)</th>
              <th className={styles.tableHeadCell}>Sender</th>
              <th className={styles.tableHeadCell}>Receiver</th>
              <th className={styles.tableHeadCell}>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {currentTransfers.map((transfer) => {
              const { formattedDate, formattedTime } = formatDateAndTime(
                transfer?.transfer_date
              );

              return (
                <tr key={transfer.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{transfer?.id}</td>
                  <td className={styles.tableCell}>
                    <div>{formattedDate}</div>
                    <span>{formattedTime}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.viewLink}`}>
                    <Link onClick={() => openModal(transfer)}>
                      {transfer?.transfer_pin}
                    </Link>
                  </td>
                  <td
                    className={styles.tableCell}
                  >{`${transfer?.amount} ${transfer?.foreign_currency}`}</td>
                  <td
                    className={styles.tableCell}
                  >{`NLe ${transfer.local_currency.toLocaleString()}`}</td>
                  <td className={styles.tableCell}>{transfer?.sender_name}</td>
                  <td className={styles.tableCell}>
                    {transfer?.receiver_name}
                  </td>
                  <td className={styles.tableCell}>{transfer.status}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="8" className={`${styles.paginationCell}`}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isSidebarOpen && (
        <ManageTransferDetails
          transfer={selectedTransfer}
          isSidebarOpen={isSidebarOpen}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default TransferTable;

function ManageTransferDetails({ transfer, isSidebarOpen, closeModal }) {
  const { formattedDate: transferDate } = formatDateAndTime(
    transfer.transfer_date
  );

  return (
    <div className={styles.manageLoan}>
      <SideBar isOpen={isSidebarOpen} closeModal={closeModal}>
        <h3 className={styles.sideBarHeader}>Loan Details</h3>
        {transfer ? (
          <div className={styles.sideBarContainer}>
            <div className={styles.viewLoanContent}>
              <div className={styles.viewLoanDetails}>
                <div>
                  <p>
                    <strong>ID:</strong> {transfer?.id}
                  </p>
                  <p>
                    <strong>Transfer Pin:</strong> {transfer?.transfer_pin}
                  </p>
                  <p>
                    <strong>Amount:</strong> {transfer?.amount}
                  </p>
                  <p>
                    <strong>Transfer Date:</strong> {transfer.foreign_currency}
                  </p>
                  <p>
                    <strong>Local Currency:</strong> {transfer.local_currency}
                  </p>
                  <p>
                    <strong>Transfer Date:</strong> {transferDate}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Sender Name:</strong> {transfer?.sender_name}
                  </p>
                  <p>
                    <strong>Send From:</strong> {transfer?.sender_country}
                  </p>
                  <p>
                    <strong>Send From:</strong> {transfer?.sender_city}
                  </p>
                  <p>
                    <strong>Phone:</strong> {transfer?.sender_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {transfer?.sender_email}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Receiver Name:</strong> {transfer?.receiver_name}
                  </p>
                  <p>
                    <strong>Receiver From:</strong> {transfer?.receiver_country}
                  </p>
                  <p>
                    <strong>Receiver From:</strong> {transfer?.receiver_city}
                  </p>
                  <p>
                    <strong>Phone:</strong> {transfer?.receiver_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {transfer?.receiver_email}
                  </p>
                </div>
              </div>

              <div>{/* <LoanApproval transfer={transfer} /> */}</div>
            </div>
          </div>
        ) : (
          <p>No data selected.</p>
        )}
      </SideBar>
    </div>
  );
}
