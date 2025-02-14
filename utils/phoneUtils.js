/**
 * Format a phone number to '232XXXXXXXX' (Sierra Leone format)
 * @param {string} phone - The phone number input
 * @returns {string | null} - Returns formatted number or null if invalid
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return null;

  // Remove all non-numeric characters
  let cleanedPhone = phone.replace(/\D/g, "");

  // Remove leading 0 if present (e.g., "076123456" -> "76123456")
  if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
    cleanedPhone = cleanedPhone.slice(1);
  }

  // Ensure the number is valid and in correct length
  if (/^\d{8}$/.test(cleanedPhone)) {
    return `232${cleanedPhone}`; // Sierra Leone number without '+'
  }

  // If the number already starts with '232' and has 11 digits
  if (/^232\d{8}$/.test(cleanedPhone)) {
    return cleanedPhone; // Keep as is
  }

  return null; // Invalid number
};
