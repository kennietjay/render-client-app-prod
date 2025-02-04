export function formatNumber(number) {
  if (number === null || number === undefined) return null; // Handle null/undefined

  return number.toLocaleString(); // Automatically adds commas for thousands
}
