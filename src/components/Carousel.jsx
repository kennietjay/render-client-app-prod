import React, { useState, useEffect } from "react";
import styles from "./Carousel.module.css";

const Carousel = ({ children, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselContent}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className={styles.carouselSlide}>
            {child}
          </div>
        ))}
      </div>
      <button
        className={`${styles.carouselControl} ${styles.prev}`}
        onClick={goToPrev}
      >
        &#9664;
      </button>
      <button
        className={`${styles.carouselControl} ${styles.next}`}
        onClick={goToNext}
      >
        &#9654;
      </button>
      <div className={styles.carouselIndicators}>
        {children.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
