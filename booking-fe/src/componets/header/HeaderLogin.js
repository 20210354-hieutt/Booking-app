import React from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./headerLogin.css";
import { useNavigate } from "react-router-dom";

function HeaderLogin() {
  const navigate = useNavigate()
  return (
    <div className="headerLogin">
      <div className="headerLoginContainer">
        <div className="logo" onClick={() => navigate('/')}>Booking-app</div>
        <div className="top-bar">
          <div className="language">
            <img
              src="https://q-xx.bstatic.com/backend_static/common/flags/new/48-squared/vn.png"
              alt="language"
            />
          </div>
          <div className="support">
            <FontAwesomeIcon icon={faQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderLogin;
