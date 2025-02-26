import React, { useEffect } from "react";
import styles from "../Overview/Overview.module.css";

const LoanOfficerMonthlySales = ({ data, colors, labels, size = 200 }) => {
  useEffect(() => {}, [data, labels]);

  // Calculate the total value of the data
  const total = data?.reduce((sum, value) => sum + value, 0);

  // Handle no data or total zero case
  if (total === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.title}>Monthly Performers</h3>
        <p>No sales data available for this month.</p>
      </div>
    );
  }

  // Calculate the start and end angles for each segment
  let startAngle = 0;
  const segments = data?.map((value, index) => {
    const percentage = value / total; // Fraction of the circle
    const endAngle = startAngle + percentage * 360; // Convert fraction to degrees
    const segment = {
      value,
      percentage,
      color: colors[index % colors.length],
      label: labels[index],
      startAngle,
      endAngle,
    };
    startAngle = endAngle; // Update start angle for the next segment
    return segment;
  });

  const radius = size / 2;
  const center = size / 2;
  const innerRadius = radius * 0.6; // Inner radius for the doughnut effect

  // Function to convert polar coordinates to Cartesian
  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Function to create an arc path for each segment
  const createArcPath = (startAngle, endAngle, radius, innerRadius) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const outerArc = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    const innerArcStart = polarToCartesian(
      center,
      center,
      innerRadius,
      startAngle
    );
    const innerArcEnd = polarToCartesian(center, center, innerRadius, endAngle);
    const innerArc = `L ${innerArcStart.x} ${innerArcStart.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerArcEnd.x} ${innerArcEnd.y} Z`;

    return `${outerArc} ${innerArc}`;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Monthly Performers</h3>
      <div className={`${styles.chartContent} ${styles.doughnut}`}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ marginBottom: "1rem" }}
        >
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArcPath(
                segment.startAngle,
                segment.endAngle,
                radius,
                innerRadius
              )}
              fill={segment.color}
            />
          ))}
          {/* Add a circle in the center for the doughnut effect */}
          <circle cx={center} cy={center} r={innerRadius} fill="#fff" />
          {/* Add labels */}
          {segments.map((segment, index) => {
            const angle = (segment.startAngle + segment.endAngle) / 2;
            const { x, y } = polarToCartesian(
              center,
              center,
              radius * 0.8,
              angle
            );
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ fontSize: "1rem", fill: "#fff" }}
              >
                {Math.round(segment.percentage * 100)}%
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className={styles.subTitle}>
          {segments.map((segment, index) => (
            <div key={index} className={styles.legendStyle}>
              <div
                style={{ backgroundColor: segment.color }}
                className={styles.segmentStyle}
              ></div>
              <div className={styles.segmentLabels}>{segment.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanOfficerMonthlySales;
