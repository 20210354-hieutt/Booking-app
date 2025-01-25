import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./roomModal_image.css";

const RoomModal_image = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0,
    );
  };

  return (
    <div className="gallery-container">
      {/* Main Image */}
      <div className="main-image">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
        <button className="nav-button left" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
        <button className="nav-button right" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>

      {/* Navigation */}

      {/* Thumbnail Images */}
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomModal_image;
