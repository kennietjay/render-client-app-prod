import React, { useState, useEffect } from "react";
import styles from "./MoneyTransfer.module.css";
import TransferTable from "./TransferTable";
import MoneyTransferForm from "./MoneyTransferForm";
import LoadingSpinner from "../../LoadingSpinner";

function MoneyTransfer({ transfers, loading }) {
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);

  const openModal = () => setIsSmallModalOpen(true);
  const closeModal = () => setIsSmallModalOpen(false);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.moneyTransfer}>
          <div className={styles.btns}>
            <h3>Money Transfers</h3>
            <button className={styles.apply} onClick={openModal}>
              Add Transfer
            </button>
          </div>
          <TransferTable transferData={transfers} />

          {isSmallModalOpen && (
            <MoneyTransferForm
              isSmallModalOpen={isSmallModalOpen}
              closeModal={closeModal}
            />
          )}
        </div>
      )}
    </>
  );
}

export default MoneyTransfer;
