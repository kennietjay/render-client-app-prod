// components/GlobalAlert.js
import React from "react";
import { Alert } from "react-bootstrap";
import { useAlert } from "../contexts/AlertContext";

const GlobalAlert = () => {
  const { alert, clearAlert } = useAlert();

  if (!alert.message) return null;

  return (
    <Alert variant={alert.type} onClose={clearAlert} dismissible>
      {alert.message}
    </Alert>
  );
};

export default GlobalAlert;
