export const showSessionExpiredMessage = () => {
  const existingMessage = document.getElementById("session-expired-message");
  if (existingMessage) return; // ✅ Prevent duplicate messages

  const messageDiv = document.createElement("div");
  messageDiv.id = "session-expired-message";
  messageDiv.innerText = "⚠️ Your session has expired. Please log in again.";
  messageDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #ffcc00;
      color: #000;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
      z-index: 9999;
    `;

  document.body.appendChild(messageDiv);

  // ✅ Hide message after 5 seconds
  setTimeout(() => {
    window.location.reload();
  }, 5000);
};
