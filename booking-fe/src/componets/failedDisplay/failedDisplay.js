import React, { useEffect } from "react";
import "./failedDisplay.css";
import red_cross from "../../assets/images/red_cross.png";
import { useNavigate } from "react-router-dom";

function FailedDisplay({ text, isOpen, setIsOpen, bookingData }) {
  const handleTimeoutFailedDisplay = async () => {
    setIsOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 10000));

    setIsOpen(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    handleTimeoutFailedDisplay();
  }, [isOpen]);


  const handleClick =  () => {
    console.log(bookingData);
  }
 
  return (
    <>
      {isOpen && (
        <div className="blockInput" onClick={(e) => e.stopPropagation()}>
          <div className="failedDisplay-content">
            <div className="failedDisplay-image">
              <img src={red_cross}></img>
            </div>
            <div className="failedDisplay-text">
              <p>{text}</p>
            </div>
            {bookingData.length !== 0 && (
              <button
                className="go-to-payment"
                onClick={() => navigate("/payment")}
              >
                Đi đến cổng thanh toán
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FailedDisplay;
