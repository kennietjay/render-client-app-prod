import React, { useRef, useEffect } from "react";
import "./Linegraph.css";

const LineGraph = ({ dataPoints, months }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Chart dimensions and padding
    const padding = 30;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate scale
    const maxValue = Math.max(...dataPoints);
    const scaleX = chartWidth / (dataPoints.length - 1); // X-axis spacing
    const scaleY = chartHeight / maxValue; // Y-axis scaling

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding); // Start at the left of the X-axis
    ctx.lineTo(canvas.width - padding, canvas.height - padding); // Draw the X-axis
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw labels on the X-axis
    ctx.font = "1.2rem Arial";
    ctx.fillStyle = "#042cbd"; // Text color
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    months.forEach((month, index) => {
      const x = padding + index * scaleX;
      const y = canvas.height - padding + 5;
      ctx.fillText(month, x, y); // X-axis labels
    });

    // Create gradient background for shaded area
    const gradient = ctx.createLinearGradient(
      0,
      padding,
      0,
      canvas.height - padding
    );
    gradient.addColorStop(0, "rgba(4, 44, 189, 0.6)"); // Darker blue at the top
    gradient.addColorStop(1, "rgba(4, 44, 189, 0)"); // Transparent at the bottom

    // Draw shaded background under the line
    ctx.beginPath();
    dataPoints.forEach((point, index) => {
      const x = padding + index * scaleX;
      const y = canvas.height - padding - point * scaleY;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(canvas.width - padding, canvas.height - padding); // Extend to X-axis
    ctx.lineTo(padding, canvas.height - padding); // Close the path to X-axis
    ctx.closePath();
    ctx.fillStyle = gradient; // Apply gradient
    ctx.fill();

    // Draw the line graph
    ctx.beginPath();
    dataPoints.forEach((point, index) => {
      const x = padding + index * scaleX;
      const y = canvas.height - padding - point * scaleY;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "#042cbd"; // Line color
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw header and description inside graph (Top-Left Corner)
    const headerX = padding + 10; // Offset from top-left corner
    const headerY = padding + 10;

    ctx.textAlign = "left";
    ctx.fillStyle = "#042cbd"; // Text color for header
    ctx.font = "14px Arial";
    ctx.fillText("Summary", headerX, headerY); // Header text

    ctx.font = "2.2rem Arial";
    ctx.fillStyle = "#333"; // Text color for value
    ctx.fillText("NLe 522,580", headerX, headerY + 30); // Description text

    // Add "6 Months" and arrow icon in the top-right corner
    const labelX = canvas.width - padding - 20; // Position closer to the right edge
    const labelY = padding - 20; // Position at the top of the canvas

    ctx.textAlign = "right";
    ctx.font = "1.4rem Arial";
    ctx.fillStyle = "#042cbd"; // Text color for "6 Months"
    ctx.fillText("4 Months", labelX, labelY);

    // Draw arrow down icon
    const arrowX = labelX + 10; // Position the arrow slightly to the right
    const arrowY = labelY + 5; // Center-align the arrow with the text

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY); // Top point of the arrow
    ctx.lineTo(arrowX - 5, arrowY + 10); // Bottom left point
    ctx.lineTo(arrowX + 5, arrowY + 10); // Bottom right point
    ctx.closePath();
    ctx.fillStyle = "#042cbd"; // Arrow color
    ctx.fill();
  }, [dataPoints, months]);

  return (
    <div style={{ width: "100%", height: "40rem", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LineGraph;
