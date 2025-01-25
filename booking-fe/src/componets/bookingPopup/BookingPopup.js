import React, { useEffect, useState } from "react";
import "./BookingPopup.css";
import { formatCurrency } from "../../helpers/currencyHelpers";
import { formatDatesDayAndMonth } from "../../helpers/dateHelpers";
import { useNavigate } from "react-router-dom";

const BookingPopup = ({ booking, setUnfinishedBooking }) => {
  const navigate = useNavigate();

  const [bookingPopup, setBookingPopup] = useState();
  useEffect(() => {
    setBookingPopup(booking);
  }, []);

  return (
    <div className="popup-container">
      {bookingPopup && (
        <div className="popup-contentt">
          <button
            className="close-btn"
            onClick={() => setUnfinishedBooking(false)}
          >
            &times;
          </button>
          <div
            className="popup-body"
            onClick={() => navigate(`/payment`)}
          >
            <img
              src={bookingPopup.propertyDetails.images[0]}
              alt="Hotel Thumbnail"
              className="popup-thumbnail"
            />
            <div className="popup-info">
              <h3>Finish your booking, tuan!</h3>
              <p>
                <b>{bookingPopup.room_id.length} room for</b>{" "}
                <span className="price">
                  {formatCurrency(bookingPopup.total_price)}
                </span>
              </p>
              <p className="hotel-name">{bookingPopup.propertyDetails.name}</p>
              <p className="date-guests">
                {formatDatesDayAndMonth(bookingPopup.check_in_date)} -{" "}
                {formatDatesDayAndMonth(bookingPopup.check_out_date)}
              </p>
            </div>
            <button className="next-btn">→</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPopup;
