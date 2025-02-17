import React, { useEffect, useState } from "react";
import styles from "./Overview.module.css";
import YearlySalesChart from "../charts/YearlySalesChart";
import LoanOfficerMonthlySales from "../charts/LoanOfficerMonthlySales";
import CashFlowChart from "../charts/CashFlowChart";
import ServiceUsageChart from "../charts/ServiceUsageChart";
import LoadingSpinner from "../../LoadingSpinner";

import { useLoan } from "../../../context/LoanContext";

import { Link } from "react-router-dom";

const Overview = ({ staffProfile, loading, customers, transfers }) => {
  const { loans } = useLoan();

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.overviewContainer}>
          <header className={styles.header}>
            <div>
              <h3 className={styles.userName}>
                <strong>Welcome</strong>, {staffProfile?.user?.first_name}
              </h3>
            </div>
            <div className={styles.btns}>
              <Link to="/" className={styles.backBtn}>
                {" "}
                <i className="fa-solid fa-chevron-left"></i> Back
              </Link>
            </div>
          </header>
          <StatsOverview
            loans={loans}
            customers={customers}
            transfers={transfers}
          />
          <CashFlow transfers={transfers} loans={loans} />
          <SalesCharts loans={loans} />
        </div>
      )}
    </>
  );
};

export default Overview;

function StatsOverview({ customers, loans, transfers }) {
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [loanApplications, setLoanApplications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  // console.log(transfers);

  useEffect(() => {
    // Recalculate total when loans change
    setTotalLoanAmount(calculateTotalLoanAmount(loans));
    // console.log(customers);
  }, [loans, customers]);

  useEffect(() => {
    const pendingStatuses = ["applied", "processed", "processing"];

    // Filter loans by pending statuses
    const filteredLoans = filterLoansByStatus(loans, pendingStatuses);

    // Update pending loans and count
    setLoanApplications(filteredLoans);
    setPendingCount(filteredLoans.length);
  }, [loans]);

  // );
  const totalLocalCurrency = calculateTotalTransferAmount(
    transfers,
    "local_currency"
  );

  return (
    <div className={styles.statOverview}>
      <div className={styles.statContainer}>
        <div className={styles.statContent}>
          <div className={styles.statDetails}>
            <div>LOANS</div>
            <div className={styles.stat}>
              <p className={styles.stat}>NLe {totalLoanAmount}</p>
              <span className={styles.statPercentage}>+4.4%</span>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-dollar-sign"></i>
      </div>
      <div className={styles.statContainer}>
        <div className={styles.statContent}>
          <div className={styles.statDetails}>
            <div className={styles.statTitle}>CUSTOMERS</div>
            <div className={styles.stat}>
              <p>{customers?.length > 0 ? customers?.length : "No data"}</p>
              <span className={styles.statPercentage}>+7.14%</span>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-user-group"></i>
      </div>
      <div className={styles.statContainer}>
        <div className={styles.statContent}>
          <div className={styles.statDetails}>
            <div className={styles.statTitle}>APPLICATIONS</div>
            <div className={styles.stat}>
              <p>{pendingCount > 0 ? pendingCount : "No Data"}</p>
              <span className={styles.statPercentage}>+5.20%</span>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-money-bill-trend-up"></i>
      </div>
      <div className={styles.statContainer}>
        <div className={styles.statContent}>
          <div className={styles.statDetails}>
            <div className={styles.statTitle}>TRANSFERS</div>
            <div className={styles.stat}>
              <p className={styles.stat}>NLe {totalLocalCurrency}</p>
              <span className={styles.statPercentage}>+7.4%</span>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-rotate"></i>
      </div>
    </div>
  );
}

// Filtering Function
const filterLoansByStatus = (loans, statuses) => {
  return loans.filter((loan) => statuses.includes(loan.status));
};

//
const calculateTotalLoanAmount = (loans) => {
  return loans?.reduce(
    (total, loan) => total + (loan?.approved_amount || 0),
    0
  );
};

// Function to Calculate Total Transfer Amount
const calculateTotalTransferAmount = (transfers, currencyType = "amount") => {
  return transfers.reduce((total, transfer) => {
    // Ensure the field exists and convert to number
    const amount = parseFloat(transfer[currencyType]) || 0;
    return total + amount;
  }, 0);
};

//Sale Chart
function SalesCharts({ loans }) {
  // Process the loans data to get aggregated values and labels
  const colors = ["#4f6bd1", "#263c8d", "#9babe5", "#3656ca"];
  const { data, labels } = processData(loans);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridItem}>
        <YearlySalesChart />
      </div>
      <div className={styles.gridItem}>
        <LoanOfficerMonthlySales data={data} colors={colors} labels={labels} />
      </div>
    </div>
  );
}

// Process Data Function
const processData = (loans) => {
  const groupedData = loans.reduce((acc, loan) => {
    const { staff_id } = loan;
    acc[staff_id] = (acc[staff_id] || 0) + 1; // Increment loan count for each staff_id
    return acc;
  }, {});

  const data = Object.values(groupedData); // Aggregated loan counts
  const labels = Object.keys(groupedData); // Staff IDs as labels

  return { data, labels };
};

//Cash Flow Charts
function CashFlow({ transfers, loans }) {
  //
  return (
    <div className={styles.gridContainerReversed}>
      <div className={styles.gridItem}>
        <ServiceUsageChart />
      </div>
      <div className={styles.gridItem}>
        <CashFlowChart transfers={transfers} loans={loans} />
      </div>
    </div>
  );
}
