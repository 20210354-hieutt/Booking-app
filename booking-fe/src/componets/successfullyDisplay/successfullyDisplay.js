import React, { useEffect } from "react";
import "./successfullyDisplay.css";
import green_check from "../../assets/images/green_check.png";

const SuccessfullyDisplay = ({ text, isOpen, setIsOpen }) => {
  const handleTimeoutSuccessfullyDisplay = async () => {
    setIsOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsOpen(false);
  };

  useEffect(() => {
    handleTimeoutSuccessfullyDisplay();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="blockInput" onClick={(e) => e.stopPropagation()}>
          <div className="successfullyDisplay-content">
            <div className="successfullyDisplay-image">
              <img src={green_check}></img>
            </div>
            <div className="successfullyDisplay-text">
              <p>{text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessfullyDisplay;
