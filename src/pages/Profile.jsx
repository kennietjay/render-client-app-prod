import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { useCustomer } from "../context/CustomerContext";

import Account from "../components/AccountComponents/ProfileComponents/Account";
import Loan from "../components/AccountComponents/ProfileComponents/Loan";
import Guarantor from "../components/AccountComponents/ProfileComponents/Guarantor";
import Business from "../components/AccountComponents/ProfileComponents/Business";
import LoanApplication from "../components/AccountComponents/LoanForms/LoanApplication";
import ProfileItems from "./ProfileItems";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
  const { signoutUser, user, loading } = useAuth();
  const [isAutoOpen, setIsAutoOpen] = useState(window.innerWidth > 62 * 16);
  const [activeSection, setActiveSection] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsAutoOpen(window.innerWidth > 62 * 16);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsAutoOpen(!isAutoOpen);
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  const handleSignout = async () => {
    try {
      await signoutUser();
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openSmallModal = () => setIsSmallModalOpen(true);
  const closeSmallModal = () => setIsSmallModalOpen(false);

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.profileContainer}>
          <div className={styles.topNavigation}>
            <button className={styles.openbtn} onClick={toggleSidebar}>
              {isAutoOpen ? (
                <i className="fa-solid fa-circle-chevron-left"></i>
              ) : (
                <i className="fa-solid fa-bars"></i>
              )}
            </button>
            <div className={styles.notificationContainer}>
              <div className={styles.notificationIcons}>
                <Link to="/">
                  <i className="fa-solid fa-bell"></i>
                </Link>
                <Link className={styles.userIcon} onClick={openSmallModal}>
                  <i className="fa-solid fa-user"></i>
                </Link>

                <Link onClick={handleSignout} to="/">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </Link>
              </div>
            </div>
          </div>
          {/*  */}

          <div>
            <aside
              className={`${styles.sidebar} ${
                isAutoOpen ? styles.open : styles.closed
              }`}
            >
              <div>
                <nav className={styles.nav}>
                  <ul>
                    <li
                      className={
                        activeSection === "recent" ? styles.active : ""
                      }
                    >
                      <Link
                        to="#recent"
                        onClick={() => handleMenuClick("recent")}
                        className={styles.navLink}
                      >
                        <i className="fa-solid fa-house"></i>
                        <span>Home</span>
                      </Link>
                    </li>

                    <li
                      className={activeSection === "loans" ? styles.active : ""}
                    >
                      <Link
                        to="#loans"
                        onClick={() => handleMenuClick("loans")}
                        className={styles.navLink}
                      >
                        <i className="fa-solid fa-money-bill-1-wave"></i>
                        <span>My Loans</span>
                      </Link>
                    </li>

                    <li
                      className={
                        activeSection === "guarantors" ? styles.active : ""
                      }
                    >
                      <Link
                        to="#guarantors"
                        onClick={() => handleMenuClick("guarantors")}
                        className={styles.navLink}
                      >
                        <i className="fa-solid fa-circle-user"></i>
                        <span>Guarantors</span>
                      </Link>
                    </li>

                    <li
                      className={
                        activeSection === "business" ? styles.active : ""
                      }
                    >
                      <Link
                        to="#business"
                        onClick={() => handleMenuClick("business")}
                        className={styles.navLink}
                      >
                        <i className="fa-solid fa-briefcase"></i>
                        <span>Business</span>
                      </Link>
                    </li>

                    <li
                      className={
                        activeSection === "logout" ? styles.active : ""
                      }
                    >
                      <Link
                        to="/"
                        onClick={handleSignout}
                        className={styles.navLink}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Logout</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </aside>

            <main
              id="main"
              className={`${styles.mainContent} ${
                isAutoOpen ? styles.shifted : ""
              }`}
            >
              <p>My Easy Life</p>

              <div className={styles.container}>
                <header className={styles.header}>
                  {user ? (
                    <p>
                      <strong>Welcome</strong>, {user?.first_name}!
                    </p>
                  ) : (
                    <p>Missing User Information</p>
                  )}

                  <div className={styles.btns}>
                    <button className={styles.apply} onClick={openModal}>
                      <i className="fa-solid fa-plus"></i>
                      <span className={styles.applyText}>Apply for Loan</span>
                    </button>
                    <Link to="/" className={styles.backBtn}>
                      <i className="fa-solid fa-chevron-left"></i>
                      <span className={styles.backText}>Back</span>
                    </Link>
                  </div>
                </header>

                <section className={styles.content}>
                  {activeSection === "recent" && (
                    <div className={styles.recentTransactions}>
                      <Account />
                    </div>
                  )}
                  {activeSection === "loans" && (
                    <div>
                      <Loan />
                    </div>
                  )}
                  {activeSection === "guarantors" && (
                    <div>
                      <Guarantor />
                    </div>
                  )}
                  {activeSection === "business" && (
                    <div>
                      <Business />
                    </div>
                  )}
                  {activeSection === "logout" && <div>Logout Content</div>}
                </section>
              </div>

              <LoanApplication
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />

              <ProfileItems
                closeSmallModal={closeSmallModal}
                isSmallModalOpen={isSmallModalOpen}
                setIsSmallModalOpen={setIsSmallModalOpen}
              />
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
