import React from "react";
import "./footer.css";

function Footer(props) {
  return (
    <div className="footer">
      <div className="footer-lists">
        <div className="footer-group">
          <div className="footer-group-support">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="#">Coronavirus (COVID-19) FAQs</a>
              </li>
              <li>
                <a href="#">Manage your trips</a>
              </li>
              <li>
                <a href="#">Contact Customer Service</a>
              </li>
              <li>
                <a href="#">Safety resource centre</a>
              </li>
            </ul>
          </div>

          <div className="footer-group-discover">
            <h3>Discover</h3>
            <ul>
              <li>
                <a href="#">Genius loyalty programme</a>
              </li>
              <li>
                <a href="#">Seasonal and holiday deals</a>
              </li>
              <li>
                <a href="#">Travel articles</a>
              </li>
              <li>
                <a href="#">Booking.com for Business</a>
              </li>
              <li>
                <a href="#">Traveller Review Awards</a>
              </li>
              <li>
                <a href="#">Car hire</a>
              </li>
              <li>
                <a href="#">Flight finder</a>
              </li>
              <li>
                <a href="#">Restaurant reservations</a>
              </li>
              <li>
                <a href="#">Booking.com for Travel Agents</a>
              </li>
            </ul>
          </div>

          <div className="footer-group-terms">
            <h3>Terms and settings</h3>
            <ul>
              <li>
                <a href="#">Privacy & cookies</a>
              </li>
              <li>
                <a href="#">Terms and conditions</a>
              </li>
              <li>
                <a href="#">Partner dispute</a>
              </li>
              <li>
                <a href="#">Modern Slavery Statement</a>
              </li>
              <li>
                <a href="#">Human Rights Statement</a>
              </li>
            </ul>
          </div>

          <div className="footer-group-parters">
            <h3>Partners</h3>
            <ul>
              <li>
                <a href="#">Extranet login</a>
              </li>
              <li>
                <a href="#">Partner help</a>
              </li>
              <li>
                <a href="#">List your property</a>
              </li>
              <li>
                <a href="#">Become an affiliate</a>
              </li>
            </ul>
          </div>

          <div className="footer-group-about">
            <h3>About</h3>
            <ul>
              <li>
                <a href="#">About Booking.com</a>
              </li>
              <li>
                <a href="#">How we work</a>
              </li>
              <li>
                <a href="#">Sustainability</a>
              </li>
              <li>
                <a href="#">Press centre</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Investor relations</a>
              </li>
              <li>
                <a href="#">Corporate contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-section">
        <hr></hr>
        <div className="footer-info">
          <p>
            Booking.com is part of Booking Holdings Inc., the world leader in
            online travel and related services.
          </p>
          <p>Copyright © 1996-2024 Booking.com™. All rights reserved.</p>
        </div>

        <div className="footer-logo">
          <img src="/image/booking.png" alt="" />
          <img src="/image/priceline.png" alt="" />
          <img src="/image/KAYAK.png" alt="" />
          <img src="/image/agoda.png" alt="" />
          <img src="/image/opentable.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
