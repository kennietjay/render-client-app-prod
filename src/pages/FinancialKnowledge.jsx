import React from "react";
import styles from "./FinancialKnowledge.module.css";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";

const FinancialKnowledgePage = () => {
  return (
    <div>
      <AppNav />
      <div className={`${"container"}`}>
        <div className={styles.financialKnowledge}>
          <Hero />
          <Explanation />
          <Tips />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FinancialKnowledgePage;

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h2>Knowledge is Power</h2>
        <p>
          Discover how understanding your finances empowers you to achieve
          financial freedom and make your money work for you.
        </p>
      </div>
    </div>
  );
};

const Explanation = () => {
  return (
    <div className={styles.explanation}>
      <h3>What Does &quot;Knowledge is Power&quot; Mean in Finance?</h3>
      <p>
        Financial knowledge is the cornerstone of financial freedom.
        Understanding how your money works enables you to make informed
        decisions, avoid debt traps, and grow your wealth. Without proper
        knowledge, managing finances can feel overwhelming, but with the right
        tools and insights, you can take control of your financial future.
      </p>
      <p>
        Being financially literate means knowing how to budget, save, invest,
        and plan for the long term. It also involves understanding financial
        products, interest rates, and the importance of credit scores. With this
        knowledge, you empower yourself to maximize your money&apos;s potential.
      </p>
    </div>
  );
};

const Tips = () => {
  return (
    <div className={styles.tips}>
      <h3>Best Practices for Making Informed Financial Decisions</h3>
      <ul>
        <li>
          <strong>Set Clear Financial Goals:</strong> Define short-term and
          long-term objectives to guide your financial decisions.
        </li>
        <li>
          <strong>Create a Budget:</strong> Track your income and expenses to
          understand your spending habits and save effectively.
        </li>
        <li>
          <strong>Educate Yourself:</strong> Learn about basic financial
          concepts like compound interest, credit scores, and investment
          strategies.
        </li>
        <li>
          <strong>Avoid Unnecessary Debt:</strong> Borrow only what you can
          afford to repay and prioritize high-interest debts.
        </li>
        <li>
          <strong>Invest Wisely:</strong> Diversify your investments and seek
          professional advice if needed.
        </li>
        <li>
          <strong>Build an Emergency Fund:</strong> Save at least three to six
          months&apos;' worth of expenses for unexpected events.
        </li>
        <li>
          <strong>Stay Informed:</strong> Keep up with financial news and
          changes in the market to adapt your strategies.
        </li>
      </ul>
    </div>
  );
};
