import React from "react";
import "./navbar.css";
import Account from "../header/headerAccount/headerAccount";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const isSignIn = localStorage.getItem("isSignIn");
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  return (
    <div className="navbarr">
      <div className="navContainer">
        <a href="/">
          <span className="logo">Booking-app</span>
        </a>
        {isSignIn ? (
          <Account />
        ) : (
          <div className="navItems">
            <button
              className="navButton"
              onClick={() => {
                localStorage.setItem("redirectPath", currentPath);
                navigate("/signUp");
              }}
            >
              Resgiter
            </button>

            <button
              className="navButton"
              onClick={() => {
                localStorage.setItem("redirectPath", currentPath);

                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
