export function validateAge(dob, minAge = 18) {
  if (!dob) return "Date of Birth is required.";

  const today = new Date();
  const birthDate = new Date(dob);

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < minAge) {
    return `You must be at least ${minAge} years old.`;
  }

  return null; // No errors
}
