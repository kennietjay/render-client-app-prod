import React, { useState } from "react";
import AppNav from "../components/AppNav";
import styles from "./Services.module.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link/dist/react-router-hash-link.cjs.production";
import EligibilityCheck from "../components/EligibilityCheck";
import SmallModal from "../components/SmallModal";
import LoadingSpinner from "../components/LoadingSpinner";

function Services(props) {
  const [loading, setLoading] = useState(null);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);

  const openSmallModal = () => setIsSmallModalOpen(true);
  const closeSmallModal = () => setIsSmallModalOpen(false);

  return (
    <>
      <AppNav />

      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={`${styles.servicesContainer}`}>
          <div className={`${"container"} ${styles.servicesContent}`}>
            <div className={styles.servicesHero}>
              <div className={styles.servicesHeader}>
                <h3>What We Do</h3>
                <p>
                  Empowering you with the tools and resources to manage your
                  finances effortlessly. Explore our range of services tailored
                  to your needs.
                </p>
              </div>
              <div className={styles.clapPath}></div>
            </div>
            <div className={styles.servicesContent}>
              <LoanSection openSmallModal={openSmallModal} />
              <BillPayment />
              <MoneyTransfer />
              <RokelKopor />
              <CallToAction />
            </div>

            <SmallModal isOpen={isSmallModalOpen} onClose={closeSmallModal}>
              <EligibilityCheck closeSmallModal={closeSmallModal} />
            </SmallModal>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Services;

const LoanSection = ({ openSmallModal }) => {
  return (
    <div className={styles.servicesLoanSection}>
      {/* Introduction */}
      <div id="loan-services" className={styles.servicesIntro}>
        <h3>Our Loan Services</h3>
        <p>
          Achieve your financial goals with our tailored loan services. Whether
          you&apos;re an individual or a business, we provide flexible and
          secure solutions to meet your needs.
        </p>
      </div>

      {/* Loan Types */}
      <div id="loans" className={styles.servicesLoanTypes}>
        <div className={`${styles.servicesLoanType} ${styles.salaryLoan}`}>
          <h4>Salary Loan</h4>
          <p>
            Designed for salaried individuals to meet immediate financial needs,
            offering a quick and reliable solution for managing unexpected
            expenses like medical bills or urgent home repairs
          </p>
          <ul>
            <li>Minimum Amount: NLe 1,000</li>
            <li>Maximum Amount: NLe 10,000</li>
            <li>Loan Period: 12 - 24 months</li>
            <li>Interest Rate: 20% per annum</li>
            <li>
              Qualification: Must be employed with a stable income for at least
              6 months. Proof of salary (e.g., payslips or bank statements).
            </li>
          </ul>
          <HashLink smooth to="/user/signup#top">
            Apply Now
          </HashLink>
        </div>
        <div className={`${styles.servicesLoanType} ${styles.groupLoan}`}>
          <h4>Business/Group Loan</h4>
          <p>
            Ideal for entrepreneurs or small group seeking capital to grow their
            small or medium-sized businesses or organizations, providing
            financial support to expand operations, purchase inventory, or
            invest in new opportunities.
          </p>
          <ul>
            <li>Minimum Amount: NLe 5,000</li>
            <li>Maximum Amount: NLe 50,000</li>
            <li>Loan Period: 6 - 36 months</li>
            <li>Interest Rate: 25% per annum</li>
            <li>
              Qualification: Business must be operational for at least 12
              months. Submission of a business plan, proof of revenue, and bank
              statements.
            </li>
          </ul>
          <HashLink smooth to="/user/signup#top">
            Apply Now
          </HashLink>
        </div>
      </div>

      {/* Eligibility Conditions */}
      <div id="eligibility" className={styles.servicesEligibility}>
        <h3>Eligibility Conditions</h3>
        <p>
          Applicants must meet the following criteria to qualify for a loan:
        </p>
        <ul>
          <li>Age between 20 and 55 years.</li>
          <li>
            Proof of stable income (e.g., salary slip or business records).
          </li>
          <li>Valid ID and proof of residence.</li>
          <li>Good credit history (if applicable).</li>
          <li>
            Required documents, such as bank statements and guarantor details.
          </li>
        </ul>
      </div>

      {/* Loan Application Policy */}
      <div className={styles.servicesPolicy}>
        <h3>Loan Application Policy</h3>
        <p>
          To ensure a smooth and efficient loan transaction process, all
          prospective clients must provide the following documents:
        </p>
        <ul>
          <li>Recommendation letter from the head of the institution.</li>
          <li>
            Proof of employment: Acceptance letter (probation letters are not
            accepted).
          </li>
          <li>Evidence of a current bank account or valid ID.</li>
          <li>Printed bank statement.</li>
          <li>
            Two recent passport-sized photos of the applicant and guarantor.
          </li>
          <li>
            Certified copies of land documents, business licenses, or vehicle
            roadworthiness certificates.
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className={`${styles.servicesCta} ${styles.checkEligibility}`}>
        <p>Take the next step towards achieving your financial goals today.</p>
        <button className={styles.applyButton} onClick={openSmallModal}>
          Check if you qualify
        </button>
      </div>
    </div>
  );
};

//
const BillPayment = () => {
  return (
    <div id="bill-payment" className={styles.servicesBillPayment}>
      <div className={styles.header}>
        <h3>Bill Payment</h3>
        <p>
          Simplify your utility payments, including EDSA electricity bills,
          through our secure and reliable platform. Say goodbye to long queues
          and delays.
        </p>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <h5>Key Features:</h5>
        <ul>
          <li>Pay bills from our office or designated agents.</li>
          <li>Instant transaction confirmations for peace of mind.</li>
          <li>Highly secure and efficient payment processing.</li>
        </ul>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <h5>Why Choose Us?</h5>
        <ul>
          <li>Avoid late fees and penalties with on-time payments.</li>
          <li>Easy and hassle-free service to save time.</li>
          <li>Available for all major utility providers, including EDSA.</li>
        </ul>
      </div>

      {/* Steps to Use */}
      <div className={styles.steps}>
        <h5>How It Works:</h5>
        <ol>
          <li>Visit our office or contact our designated agents.</li>
          <li>Provide your utility bill details and payment amount.</li>
          <li>Receive instant confirmation of your payment.</li>
        </ol>
      </div>
    </div>
  );
};

const MoneyTransfer = () => {
  return (
    <div id="money-transfer" className={styles.servicesMoneyTransfer}>
      <div className={styles.header}>
        <h3>Money Transfers</h3>
        <p>
          Send and receive money both locally and internationally with ease. Our
          money transfer services connect you to the world quickly and securely.
        </p>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <h5>Key Features:</h5>
        <ul>
          <li>
            Access to trusted partners like Western Union, MoneyGram, and Ria.
          </li>
          <li>Competitive transfer rates for affordability.</li>
          <li>Fast and secure transaction processing.</li>
        </ul>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <h5>Why Use Our Service?</h5>
        <ul>
          <li>Reliable service trusted by individuals and businesses.</li>
          <li>Convenient locations to access our services.</li>
          <li>Secure transactions to protect your funds and information.</li>
        </ul>
      </div>

      {/* Steps to Use */}
      <div className={styles.steps}>
        <h5>How It Works:</h5>
        <ol>
          <li>Visit our office or contact one of our agents.</li>
          <li>Provide recipient details and the transfer amount.</li>
          <li>Receive confirmation and tracking information instantly.</li>
        </ol>
      </div>
    </div>
  );
};

const RokelKopor = () => {
  return (
    <div id="rokel-kopor" className={styles.rokelKoporSection}>
      <div className={styles.rokelKoporHeader}>
        <h3>Rokel Korpor</h3>
      </div>
      <p>
        Experience seamless electronic money transfers with Rokel Commercial
        Bank. Our platform allows you to send and receive funds directly to and
        from your account with ease, speed, and security. Discover a better way
        to manage your financial transactions.
      </p>

      {/* Features */}
      <div className={styles.features}>
        <h5>Key Features:</h5>
        <ul>
          <li>Direct transfers to and from your bank account.</li>
          <li>Real-time transaction processing for quick fund access.</li>
          <li>Highly secure system to protect your financial data.</li>
          <li>Available 24/7 for uninterrupted service.</li>
          <li>Easy-to-use platform for all account holders.</li>
        </ul>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <h5>Why Choose Rokel Korpor?</h5>
        <ul>
          <li>Save time by avoiding long queues at the bank.</li>
          <li>
            Enjoy the convenience of transferring money anytime, anywhere.
          </li>
          <li>Transparent processes with no hidden fees.</li>
          <li>Reliable service trusted by individuals and businesses alike.</li>
        </ul>
      </div>

      {/* Steps to Use */}
      <div className={styles.steps}>
        <h5>How to Use Rokel Korpor:</h5>
        <ol>
          <li>
            Log in to your Rokel Commercial Bank account via the mobile app or
            website.
          </li>
          <li>Select the “Transfer Funds” option.</li>
          <li>Enter the recipient&apos;s bank details or account number.</li>
          <li>Specify the amount and confirm the transaction.</li>
          <li>
            Receive a confirmation notification once the transaction is
            processed.
          </li>
        </ol>
      </div>

      {/* Call to Action */}
      <div className={`${styles.sericesCta} ${styles.ctaBottom}`}>
        <p>
          Ready to simplify your financial transactions? Contact us today or
          visit your nearest Rokel Commercial Bank branch to learn more about
          Rokel Korpor.
        </p>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <div
      id="call-to-action"
      className={`${styles.servicesCta} ${styles.sericesCtaBottom}`}
    >
      <h3>Ready to Get Started?</h3>
      <p>
        Whether it&apos;s a loan, bill payment, or money transfer, we&apos;re
        here to help you achieve your financial goals.
      </p>
      <HashLink smooth to="/contact#top" className={styles.applyButton}>
        Contact Us
      </HashLink>
    </div>
  );
};
