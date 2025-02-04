import React from "react";
import styles from "./PrivacyTerms.module.css";

const PrivacyTerms = () => {
  return (
    <div className={`${"container"}`}>
      <div className={styles.privacyContainer}>
        <Hero
          title="Privacy & Terms"
          subtitle="Understand how we protect your data and the terms for using our platform."
        />
        <PrivacyPolicy />
        <TermsOfService />
        <ContactInfo />
      </div>
    </div>
  );
};

export default PrivacyTerms;

//
const Hero = ({ title, subtitle }) => {
  return (
    <div className={`${styles.section} ${styles.hero}`}>
      <div className={styles.content}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

//
const PrivacyPolicy = () => {
  return (
    <section className={`${styles.section} ${styles.privacyPolicy}`}>
      <h3>Privacy Policy</h3>
      <p>
        At Easy Life Microfinance, we are committed to protecting your personal
        data. This policy outlines how we collect, use, and safeguard your
        information.
      </p>
      <p className={styles.subHeading}>What We Collect</p>
      <ul>
        <li>
          Personal information such as name, email address, and contact details.
        </li>
        <li>Financial data necessary for loan processing.</li>
        <li>Behavioral data, such as your interactions with our website.</li>
      </ul>
      <p className={styles.subHeading}>How We Use Your Information</p>
      <ul>
        <li>
          To process your loan applications and provide financial services.
        </li>
        <li>To improve our platform and customer experience.</li>
        <li>To comply with legal and regulatory requirements.</li>
      </ul>
      <p className={styles.subHeading}>Your Rights</p>
      <ul>
        <li>Access your personal data and request corrections.</li>
        <li>
          Request deletion of your data, subject to regulatory requirements.
        </li>
        <li>Opt-out of marketing communications.</li>
      </ul>
    </section>
  );
};

//
const TermsOfService = () => {
  return (
    <div className={`${styles.section} ${styles.termsOfService} `}>
      <h3>Terms of Service</h3>
      <p>
        By using our platform, you agree to the following terms and conditions.
        Please read them carefully.
      </p>
      <p className={styles.subHeading}>User Responsibilities</p>
      <ul>
        <li>
          Provide accurate and up-to-date information during registration or
          application processes.
        </li>
        <li>
          Use the platform solely for its intended purpose and in compliance
          with applicable laws.
        </li>
        <li>
          Respect other users and refrain from any abusive or fraudulent
          activity.
        </li>
      </ul>
      <p className={styles.subHeading}>Prohibited Activities</p>
      <ul>
        <li>Unauthorized access or use of the platform.</li>
        <li>Uploading harmful content such as viruses or malicious code.</li>
        <li>
          Engaging in any activity that disrupts or harms the platform’s
          operations.
        </li>
      </ul>
      <p className={styles.subHeading}>Liability</p>
      <p>
        Easy Life Microfinance is not liable for any damages resulting from the
        improper use of the platform or failure to comply with these terms.
      </p>
    </div>
  );
};

//
const ContactInfo = () => {
  return (
    <div className={`${styles.contactInfo}`}>
      <h3>Contact Us</h3>
      <p>
        If you have any questions about our Privacy Policy or Terms of Service,
        feel free to contact us:
      </p>
      <ul>
        <li>
          <strong>Email:</strong> support@easylifsl.com
        </li>
        <li>
          <strong>Phone:</strong> +232 76 726824
        </li>
        <li>
          <strong>Address:</strong> Kenema Shopping Plaza, Kenema, Sierra Leone
        </li>
      </ul>
    </div>
  );
};
