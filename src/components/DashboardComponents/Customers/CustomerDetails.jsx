import React, { useEffect, useState } from "react";
import styles from "./Customers.module.css";

import Address from "../Customers/CustomerComponents/Address";
import Employer from "../Customers/CustomerComponents/Employer";
import Bank from "../Customers/CustomerComponents/Bank";
import Guarantor from "../Customers/CustomerComponents/Guarantor";
import Business from "../Customers/CustomerComponents/Business";
import LoadingSpinner from "../../LoadingSpinner";

const CustomerDetails = ({ customer, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Selected customer: ", customer);
  }, [customer]);

  if (!customer)
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.customerInfo}>
            <div>No customer selected</div>;
          </div>
        </div>
      </div>
    );

  const {
    address = null,
    bank = null,
    employer = null,
    guarantors = [],
    business = [],
  } = customer;

  const handleUpdate = (key, updatedData) => {
    onUpdate({ ...customer, [key]: updatedData });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div>
          <div className={styles.container}>
            <h2>
              Customer <strong>{customer.customer_id || "N/A"}</strong>
            </h2>
            <div className={styles.row}>
              <div className={styles.customerInfo}>
                {address ? (
                  <Address
                    address={address}
                    customer={customer}
                    onUpdate={(data) => handleUpdate("address", data)}
                  />
                ) : (
                  <p>No address information available</p>
                )}
                {employer ? (
                  <Employer
                    employer={employer}
                    customer={customer}
                    onUpdate={(data) => handleUpdate("employer", data)}
                  />
                ) : (
                  <p>No employer information available</p>
                )}
                {guarantors.length > 0 ? (
                  <Guarantor
                    // guarantors={guarantors}
                    guarantors={customer?.guarantors || []}
                    customer={customer}
                    onUpdate={(data) => handleUpdate("guarantors", data)}
                  />
                ) : (
                  <p>No guarantor information available</p>
                )}
                {bank ? (
                  <Bank
                    bank={bank}
                    customer={customer}
                    onUpdate={(data) => handleUpdate("bank", data)}
                  />
                ) : (
                  <p>No bank information available</p>
                )}
                {business.length > 0 ? (
                  <Business
                    business={business}
                    onUpdate={(data) => handleUpdate("business", data)}
                  />
                ) : (
                  <p>No business information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDetails;
