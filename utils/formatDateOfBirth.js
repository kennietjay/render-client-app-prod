export function formatDates(dateString) {
  if (!dateString) return null; // Check if the input is empty or undefined

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return null; // Check if the date is invalid

  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
