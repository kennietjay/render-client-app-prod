import React from "react";
import styles from "./About.module.css";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import { HashLink } from "react-router-hash-link";

function About(props) {
  return (
    <>
      <AppNav />
      <div className={styles.aboutContainer}>
        <div className={`${"container"}`}>
          <div className={styles.subContainer}>
            <div className={styles.aboutUsContainer}>
              <History />
              <VisionMission />
              <Accredation />
              <MeetTheTeam />
              <Partnerships />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;

const History = () => {
  return (
    <div className={styles.heroSection}>
      <h3>About Us</h3>
      <p>
        Welcome to Easy Life Microfinance SL Ltd. We are here to provide
        exceptional financial solutions that empower individuals and businesses
        to achieve their goals.
      </p>
      <p>
        Easy Life Microfinance was formed with a clear mission: to alleviate the
        daily monetary challenges faced by individuals in our society.
        Recognizing the barriers created by lengthy loan application processes,
        unmet loan requests, and slow cash flow systems, we strive to provide a
        better alternative for lending services. Our goal is to offer
        accessible, efficient, and customer-focused solutions that empower our
        clients to achieve financial stability and independence.
      </p>
    </div>
  );
};

const VisionMission = () => {
  return (
    <div className={styles.contentSection}>
      <div className={styles.textSection}>
        <div className={styles.missionVision}>
          <div>
            <h3>Our Mission</h3>
            <p>
              To deliver innovative, secure, and customer-centric financial
              services that make a meaningful difference in the lives of our
              clients.
            </p>
          </div>
          <div>
            <h3>Our Vision</h3>
            <p>
              To be the leading financial institution in Sierra Leone,
              recognized for excellence, integrity, and positive impact on the
              community.
            </p>
          </div>
        </div>
        <div className={styles.coreValues}>
          <h3>Our Core Values</h3>
          <ul>
            <li>
              <strong>Integrity:</strong> We uphold the highest standards of
              honesty and transparency.
            </li>
            <li>
              <strong>Innovation:</strong> We embrace change to provide
              cutting-edge financial solutions.
            </li>
            <li>
              <strong>Customer Focus:</strong> We are dedicated to meeting and
              exceeding customer expectations.
            </li>
            <li>
              <strong>Community Impact:</strong> We aim to uplift the
              communities we serve.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const teamMember = [
  {
    name: "Patrick Goba",
    role: "CEO & Founder",
    // image: "https://via.placeholder.com/150",
    bio: "John has over 10 years of experience in the financial sector and is the visionary behind Easy Life Microfinance.",
  },
  {
    name: "Elizabeth Koroma",
    role: "Operations Manager",
    // image: "https://via.placeholder.com/150",
    bio: "Jane ensures that the day-to-day operations run smoothly, keeping our customers at the heart of every decision.",
  },
  {
    name: "Mike Brown",
    role: "Loan Officer",
    // image: "https://via.placeholder.com/150",
    bio: "Mike specializes in providing tailored loan solutions to help customers achieve their financial goals.",
  },
  {
    name: "Emily White",
    role: "Customer Support Specialist",
    // image: "https://via.placeholder.com/150",
    bio: "Emily is dedicated to providing exceptional support and ensuring a seamless customer experience.",
  },
  {
    name: "Massah Mustapha",
    role: "Cashier",
    // image: "https://via.placeholder.com/150",
    bio: "Massah is dedicated to providing exceptional support and ensuring a seamless customer experience.",
  },
];

const MeetTheTeam = () => {
  return (
    <div className={styles.teamSection}>
      <h3>Meet the Team</h3>
      <p>Our dedicated team of professionals is here to serve you.</p>
      {/* <MeetTheTeam /> */}

      <div className={styles.teamContainer}>
        <div className={styles.teamGrid}>
          {teamMember?.map((member, index) => (
            <div key={index} className={styles.card}>
              {/* <img
                src={member.image}
                alt={member.name}
                className={styles.image}
              /> */}
              <h4 className={styles.name}>{member.name}</h4>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Accredation = () => {
  return (
    <div id="partners" className={styles.accredation}>
      <h3>Affiliation and Accredation</h3>
      <ul>
        <li>
          <strong>Accreditation: </strong>Easy Life Microfinance is accredited
          by the Bank of Sierra Leone, ensuring compliance with all regulatory
          standards and operating with a valid license.
        </li>
        <li>
          <strong>Partnerships: </strong>We are proud to have partnered with
          Rokel Commercial Bank, acting as an agent to facilitate Rokel SIM
          Koror transactions.
        </li>
        <li>
          <strong>Affiliations: </strong>We collaborate with VenTech SL to
          provide EDSA meter top-up sales, further expanding our service
          portfolio.
        </li>
      </ul>
    </div>
  );
};

const Partnerships = () => {
  return (
    <div id="for-business" className={styles.partnerships}>
      <h3>Partnerships and Business Connections</h3>
      <p>
        At Easy Life Microfinance SL Ltd., we value strong collaborations and
        partnerships that drive mutual growth and success. We are open to
        working with businesses, organizations, and individuals to create
        impactful financial solutions.
      </p>
      <h4>What We Offer to Our Partners:</h4>
      <ul>
        <li>
          <strong>Financial Collaboration:</strong> Partner with us to offer
          financial services ensuring your needs, including loan programs and
          business funding.
        </li>
        <li>
          <strong>Agent Opportunities:</strong> Become an Easy Life agent and
          help facilitate our services in your community, including Rokel SIM
          Kopor transactions and EDSA top-ups.
        </li>
        <li>
          <strong>Mutual Growth:</strong> Work together to build financial
          programs that benefit both your organization and the community.
        </li>
        <li>
          <strong>Custom Solutions:</strong> Collaborate with us to create
          customized financial products for your business or organization.
        </li>
      </ul>
      <p>
        Interested in partnering with us? Reach out today to explore
        opportunities to grow and succeed together!
      </p>
      <HashLink to="/contact#top" className={styles.ctaButton}>
        Contact Us for Partnerships
      </HashLink>
    </div>
  );
};
