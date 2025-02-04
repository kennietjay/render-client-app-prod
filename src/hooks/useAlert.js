// hooks/useAlert.js
import { useCallback, useState } from "react";

export function useAlert() {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((type, message) => {
    console.log("showAlert called with:", { type, message });
    setAlert({ type, message });
  }, []);

  const clearAlert = useCallback(() => {
    console.log("clearAlert called");
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    clearAlert,
  };
}
