export default function formatDateAndTime(dateTimeString) {
  if (!dateTimeString) {
    return { formattedDate: "", formattedTime: "" };
  }

  const dateObj = new Date(dateTimeString);

  if (isNaN(dateObj)) {
    return { formattedDate: "Invalid date", formattedTime: "" };
  }

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

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return { formattedDate, formattedTime };
}
