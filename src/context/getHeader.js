// const getAuthToken = () => localStorage.getItem("accessToken");

export const getHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.warn("⛔ No token found. Skipping loan fetch.");
    return;
  }

  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};
