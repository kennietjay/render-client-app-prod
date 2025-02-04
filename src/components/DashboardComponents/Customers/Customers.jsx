import React, { useEffect, useState } from "react";
import styles from "./Customers.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import CustomerTable from "./CustomerTable";

function Customers({
  handleCustomerSubMenuClick,
  customers,
  loanIds,
  handleCustomerSelect,
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.customerPage}>
          <h3>Customers</h3>
          {customers && (
            <CustomerTable
              customers={customers}
              handleCustomerSelect={handleCustomerSelect}
              handleCustomerSubMenuClick={handleCustomerSubMenuClick}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Customers;
