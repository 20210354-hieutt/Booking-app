import React, { useEffect, useState } from "react";
import "./ratingProgressBar.css";

const RatingProgressBar = ({ categorize, point }) => {
  const [displayedPoint, setDisplayedPoint] = useState(0);

  useEffect(() => {
    // When point changes, animate from 0 to the point
    const interval = setInterval(() => {
      setDisplayedPoint((prev) => {
        if (prev < point) {
          let newPoint = Math.min(prev + 1, point);
          newPoint = parseFloat(newPoint.toFixed(1));
          return newPoint; // Increase until reaching target point
        } else {
          clearInterval(interval); // Stop the interval when we reach the target point
          return point;
        }
      });
    }, 30); // Change this interval to adjust speed (30ms)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [point]);
  return (
    <div className="progressBar-container">
      <div className="categorize-point">
        <p>{categorize}</p>
        <p>{displayedPoint}</p>
      </div>
      <div className="progress-bar">
        <div
          className="fill"
          style={{ width: `${displayedPoint * 20}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RatingProgressBar;
