import React, { useEffect, useState } from "react";
import styles from "../ProfileStyles/ProfileHome.module.css"; // CSS module
import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { useCustomer } from "../../../context/CustomerContext";
import { useLoan } from "../../../context/LoanContext";
import { useAddress } from "../../../context/AddressContext";
import { useEmployer } from "../../../context/EmployerContext";
import { useBusiness } from "../../../context/BusinessContext";
import { useGuarantor } from "../../../context/GuarantorContext";
import { useBank } from "../../../context/BankContext";

import Bio from "./Bio";
import Addresss from "./Address";
import Employer from "./Employer";
import Bank from "./Bank";
import LoadingSpinner from "../../LoadingSpinner";
// import BioHeader from "./BioHeader";

const ProfileHome = () => {
  const { getLoans } = useLoan();
  const [loading, setLoading] = useState(false);
  const { loan, getLoanById } = useLoan();
  const { user, fetchUserProfile } = useAuth();
  const { fetchCustomer, customer } = useCustomer();
  const { customerLoans, getLoansByCustomerId } = useLoan();
  const { getAddress } = useAddress();
  const { getEmployer } = useEmployer();
  const { getGuarantors } = useGuarantor();
  const { getBank } = useBank();
  const { getBusinesses } = useBusiness();

  const customerId = customer?.customer_id;

  console.log(customerId);

  // Auto-fetch user profile on load if necessary
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?.id) {
      fetchCustomer();
    }
  }, [user?.id, fetchCustomer]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (!customerId) return;

      try {
        await getAddress(customerId).catch((err) =>
          console.error("Address failed:", err)
        );

        await getLoans().catch((err) => console.error("Loans failed:", err));

        await getEmployer(customerId).catch((err) =>
          console.error("Employer failed:", err)
        );

        await getBank(customerId).catch((err) =>
          console.error("Bank failed:", err)
        );

        await getBusinesses(customerId).catch((err) =>
          console.error("Business failed:", err)
        );

        await getGuarantors(customerId).catch((err) =>
          console.error("Guarantor failed:", err)
        );

        await getLoansByCustomerId(customerId).catch((err) =>
          console.error("Loans failed:", err)
        );
      } catch (error) {
        console.log("Error in fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    customerId,
    getAddress,
    getBank,
    getEmployer,
    getBusinesses,
    getGuarantors,
    getLoansByCustomerId,
    getLoanById,
    getLoans,
  ]);

  console.log(customerLoans, customer?.customer_id);

  console.log(loan, customer?.customer_id);

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.profileInfo}>
              <Bio />
              <Addresss />
              <Employer />
              <Bank />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHome;

function AccountItems() {
  return (
    <div className={styles.panel}>
      <div className={styles.recentServiceUpdates}>
        <div className={styles.recentServiceUpdate}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-address-card"></i>
            <div>
              <h4>Account</h4>
              <div>Active, email verified</div>
              <Link to="/">View Now</Link>
            </div>
          </div>
        </div>
        <div className={styles.recentServiceUpdate}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-money-check-dollar"></i>
            <div>
              <h4>Loans</h4>
              <div>1 approved</div>
              <Link to="/">See Details</Link>
            </div>
          </div>
        </div>
        <div className={styles.recentServiceUpdate}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-money-check-dollar"></i>
            <div>
              <h4>Guarantors</h4>
              <div>Verify and Active</div>
              <Link to="/">See Details</Link>
            </div>
          </div>
        </div>
        <div className={`${styles.recentServiceUpdate}`}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-money-check-dollar"></i>
            <div>
              <h4>Employer</h4>
              <div>Verify and Active</div>
              <Link to="/">See Details</Link>
            </div>
          </div>
        </div>
        <div className={`${styles.recentServiceUpdate}`}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-money-check-dollar"></i>
            <div>
              <h4>My Bank</h4>
              <div>Verify and Active</div>
              <Link to="/">See Details</Link>
            </div>
          </div>
        </div>
        <div className={`${styles.recentServiceUpdate}`}>
          <div className={styles.recentUpdate}>
            <i className="fa-solid fa-money-check-dollar"></i>
            <div>
              <h4>Business</h4>
              <div>Verify and Active</div>
              <Link to="/">See Details</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
