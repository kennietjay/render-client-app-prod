import React, { useEffect, useState, useRef } from "react";
import Logo from "./Logo";
import styles from "./AppNav.module.css";
import { NavLink } from "react-router-dom";

function AppNav(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <nav
        className={`${"navbar sticky-top navbar-expand-lg navbar-dark"} ${
          styles.nav
        } ${styles.navContainer}`}
      >
        <div className={`${"container"} ${styles.topNavContainer}`}>
          <div
            ref={menuRef}
            className={` navbar-collapse ${isMenuOpen ? "show" : ""}`}
          >
            <div className={`${"navbar-nav ms-auto"} ${styles.navList}`}>
              <div className={styles.navListItem}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : `${styles.navLink} ${styles.navSupportBtn}`
                  }
                  to="/services/help-center#top"
                  onClick={closeMenu}
                >
                  Support
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : `${styles.navLink} ${styles.navSigninBtn}`
                  }
                  to="/user/signin"
                  onClick={closeMenu}
                >
                  Sign In
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className={`${"container"} ${styles.navSubContainer}`}>
        <div className={styles.navLogo}>
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
            <Logo />
          </NavLink>
        </div>
        <nav
          className={`${"navbar sticky-top navbar-expand-lg navbar-dark"} ${
            styles.nav
          }`}
        >
          <div className={styles.subNav}>
            <div className={styles.navToggleItems}>
              <div className={`${styles.navListItem} ${styles.applyBtns}`}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : `${styles.navLink} ${styles.applyNow}`
                  }
                  to="/user/signup"
                  onClick={closeMenu}
                >
                  Get Started
                </NavLink>
              </div>
              <div className={styles.navToggle}>
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleMenu}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div
                  ref={menuRef}
                  className={`collapse navbar-collapse ${
                    isMenuOpen ? "show" : ""
                  }`}
                >
                  <div className={`${"navbar-nav ms-auto"} ${styles.navList}`}>
                    <ListItem closeMenu={closeMenu} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

const ListItem = ({ closeMenu }) => {
  return (
    <>
      <div className={`${"nav-item"} ${styles.navListItem}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          to="/"
          onClick={closeMenu}
        >
          Home
        </NavLink>
      </div>
      <div className={`${"nav-item"} ${styles.navListItem}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          to="/about"
          onClick={closeMenu}
        >
          About
        </NavLink>
      </div>
      <div className={`${"nav-item"} ${styles.navListItem}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          to="/services"
          onClick={closeMenu}
        >
          Services
        </NavLink>
      </div>
      <div className={`${"nav-item"} ${styles.navListItem}`}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          to="/contact"
          onClick={closeMenu}
        >
          Contacts
        </NavLink>
      </div>
      <div className={`${styles.navListItem} ${styles.applyBtn}`}>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.navLink} ${styles.active}`
              : `${styles.navLink} ${styles.applyNow}`
          }
          to="/user/signup"
          onClick={closeMenu}
        >
          Get Started
        </NavLink>
      </div>
    </>
  );
};

export default AppNav;
