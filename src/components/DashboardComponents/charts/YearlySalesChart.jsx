import React, { useEffect, useState } from "react";
import styles from "../Overview/Overview.module.css";
import { useLoan } from "../../../context/LoanContext";

const calculateMonthlyLoanCounts = (loans) => {
  // Create an array to store the count of loans for each month
  const monthlyCounts = Array(12).fill(0);

  loans?.forEach((loan) => {
    if (!loan.approval_date) return; // Skip invalid data

    const approvalDate = new Date(loan.approval_date);
    if (isNaN(approvalDate)) return; // Skip invalid dates

    const month = approvalDate.getMonth(); // Get month index (0-11)
    monthlyCounts[month] += 1; // Increment loan count for the month
  });

  return monthlyCounts;
};

const YearlySalesChart = () => {
  const { loans } = useLoan();
  const [data, setData] = useState(Array(12).fill(0)); // Initialize with zero values
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (loans?.length > 0) {
      const monthlyCounts = calculateMonthlyLoanCounts(loans);
      setData(monthlyCounts);
    }
  }, [loans]);

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

  const maxValue = Math.max(...data, 50); // Ensure a minimum Y-axis range
  const chartHeight = 200; // Height of the chart
  const chartWidth = months.length * 50; // Space for each bar and labels

  return (
    <div className={`${styles.chartContainer} `}>
      {/* Chart Title */}
      <h3 className={styles.title}>Monthly Loan Applications</h3>
      <div className={`${styles.chartContent} ${styles.barChart}`}>
        <svg
          viewBox={`0 0 ${chartWidth + 50} ${chartHeight + 50}`}
          preserveAspectRatio="xMidYMid meet"
          className={styles.chartSvg}
        >
          {/* Y-axis gridlines and labels */}
          {/* Y-axis gridlines and labels */}
          {[0, 10, 20, 30, 40, 50].map((value, index) => (
            <g key={index}>
              <line
                x1="50" // Start from the Y-axis
                x2={chartWidth + 50} // End at the width of the chart
                y1={`${chartHeight - (value / maxValue) * chartHeight}`} // Vertical position
                y2={`${chartHeight - (value / maxValue) * chartHeight}`} // Same as y1 for horizontal line
                stroke="#ddd"
                strokeWidth="0.5"
                strokeDasharray="4"
              />
              <text
                x="40" // Position slightly left of the Y-axis
                y={`${chartHeight - (value / maxValue) * chartHeight + 5}`} // Align with gridline
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          ))}

          {/* X-axis */}
          <line
            x1="50"
            y1={`${chartHeight}`}
            x2={`${chartWidth + 50}`}
            y2={`${chartHeight}`}
            stroke="#aaa"
            strokeWidth="0.5"
          />

          {/* Bars and Labels */}
          {data.map((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;

            return (
              <g key={index} transform={`translate(${50 + index * 50}, 0)`}>
                {/* Bar */}
                <rect
                  x="10"
                  y={`${chartHeight - barHeight}`}
                  width="20"
                  height={barHeight}
                  fill={hoveredIndex === index ? "#2444a8" : "#0428aa"}
                  rx="4"
                  style={{
                    cursor: "pointer",
                    transition: "0.3s ease",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Magnified Bar Value */}
                {hoveredIndex === index && (
                  <text
                    x="20"
                    y={`${chartHeight - barHeight - 15}`}
                    fontSize="12"
                    fill="#000"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                )}
                {/* Month Label */}
                <text
                  x="20"
                  y={`${chartHeight + 20}`}
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                >
                  {months[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default YearlySalesChart;
