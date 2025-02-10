import React, { useState } from "react";
import styles from "./Contacts.module.css";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import GoogleMap from "../components/GoogleMap";
import { Alert } from "react-bootstrap";
import { useContact } from "../context/ContactContext";
import LoadingSpinner from "../components/LoadingSpinner";
// import { response } from "../../../server/server";

function Contacts(props) {
  return (
    <>
      <AppNav />
      <div className={`${"container"}`}>
        <div className={styles.contantContainer}>
          <ContactUsPage />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contacts;

const ContactUsPage = () => {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.headSection}>
        <div className={styles.textContent}>
          <h3 className={styles.header}>Contact Us</h3>
          <p className={styles.subtitle}>
            Need assistance? <br /> Our dedicated team is here to help. Reach
            out to us for inquiries, support, or feedback, and we&apos;ll ensure
            a quick response to address your needs.
          </p>
        </div>
        <div className={styles.clipped}></div>
      </div>
      <div className={styles.content}>
        <ContactInfo />
        <ContactForm />
      </div>
      <div></div>
      <h3>Find Us</h3>
      <p>We are at the Kenema Shopping Plaza, Kenema, Sierra Leone.</p>
      <GoogleMap />
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className={styles.info}>
      <div>
        <h3 className={styles.title}>Contact Information</h3>
        <p className={styles.description}>
          Have questions or need assistance? <br /> Reach out to us through any
          of the following channels.
        </p>
      </div>
      <div className={styles.details}>
        <div className={styles.contactType}>
          <div>
            <i className="fa-solid fa-phone-flip"></i>
          </div>
          <div>
            <strong>Phone:</strong> +232 76 726 824
          </div>
        </div>

        <div className={styles.contactType}>
          <div>
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <strong>Address:</strong> Kenema Shopping Plaza, Kenema, Sierra
            Leone
          </div>
        </div>

        <div className={styles.contactType}>
          <div>
            <i className="fa-regular fa-envelope"></i>
          </div>
          <div>
            <strong>Email:</strong> patrickgoba2011@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const { createMessage, loading } = useContact();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Form submission logic
    try {
      const newMessage = {
        full_name: formData.full_name,
        email: formData.email,
        message: formData.message,
      };

      const response = await createMessage(newMessage);
      if (success) {
        setSuccess(response.msg);
      }

      setError("");
      setFormData({ full_name: "", email: "", message: "" });
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {success && (
            <Alert dismissible variant="success">
              {success}
            </Alert>
          )}

          {error && (
            <Alert
              variant="warning"
              className="warning"
              dismissible
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <h2 className={styles.title}>Get in Touch</h2>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            ></textarea>
          </div>
          <button disabled={loading} type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      )}
    </>
  );
};
