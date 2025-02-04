// //
import React, { useState } from "react";
import styles from "../Overview/Overview.module.css";

const ServiceUsageChart = () => {
  // Mock data for service usage
  const data = [
    { month: "Jan", MoneyTransfer: 150, EDSABills: 100, RBCKorpor: 50 },
    { month: "Feb", MoneyTransfer: 120, EDSABills: 130, RBCKorpor: 80 },
    { month: "Mar", MoneyTransfer: 180, EDSABills: 110, RBCKorpor: 70 },
    { month: "Apr", MoneyTransfer: 200, EDSABills: 90, RBCKorpor: 60 },
    { month: "May", MoneyTransfer: 170, EDSABills: 140, RBCKorpor: 90 },
    { month: "Jun", MoneyTransfer: 190, EDSABills: 120, RBCKorpor: 100 },
    { month: "Jul", MoneyTransfer: 210, EDSABills: 130, RBCKorpor: 110 },
    { month: "Aug", MoneyTransfer: 220, EDSABills: 140, RBCKorpor: 120 },
    { month: "Sep", MoneyTransfer: 240, EDSABills: 160, RBCKorpor: 130 },
    { month: "Oct", MoneyTransfer: 230, EDSABills: 150, RBCKorpor: 140 },
    { month: "Nov", MoneyTransfer: 210, EDSABills: 130, RBCKorpor: 100 },
    { month: "Dec", MoneyTransfer: 220, EDSABills: 140, RBCKorpor: 90 },
  ];

  const [hoveredBar, setHoveredBar] = useState(null);
  const maxValue = 600; // Adjust based on data range
  const chartHeight = 300;
  const chartWidth = 600;
  const barWidth = 20;
  const barSpacing = 55;

  const colors = {
    MoneyTransfer: "#4f6bd1",
    EDSABills: "#9babe5",
    RBCKorpor: "#3656ca",
  };

  return (
    <div className={`${styles.chartContainer} `}>
      {/* Chart Title */}
      <h3 className={styles.title}>Monthly Customer Services</h3>

      {/* Legend */}
      <div className={styles.legendContainer}>
        {Object.entries(colors).map(([service, color]) => (
          <div key={service} className={styles.legendContent}>
            <div
              className={styles.legend}
              style={{ backgroundColor: color }}
            ></div>
            <span className={styles.legendLabel}>
              {service.replace("service", "Service ")}
            </span>
          </div>
        ))}
      </div>

      <div className={`${styles.chartContent} ${styles.stackChart}`}>
        <svg
          height={chartHeight + 50}
          viewBox={`0 0 ${chartWidth + 100} ${chartHeight + 50}`}
          className={styles.chartSvg}
        >
          {/* Y-axis (Vertical) */}
          {[100, 200, 300, 400, 500, 600].map((value, index) => (
            <g key={index}>
              <line
                x1="50"
                x2={chartWidth + 50}
                y1={chartHeight - (value / maxValue) * chartHeight + 20}
                y2={chartHeight - (value / maxValue) * chartHeight + 20}
                stroke="#ddd"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x="40"
                y={chartHeight - (value / maxValue) * chartHeight + 24}
                fontSize="14"
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
            y1={chartHeight + 20}
            x2={chartWidth + 50}
            y2={chartHeight + 20}
            stroke="#aaa"
            strokeWidth="1"
          />
          {data.map((entry, index) => (
            <text
              key={index}
              x={70 + index * barSpacing}
              y={chartHeight + 40}
              fontSize="14"
              fill="#666"
              textAnchor="middle"
            >
              {entry.month}
            </text>
          ))}

          {/* Bars */}
          {data.map((entry, index) => {
            const totalHeightA = (entry.MoneyTransfer / maxValue) * chartHeight;
            const totalHeightB = (entry.EDSABills / maxValue) * chartHeight;
            const totalHeightC = (entry.RBCKorpor / maxValue) * chartHeight;

            return (
              <g
                key={index}
                transform={`translate(${60 + index * barSpacing}, 0)`}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Tooltip */}
                {hoveredBar === index && (
                  <text
                    x="10"
                    y="10"
                    fontSize="16"
                    fill="#333"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {`A: ${entry.MoneyTransfer}, B: ${entry.EDSABills}, C: ${entry.RBCKorpor}`}
                  </text>
                )}
                {/* Service C */}
                <rect
                  x="0"
                  y={chartHeight - totalHeightC + 20}
                  width={barWidth}
                  height={totalHeightC}
                  fill={colors.RBCKorpor}
                  style={{
                    transition: "0.3s ease",
                    opacity: hoveredBar === index ? 0.8 : 1,
                  }}
                />
                {/* Service B */}
                <rect
                  x="0"
                  y={chartHeight - totalHeightB - totalHeightC + 20}
                  width={barWidth}
                  height={totalHeightB}
                  fill={colors.EDSABills}
                  style={{
                    transition: "0.3s ease",
                    opacity: hoveredBar === index ? 0.8 : 1,
                  }}
                />
                {/* Service A */}
                <rect
                  x="0"
                  y={
                    chartHeight -
                    totalHeightA -
                    totalHeightB -
                    totalHeightC +
                    20
                  }
                  width={barWidth}
                  height={totalHeightA}
                  fill={colors.MoneyTransfer}
                  style={{
                    transition: "0.3s ease",
                    opacity: hoveredBar === index ? 0.8 : 1,
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ServiceUsageChart;
