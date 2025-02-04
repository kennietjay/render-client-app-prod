import React from "react";
import styles from "./Careers.module.css";
import Footer from "../components/Footer";

const jobs = [
  {
    title: "Loan Officer",
    location: "Kenema, Sierra Leone",
    type: "Full-Time",
    description:
      "Evaluate, authorize, and recommend approval of loan applications for individuals and businesses.",
    requirements: [
      "Bachelor's degree in Finance, Economics, or a related field.",
      "2+ years of experience in banking or financial services.",
      "Strong analytical and interpersonal skills.",
      "Proficiency in financial assessment and credit evaluation.",
      "Excellent written and verbal communication skills.",
    ],
    postedDate: "2024-11-01",
    endDate: "2024-11-30",
    applyLink: "/apply/loan-officer",
  },
  {
    title: "Marketing Manager",
    location: "Kenema, Sierra Leone",
    type: "Full-Time",
    description:
      "Develop and implement marketing strategies to boost brand awareness, increase customer engagement, and drive business growth.",
    requirements: [
      "Bachelor's degree in Marketing, Business Administration, or a related field.",
      "3+ years of proven experience in marketing or brand management.",
      "Excellent communication, organizational, and analytical skills.",
      "Experience in digital marketing, content creation, and campaign management.",
      "Ability to work collaboratively with cross-functional teams.",
    ],
    postedDate: "2024-11-05",
    endDate: "2024-12-05",
    applyLink: "/apply/marketing-manager",
  },
];

const Careers = () => {
  return (
    <div>
      <div className={`${"container"}`}>
        <div className={styles.career}>
          <Hero
            title="Join Our Team"
            subtitle="Explore exciting career opportunities and grow with us."
          />
          <JobListings jobs={jobs} />
          <GeneralInfo />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;

//
const Hero = ({ title, subtitle }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

//
const JobListings = ({ jobs }) => {
  return (
    <section className={styles.jobListings}>
      <h3>Current Job Openings</h3>
      {jobs.map((job, index) => (
        <div key={index} className={styles.jobCard}>
          <h4>{job.title}</h4>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          <p>
            <strong>Posted:</strong> {job.postedDate}
          </p>
          <p>
            <strong>Application Deadline:</strong> {job.endDate}
          </p>
          <p>{job.description}</p>
          <h4>Requirements:</h4>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          <a href={job.applyLink} className={styles.applyButton}>
            Apply Now
          </a>
        </div>
      ))}
    </section>
  );
};

const GeneralInfo = () => {
  return (
    <div className={styles.generalInfo}>
      <h4>Why Work With Us?</h4>
      <p>
        At Easy Life Microfinance, we believe in empowering our employees to
        achieve their full potential. We provide a supportive environment,
        growth opportunities, and the chance to make a meaningful impact in the
        community.
      </p>
      <ul>
        <li>Competitive salary and benefits.</li>
        <li>Opportunities for professional growth and development.</li>
        <li>Inclusive and diverse workplace culture.</li>
      </ul>
      <p>
        Interested in joining our team? Explore our job openings above and take
        the first step towards a rewarding career.
      </p>
    </div>
  );
};
