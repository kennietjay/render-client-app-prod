// Function to format phone number to +232-XX-XXXXXX
export function formatPhoneNumber(phone) {
  let cleanedPhone = phone.replace(/\D/g, "");

  if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
    cleanedPhone = cleanedPhone.slice(1); // Remove leading 0
  }

  if (/^\d{8}$/.test(cleanedPhone)) {
    return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
  }

  if (/^232\d{8}$/.test(cleanedPhone)) {
    return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
  }

  return null;
}
