import { useStaff } from "../context/StaffContext";
import styles from "./Footer.module.css";
import { HashLink } from "react-router-hash-link";

function Footer() {
  // const { setIsStaffAuthenticated, setStaffUser } = useStaff();

  //
  return (
    <footer className={` ${styles.footer}`}>
      <div className={`${"container"}`}>
        <main className={`${styles.grid} ${styles.cols}`}>
          <div className={styles.footerIcons}>
            <HashLink smooth to="/home#top">
              <img
                src="/images/logos/easylife_logo.png"
                alt="Easy Life Microfinance SL Ltd logo"
              />
            </HashLink>
            <p>
              A Microfinance and Micro Credit scheme aimed to alleviate poverty.
            </p>
            <div className={styles.icons}>
              <HashLink smooth to="/">
                <i className="fa-brands fa-square-facebook"></i>
              </HashLink>
              <HashLink smooth to="/">
                <i className="fa-brands fa-square-whatsapp"></i>
              </HashLink>
            </div>
          </div>

          <div className={styles.navigation}>
            <h3>Contact us</h3>
            <ul>
              <li>Kenema Shopping Plaza, Kenema, Sierra Leone.</li>
              <li>Phone: +232 76 726824</li>
              <li>Email: elmf.sl24@gmail.com</li>
            </ul>
          </div>

          <div className={styles.navigation}>
            <h3>Account</h3>
            <ul className={styles.navList}>
              <li>
                {" "}
                <HashLink smooth to="/user/signup#top">
                  Create account
                </HashLink>
              </li>
              <li>
                {" "}
                <HashLink smooth to="/user/signin#top">
                  Sign in
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/staff/signin#top">
                  For employees
                </HashLink>
              </li>
            </ul>
          </div>

          <div className={styles.navigation}>
            <h3>Company</h3>
            <ul className={styles.navList}>
              <li>
                {" "}
                <HashLink smooth to="/about#top">
                  About Easy Life
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/about#for-business">
                  For Business
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/about#partners">
                  Lending partners
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home/careers#top">
                  Career
                </HashLink>
              </li>
            </ul>
          </div>

          <div className={styles.navigation}>
            <h3>Resources</h3>
            <ul>
              <li>
                {" "}
                <HashLink smooth to="/services#top">
                  Services Directory
                </HashLink>
              </li>
              <li>
                {" "}
                <HashLink smooth to="/services/help-center#top">
                  Help center
                </HashLink>
              </li>
              <li>
                {" "}
                <HashLink smooth to="/services/privacy-terms#top">
                  Privacy & terms
                </HashLink>
              </li>
            </ul>
          </div>
        </main>
      </div>
      <div className={styles.copyRight}>
        <p>Easy Life Microfinance SL Ltd. &copy; 2024.</p>
      </div>
    </footer>
  );
}

export default Footer;
