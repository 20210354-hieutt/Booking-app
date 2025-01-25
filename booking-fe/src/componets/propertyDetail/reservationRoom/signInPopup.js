import React from "react";
import "./signInPopup.css";

const SignInPopup = ({ isOpen, onClose, onSignIn }) => {
  return (
    <div className={`popup-overlay ${isOpen ? "show" : ""}`}>
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Sign In Required</h2>
        <p>Please sign in to reserve a room.</p>
        <button onClick={onSignIn}>Sign In</button>
      </div>
    </div>
  );
};

export default SignInPopup;
