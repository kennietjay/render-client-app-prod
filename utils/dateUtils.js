// ✅ Convert DD-MM-YYYY to YYYY-MM-DD for MySQL storage
export const convertToDBFormat = (dateString) => {
  if (!dateString || !dateString.includes("-")) return dateString;

  const parts = dateString.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert DD-MM-YYYY to YYYY-MM-DD
  }

  return dateString;
};

// ✅ Validate and format user input for DD-MM-YYYY format
export const formatAndValidateDate = (inputDate) => {
  if (!inputDate) return { isValid: false, formattedDate: "" };

  let date = inputDate.replace(/[^\d/-]/g, ""); // Remove unwanted characters
  const ddmmyyyyRegex =
    /^(0[1-9]|[12][0-9]|3[01])[\/-](0[1-9]|1[0-2])[\/-](\d{4})$/;

  if (!ddmmyyyyRegex.test(date)) return { isValid: false, formattedDate: "" };

  const [day, month, year] = date.split("-").map(Number);
  const validDate = new Date(year, month - 1, day);

  if (
    validDate.getFullYear() !== year ||
    validDate.getMonth() + 1 !== month ||
    validDate.getDate() !== day
  ) {
    return { isValid: false, formattedDate: "" };
  }

  return {
    isValid: true,
    formattedDate: `${String(day).padStart(2, "0")}-${String(month).padStart(
      2,
      "0"
    )}-${year}`, // Keep DD-MM-YYYY in input
  };
};

// ✅ Handle date input validation and store formatted date in state
export const handleDateInput = (e, setError, setFormData) => {
  const { value } = e.target;
  const { isValid, formattedDate } = formatAndValidateDate(value);

  if (!isValid) {
    setError("Invalid date format. Use DD-MM-YYYY.");
  } else {
    setError("");
    setFormData((prev) => ({
      ...prev,
      date_of_birth: formattedDate, // Keep DD-MM-YYYY in input
    }));
  }
};

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";

  // Check if it's already in YYYY-MM-DD format
  if (typeof dateString === "string" && dateString.includes("T")) {
    dateString = dateString.split("T")[0]; // Extract YYYY-MM-DD
  }

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`; // Convert YYYY-MM-DD to DD-MM-YYYY
};
