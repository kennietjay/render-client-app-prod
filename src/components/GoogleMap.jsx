import React from "react";
import styles from "./GoogleMap.module.css";

const GoogleMap = () => {
  return (
    <div className={styles.mapContainer}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7871.944028507188!2d-11.181900!3d7.871500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102f3b0000f9c7b9%3A0xc8f2d3e8b9d6e73!2s2%20Kenema%20Shopping%20Plaza%2C%20Kenema%2C%20Sierra%20Leone!5e0!3m2!1sen!2sus!4v1632984001223!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: "0" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Easy Life Microfinance SL Ltd"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
