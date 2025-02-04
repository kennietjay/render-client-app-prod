// Utility function to format the date
export const formatDateToInput = (date) => {
  if (!date) return ""; // Handle null/undefined cases
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return ""; // Handle invalid dates
  return parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};
