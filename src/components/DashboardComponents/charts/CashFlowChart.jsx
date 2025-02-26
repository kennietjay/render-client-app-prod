import React, { useEffect, useState } from "react";
import styles from "../Overview/Overview.module.css";
import { useTransaction } from "../../../context/TransactionContext";

const DualLineChart = ({ loans }) => {
  // const { payments, getPayments } = useTransaction();
  const { payments, getPayments } = useTransaction(); // Ensure you have a function to fetch payments
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const year = 2025;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ✅ Fetch payments when the component mounts
  useEffect(() => {
    if (!payments || payments.length === 0) {
      getPayments().then(() => setIsDataLoaded(true));
    } else {
      setIsDataLoaded(true);
    }
  }, [payments, getPayments]);

  // ✅ Don't render chart until payments data is available
  if (!isDataLoaded) return <p>Loading Chart...</p>;

  // Calculate totals for the specified year
  const loansGiven = calculateMonthlyLoanTotals(loans, year);
  const monthlyPayments = calculateMonthlyPaymentTotals(payments, year);

  // Calculate the dynamic max value based on the data
  const dataMaxValue = Math.max(
    ...loansGiven,
    ...monthlyPayments,
    0 // Ensure no negative values
  );

  // Adjust maxValue dynamically with a buffer for visualization
  const maxValue = Math.ceil((dataMaxValue + 5000) / 5000) * 5000; // Round up to nearest 5000
  const minValue = 0;

  const chartHeight = 200; // Fixed chart height
  const chartWidth = 600; // Chart width
  const pointSpacing = chartWidth / (months.length - 1); // Space between points

  return (
    <div className={`${styles.chartContainer} `}>
      {/* Chart Title */}
      <h3 className={styles.title}>Monthly Sales Data</h3>

      {/* Legend */}
      <div className={styles.legendContainer}>
        <div className={styles.legendContent}>
          <div
            className={styles.legend}
            style={{
              backgroundColor: "#314db6",
            }}
          ></div>
          <span className={styles.legendLabel}>Loans Given</span>
        </div>
        <div className={styles.legendContent}>
          <div
            className={styles.legend}
            style={{
              backgroundColor: "#ff7f0e",
            }}
          ></div>
          <span className={styles.legendLabel}>Payments Received</span>
        </div>
      </div>
      {/*  */}
      <div className={`${styles.chartContent} ${styles.lineChartContainer}`}>
        <svg
          width="100%"
          height={chartHeight + 50}
          viewBox={`0 0 ${chartWidth + 50} ${chartHeight + 50}`}
          className={styles.chartSvg}
        >
          {/* Vertical (Y-axis) Legend */}
          {Array.from(
            { length: 6 },
            (_, i) => minValue + (i * (maxValue - minValue)) / 5
          ).map((value, index) => (
            <g key={index}>
              {/* Grid Line */}
              <line
                x1="50"
                x2={chartWidth + 50}
                y1={
                  chartHeight -
                  ((value - minValue) / (maxValue - minValue)) * chartHeight +
                  20
                }
                y2={
                  chartHeight -
                  ((value - minValue) / (maxValue - minValue)) * chartHeight +
                  20
                }
                stroke="#ddd"
                strokeWidth="1"
                strokeDasharray="4"
              />
              {/* Label */}
              <text
                x="40"
                y={
                  chartHeight -
                  ((value - minValue) / (maxValue - minValue)) * chartHeight +
                  24
                }
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                ${value.toLocaleString()}
              </text>
            </g>
          ))}

          {/* X-axis (Months) */}
          <line
            x1="50"
            y1={chartHeight + 20}
            x2={chartWidth + 50}
            y2={chartHeight + 20}
            stroke="#aaa"
            strokeWidth="1"
          />
          {months.map((month, index) => (
            <text
              key={index}
              x={50 + index * pointSpacing}
              y={chartHeight + 40}
              fontSize="10"
              fill="#666"
              textAnchor="middle"
            >
              {month}
            </text>
          ))}

          {/* Loans Given Line */}
          <polyline
            fill="none"
            stroke="#314db6"
            strokeWidth="2"
            points={loansGiven
              .map(
                (value, index) =>
                  `${50 + index * pointSpacing},${
                    chartHeight -
                    ((value - minValue) / (maxValue - minValue)) * chartHeight +
                    20
                  }`
              )
              .join(" ")}
          />

          {/* Payments Received Line */}
          <polyline
            fill="none"
            stroke="#ff7f0e"
            strokeWidth="2"
            points={monthlyPayments
              .map(
                (value, index) =>
                  `${50 + index * pointSpacing},${
                    chartHeight -
                    ((value - minValue) / (maxValue - minValue)) * chartHeight +
                    20
                  }`
              )
              .join(" ")}
          />

          {/* Data Points for Loans Given */}
          {loansGiven.map((value, index) => (
            <circle
              key={`loans-${index}`}
              cx={50 + index * pointSpacing}
              cy={
                chartHeight -
                ((value - minValue) / (maxValue - minValue)) * chartHeight +
                20
              }
              r="4"
              fill="#314db6"
              stroke="#fff"
              strokeWidth="1"
            />
          ))}

          {/* Data Points for Payments Received */}
          {monthlyPayments.map((value, index) => (
            <circle
              key={`payments-${index}`}
              cx={50 + index * pointSpacing}
              cy={
                chartHeight -
                ((value - minValue) / (maxValue - minValue)) * chartHeight +
                20
              }
              r="4"
              fill="#ff7f0e"
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default DualLineChart;

//
const calculateMonthlyLoanTotals = (loans, year) => {
  const monthlyTotals = Array(12).fill(0);

  loans?.forEach((loan) => {
    if (!loan.approval_date || !loan.approved_amount) {
      return; // Skip invalid data
    }

    const approvalDate = new Date(loan.approval_date);
    if (isNaN(approvalDate) || approvalDate.getFullYear() !== year) {
      return; // Skip if date is invalid or not in the specified year
    }

    const month = approvalDate.getMonth(); // Get month index (0-11)
    monthlyTotals[month] += loan.approved_amount; // Sum approved amounts by month
  });

  return monthlyTotals;
};

const calculateMonthlyPaymentTotals = (payments, year) => {
  const monthlyTotals = Array(12).fill(0);

  payments?.forEach((payment) => {
    if (!payment.transaction_date || !payment.amount) {
      return; // Skip invalid data
    }

    const transactionDate = new Date(payment.transaction_date);
    if (isNaN(transactionDate) || transactionDate.getFullYear() !== year) {
      return; // Skip if date is invalid or not in the specified year
    }

    const month = transactionDate.getMonth(); // Get month index (0-11)
    monthlyTotals[month] += parseFloat(payment.amount); // Sum payment amounts by month
  });

  return monthlyTotals;
};
