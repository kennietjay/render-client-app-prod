// Utility function to format date strings in "DD-MMM-YYYY" format
const formatDateString = (dateString) => {
  try {
    const date = new Date(dateString);

    // Options for date formatting
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Invalid date string provided:", dateString);
    return dateString || ""; // Fallback to return the input if it's invalid
  }
};

export default formatDateString;
