// stringUtils.js
export function capitalizeWords(input) {
  if (typeof input !== "string") {
    return ""; // Return an empty string if input is not a valid string
  }

  return input
    .split(/[\s-_]+/) // Split by spaces, hyphens, or underscores
    .map((word) => {
      // Check if the word is all uppercase (Acronym)
      if (word === word.toUpperCase()) {
        return word; // Return the acronym as is
      }
      // Capitalize first letter and lower the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" "); // Join the words back together with spaces
}
