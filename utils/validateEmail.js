export function validateEmail(email) {
  if (!email) return "Email is required.";

  const recognizedEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "ymail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "me.com",
    "mac.com",
    "aol.com",
    "protonmail.com",
    "zoho.com",
    "mail.com",
    "gmx.com",
    "gmx.net",
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check email format
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  // Check recognized domain
  const domain = email.split("@")[1];
  if (!recognizedEmailDomains.includes(domain) && !domain.endsWith(".org")) {
    return "Email domain is not recognized. Please use a valid domain.";
  }

  return null; // No errors
}
