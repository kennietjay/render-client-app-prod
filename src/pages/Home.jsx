import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import AppNav from "../components/AppNav";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
// import Carousel from "../components/Carousel";
import LineGraph from "../components/LineGraph";
import { HashLink } from "react-router-hash-link/dist/react-router-hash-link.cjs.development";
import LoadingSpinner from "../components/LoadingSpinner";

function Home(props) {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate content loading (e.g., API call or initialization)
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading Page.."
        />
      ) : (
        <div className={styles.homeContainer}>
          <AppNav />
          <HerosSection />
          <Affiliation />
          <WhyEasyLife />
          <HowItWorks />
          <Statistics />
          <Services />
          <RaffleDraw />
          <TestimonialCards />
          <Features />
          <CallToAction />
          <FinancialKnowledge />
          <Footer />
        </div>
      )}
    </>
  );
}

export default Home;

function HerosSection() {
  return (
    <div className={styles.heroSection}>
      <div className={`${"container"} ${styles.main}`}>
        <div className={styles.herosHeading}>
          <h1>Access Funds Early</h1>
          <h2>Manage your loans effortlessly.</h2>
          <div className={styles.pitchBubble}>
            <div className={styles.innerPitchBubble}>
              <h3>Let us help grow your business.</h3>{" "}
              <span>
                Empowering salaried employees with accessible and efficient
                lending solutions designed to meet their financial needs
              </span>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <div className={styles.herosMain}>
              <div className={styles.herosDetails}>
                <h5 className={styles.herosSubHeading}>
                  Ease Your Financial Worries.
                </h5>
                <h4 className={styles.herosMainHeading}>
                  Fast and Easy Way to Loan Cash.
                </h4>
                <ul>
                  <li>3x better interest rate than bank loans.</li>
                  <li>Tailored to your need.</li>
                  <li>Easy and flexible pay back process.</li>
                </ul>
                <div>
                  <HashLink
                    className={styles.herosLinks}
                    smooth
                    to="/services/#loan-services"
                  >
                    See loan types
                  </HashLink>
                </div>
              </div>
            </div>
            <div className={styles.herosAside}>
              <div className={styles.herosDetails}>
                <h5 className={styles.herosSubHeading}>
                  Small Business Intuitive.
                </h5>
                <h4 className={styles.herosAsideHeading}>
                  Grow Your Business Without Compromise.
                </h4>
                <ul>
                  <li>Fixed interst rate.</li>
                  <li>Personal loan officer.</li>
                  <li>Full access to your loan information.</li>
                </ul>

                <div>
                  <HashLink
                    className={styles.herosLinks}
                    smooth
                    to="/services/#top"
                  >
                    Learn more
                  </HashLink>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.herosServices}>
            <div className={styles.heroService}>
              <i className="fa-solid fa-hand-holding-dollar"></i>
              <p className={styles.heroServiceHeader}>Loan Services</p>
              <p>
                Better rates, broader loan coverage and covenient repayment
                options.
              </p>
              <HashLink smooth to="/services#top">
                Learn more
              </HashLink>
            </div>
            <div className={styles.heroService}>
              <i className="fa-solid fa-person-chalkboard"></i>
              <p className={styles.heroServiceHeader}>Financial Education</p>
              <p>Knowledge is power; find out how your money works for you.</p>
              <HashLink smooth to="/services/financial-knowledge#top">
                Learn more
              </HashLink>
            </div>

            <div className={styles.heroService}>
              <i className="fa-solid fa-money-bill-transfer"></i>
              <p className={styles.heroServiceHeader}>Money Transfer</p>
              <p>Send or receive through Ria, MoneyGram or Western Union.</p>
              <HashLink smooth to="/services/#money-transfer">
                Learn more
              </HashLink>
            </div>
            <div className={styles.heroService}>
              <i className="fa-solid fa-cash-register"></i>
              <p className={styles.heroServiceHeader}>EDSA Bill Services</p>
              <p>
                Avoid long queues, pay EDSA bills or top your meter with
                convenience.
              </p>
              <HashLink smooth to="/services/#bill-payment">
                Learn more
              </HashLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Affiliation() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"} ${styles.affiliation}`}>
        <h3>As Featured In</h3>
        <div className={styles.logos}>
          <div>
            <img src="/images/logos/bsl.jpg" alt="Bank of Sierra Leone" />
          </div>
          <div>
            <img src="/images/logos/rokel.jpg" alt="Rokel Commercial Bank" />
          </div>
          <div>
            <img
              src="/images/logos/edsa.jpg"
              alt="Electricity Distribution and Services Agency"
            />
          </div>
          <div>
            <img
              src="/images/logos/vendtech.jpg"
              alt="Vendtech Sierra Leone Ltd"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyEasyLife() {
  const dataPoints = [20, 56, 70, 100]; // Gains
  const months = ["Sep", "Oct", "Nov", "Dec"]; // Months

  return (
    <div className={styles.whyEasyLife}>
      <div className={`${"container"} ${styles.affiliation}`}>
        <div className={styles.whyEasyLifeContent}>
          <div className={styles.whyEasyLifeHeading}>
            <h5>WHY US</h5>
            <h3>Why they prefer Easy Life.</h3>
          </div>
          <div className={styles.whyEasyLifeSection}>
            <div className={styles.whyEasyLifeSubSection}>
              <h1>100+</h1>
              <p>
                Join over 100 teachers and professionals already benefiting from
                Easy Life&apos;s financial solutions.
              </p>
            </div>
            <div className={styles.whyEasyLifeSubSection}>
              <p>
                Low interest rate, flexible approval rating and instant access
                to loan service details.
              </p>
              <div className={styles.logos}>
                <div>
                  <i className="fa-solid fa-landmark"></i>
                </div>

                <div>
                  <i className="fa-solid fa-arrow-right-arrow-left"></i>
                </div>
                <div>
                  <i className="fa-solid fa-user"></i>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.whyEasyLifeBottomSection}>
            <div className={styles.details}>
              <h4 className={styles.heading}>No asset volatility</h4>
              <p className={styles.description}>
                Secure stable returns on your cash reserves through lending
                solutions without exposing your assets to market volatility.
              </p>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.graph}>
                <LineGraph dataPoints={dataPoints} months={months} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className={styles.howItWorks}>
      <div className={`${"container"}`}>
        <div className={styles.content}>
          <p className={styles.steps}>STEP</p>
          <h3 className={styles.howItWorksHeading}>
            Achieve your goals with tailored lending solutions.
          </h3>
          <ul>
            <li>
              <h1>1</h1>
              <h3>Open your account</h3>
              <p>
                Open your Easy Life account today to unlock tailored financial
                solutions.
              </p>
            </li>
            <li>
              <h1>2</h1>
              <h3>Apply for loan</h3>
              <p>
                Choose from flexible loan options which meets your needs, submit
                your application online.
              </p>
            </li>
            <li>
              <h1>3</h1>
              <h3>Complete Approval</h3>
              <p>
                Complete the verification process to secure approval and take
                the first step toward achieving your financial freedom.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Statistics() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"} ${styles.statContent}`}>
        <div className={styles.statHeading}>
          <h5>Our Journey</h5>
          <h3>We&apos;ve helped</h3>
          <h3>Salaried Employees and Companies</h3>
          <p>
            Hundreds of teachers of various schools across the industry have
            made a big improvement with us.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statdetails}>
            <h1>90%</h1>
            <p className={styles.statDesc}>
              Approval rate achieved through streamlined and simplified lending
              solutions.
            </p>
          </div>
          <div className={styles.statdetails}>
            <h1>130</h1>
            <p className={styles.statDesc}>
              Active subscribers benefiting from our program, leveraging
              simplified financial solutions to meet their unique needs.
            </p>
          </div>
          <div className={styles.statdetails}>
            <h1>4+</h1>
            <p className={styles.statDesc}>
              Months of Easing Financial Burdens with financial solutions to
              help individuals and businesses achieve stability.
            </p>
          </div>
        </div>

        <p className={styles.choosePlanHeading}>Current Loan Options</p>
        <div className={styles.choosePlan}>
          <div className={styles.salaryLoan}>
            <h4>Salary Loan</h4>
            <ul>
              <li>20% per annum</li>
              <li>1 to 18 months repayment</li>
              <li> Approval rate is 95%</li>
              <li> NLe 500 Min Amount</li>
            </ul>
          </div>

          <div className={styles.groupLoan}>
            <h4>Busniess/Group</h4>
            <ul>
              <li>25% per annum</li>
              <li>1 to 12 months repayment</li>
              <li> Approval rate is 75%</li>
              <li> NLe 1,000 Min Amount</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"}`}>
        <div className={styles.services}>
          <div className={styles.servicesHeading}>
            <div className={styles.servicesHeader}>
              <p>Other Services We offer</p>
              <h3>Experience that Grows With Your Scale</h3>
            </div>
            <div>
              <p className={styles.headerDescription}>
                Conduct business with comfort and ease, supported by hassle-free
                and professional management.
              </p>
            </div>
          </div>
          <div className={styles.srevicesTypes}>
            <div className={styles.moneyTransfers}>
              <div>
                <i className="fa-solid fa-rotate"></i>
              </div>
              <h4>Money Transfers</h4>
              <p>
                Effortlessly send or receive money worldwide with trusted
                services like Ria, MoneyGram, and Western Union. Experience
                fast, reliable, and convenient transactions, supported by a
                professional and respectful team dedicated to meeting your
                needs.
              </p>
            </div>
            <div className={styles.rokelKopor}>
              <div>
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <h4>Rokel Korpor</h4>
              <p>
                Experience seamless electronic money transfers with Rokel
                Commercial Bank, allowing you to send and receive funds directly
                to and from your account. Enjoy fast, secure, and convenient
                transactions. Contact us at Easy Life to learn more about this
                program.
              </p>
            </div>
            <div className={styles.edsa}>
              <div>
                <i className="fa-regular fa-lightbulb"></i>
              </div>
              <h4>EDSA Bill Services</h4>
              <p>
                Cut the line, avoid the queue and stay on top of your
                commitments with reliable, efficient, and user-friendly service
                when you top up your EDSA meter. Service designed to save you
                time and provide peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RaffleDraw() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"}`}>
        <div className={styles.raffleDraw}>
          <div className={styles.raffleDetails}>
            <h3>Win Big with Our Exciting Raffle Draws!</h3>
            <p>
              Join the fun and stand a chance to win incredible prizes in our
              exclusive raffle draws! It&apos;s simple—participate by securing
              your raffle ticket when you become a customer at Easy Life
              Microfinance, and wait for the lucky winners to be announced at
              the next draw. Every customer is a step closer to amazing rewards.
              Don&apos;t miss out on this thrilling opportunity to win big while
              supporting a great cause! Sign up loan at Easy Life
            </p>
          </div>

          <div>
            <img src="/images/img_raffle_draw.jpg" alt="" />
            <div className={styles.raffleTips}>
              <p>Tips for the Next Raffle </p>
              <ul>
                <li>Apply for loan at Easy Life.</li>
                <li>Pay EDSA bill, send or recive money</li>
                <li>
                  Take advantage of referrals, early-bird bonuses, or
                  promotions.
                </li>
                <li>
                  Avoid raffle scams by verifying the organizer&apos;s
                  credibility.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialKnowledge() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"}`}>
        <div className={styles.loanKnowledge}>
          <div className={styles.financialEducation}>
            <p className={styles.heading}>Knowledge is power.</p>
            <h3>Master Your Money, Transform Your Mindset.</h3>
            <p>
              It&apos;s time to elevate your financial mindset. Develop new
              skills, shift your perspective, and take charge of your financial
              future.
            </p>
            <p>
              Your mindset shapes your financial future. Shift the way you think
              about money—embrace abundance, make informed decisions, and build
              habits that lead to long-term success. With the right approach,
              you can turn challenges into opportunities and achieve your
              financial goals with confidence.
            </p>
            <HashLink smooth to="/services/financial-knowledge#top">
              View Money and Mindset
            </HashLink>
          </div>
          <div className={styles.loanTips}>
            <div className={styles.loanTipsDetails}>
              <h3>7 Tips for participating in our next raffle.</h3>
              <p>
                Can you transform your skills into a new source of income? These
                tips will guide you in starting your side hustle journey.
              </p>
            </div>
            <div className={styles.loanTipsImg}>
              <img
                src="/images/img_loan_tip.jpg"
                alt="Loan officer providing loan tips to a customer."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  //
  return (
    <div className={styles.subContent}>
      <div className={`${"container"}`}>
        <div className={styles.features}>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <div className={styles.featureDetails}>
                <i className="fa-solid fa-sliders"></i>
                <p>
                  {" "}
                  <strong>Flexible Loan Terms</strong>
                </p>
                <p>
                  Customizable repayment schedules to suit individual needs,
                  including short-term and long-term options.
                </p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureDetails}>
                <i className="fa-regular fa-clock"></i>
                <p>
                  <strong>Quick Approval Process</strong>
                </p>
                <p>
                  Affordable interest rates designed to make borrowing
                  accessible and manageable.
                </p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureDetails}>
                <i className="fa-solid fa-percent"></i>
                <p>
                  <strong>Competitive Interest Rates</strong>
                </p>
                <p>
                  Streamlined application and approval process for faster access
                  to funds.
                </p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureDetails}>
                <i className="fa-solid fa-business-time"></i>
                <p>
                  <strong>Diverse Loan Options</strong>
                </p>
                <p>
                  Offers a variety of loans, such as personal, business,
                  mortgage, or education loans, catering to different financial
                  needs.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CallToAction() {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"} `}>
        <div className={styles.callToAction}>
          <div className={styles.callToActionContent}>
            <div className={styles.callToActionDescription}>
              <p>Try It Now</p>
              <h3>Tackle all your financial goals with a loan.</h3>
              <p>
                Whether you are planning home improvements or an education
                journey, our loans can help you achieve your financial goals.
              </p>
            </div>
            <div className={styles.btns}>
              <HashLink
                smooth
                to="/services/#loans"
                className={styles.startBtn}
              >
                Start a New Application
              </HashLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    author: "Emily T.",
    quote:
      "Easy Life Microfinance gave me a second chance to rebuild my business after a tough year. The application process was straightforward, and their team was so helpful. Highly recommend!",
  },
  {
    author: "James K.",
    quote:
      "I appreciate the flexibility of the repayment plan. Their interest rates are fair, and I never felt pressured or confused about my obligations.",
  },
  {
    author: "Sophia L.",
    quote:
      "Customer service was excellent. They took the time to explain everything about the loan terms in detail. This has been a game-changer for my small bakery.",
  },
  {
    author: "Michael R.",
    quote:
      "The turnaround time for my loan approval was impressive. I had the funds in my account within two days of applying. Amazing service!",
  },
  {
    author: "Chloe H.",
    quote:
      "Their loan officers are very approachable and professional. I felt supported throughout the process. My farming business is thriving now!",
  },
  {
    author: "Daniel M.",
    quote:
      "I initially hesitated because I’ve had bad experiences with other institutions, but Easy Life Microfinance exceeded my expectations. No hidden fees, no surprises.",
  },
  {
    author: "Isabella N.",
    quote:
      "They really understand the needs of small business owners. Their team provided valuable financial advice along with the loan, which helped me manage my funds better.",
  },
  {
    author: "William J.",
    quote:
      "Applying for a loan was stress-free. They even have a mobile app to track my payments. Very convenient and user-friendly service!",
  },
  {
    author: "Emma B.",
    quote:
      "Their microloan helped me pay for emergency medical expenses. I’m so grateful for their timely assistance.",
  },
  {
    author: "Oliver P.",
    quote:
      "Great institution for entrepreneurs. They supported me not just with the loan but with additional resources to help my business succeed. Fantastic experience!",
  },
];

const TestimonialCards = () => {
  return (
    <div className={styles.subContent}>
      <div className={`${"container"}`}>
        <h3>What are our customers saying?</h3>
        <div className={styles.testimonialContainer}>
          {testimonials.map((testimonial, index) => (
            <div className={styles.testimonialCard} key={index}>
              <span className={styles.decoration}></span>
              <span className={styles.decoration2}></span>
              <p className={styles.quote}>"{testimonial.quote}"</p>
              <p className={styles.author}>- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
