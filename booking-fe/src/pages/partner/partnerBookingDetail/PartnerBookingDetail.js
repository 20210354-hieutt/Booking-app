import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../../componets/loading/Loading";
import "./PartnerBookingDetail.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import {
  calculateNights,
  formatDateDayMonthAndYear,
} from "../../../helpers/dateHelpers";
import PartnerNavbar from "../../../componets/partner/partnerNavbar/partnerNavbar";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { formatCurrency } from "../../../helpers/currencyHelpers";
import {bookingAPI, cancelBooking} from "../../../api/bookingAPI";
const PartnerBookingDetail = () => {
  const location = useLocation();
  const [booking, setBooking] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const toggleModal = () => {
    setIsModalOpen(true);
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();

  const handleCancelBooking = async () => {
    try {
      console.log(booking);
      // await cancelBooking(booking._id);


    } catch(error) {
      console.log(error);
    }

  }


  const [roomCounts, setRoomCounts] = useState();
  useEffect(() => {
    setBooking(location.state);
  }, []);
  useEffect(() => {
    if (booking && booking.length !== 0) {
      const calculateRoomCounts = (roomDetails) => {
        const roomCounts = {};

        roomDetails.forEach((room) => {
          if (roomCounts[room.name]) {
            roomCounts[room.name] += 1;
          } else {
            roomCounts[room.name] = 1;
          }
        });

        return Object.entries(roomCounts);
      };

      const roomCounts = calculateRoomCounts(booking.roomDetails);
      console.log(booking);

      setRoomCounts(roomCounts);
    }
  }, [booking]);
  return (
    <>
      <PartnerNavbar />
      {booking ? (
        <div className="partner-booking-detail-container">
          <div className="partner-booking-detail-container-left">
            <div className="customer-detail">
              <div className="partner-booking-user-info">
                <h2>Customer Detail</h2>
                <p>Email: {booking.userDetails[0].email}</p>
              </div>
              <p>
                {booking.userDetails[0].address.ward},{" "}
                {booking.userDetails[0].address.district},{" "}
                {booking.userDetails[0].address.province}
              </p>
              <p>Phone: {booking.userDetails[0].phoneNumber}</p>
              <p
                className={`${booking.booking_status === "Completed"
                  ? "complete-color"
                  : booking.booking_status === "Pending"
                    ? "pending-color"
                    : "cancel-color"
                  }`}
              >
                Booking Status: {booking.booking_status}
              </p>

            </div>


            <div className="property-detail-information">
              <div className="property-detail-image">
                <img
                  src={booking.propertyDetails.images[0]}
                  className="image-thumbnail"
                />
              </div>
              <div className="property-detail-text">
                <div className="property-detail-name">
                  {/* {booking.propertyDetails.name} */}
                  Gatsby Hanoi Hotel & Travel
                </div>
                <div className="property-detail-address">
                  {booking.propertyDetails.address.street},{" "}
                  {booking.propertyDetails.address.ward},{" "}
                  {booking.propertyDetails.address.district},{" "}
                  {booking.propertyDetails.address.province}
                </div>
                <div className="property-detail-rate">
                  <div className="rate-number">
                    {/* {booking.propertyDetails.rate}  */}
                    4.0
                  </div>
                  <span>Excellent - 128 reviews</span>

                </div>
              </div>

            </div>
          </div>
          <div className="partner-booking-detail-container-right">

            <div className="property-detail-night">
              <h3>Your booking details</h3>
              <div className="timeBooking">
                <div className="checkIn">
                  <div className="checkInTitle">Check in</div>
                  <div className="checkInTime">
                    {formatDateDayMonthAndYear(booking.check_in_date)}
                  </div>
                  <div className="checkInFrom">From 14:00</div>

                </div>
                <div className="checkOut">
                  <div className="checkOutTitle">Check-out</div>
                  <div className="checkOutTime">
                    {formatDateDayMonthAndYear(booking.check_out_date)}
                  </div>
                  <div className="checkOutUntil">Until 11:00</div>

                </div>
              </div>
              <div className="lengthStay">
                <div className="lengthStayTitle">Total length of stay:</div>
                <div className="totalNight">
                  {calculateNights(booking.check_in_date, booking.check_out_date)}{" "}
                  {calculateNights(
                    booking.check_in_date,
                    booking.check_out_date,
                  ) > 1
                    ? "nights"
                    : "night"}
                </div>
              </div>
              <div className="rooms-details">
                <p
                  style={{
                    fontWeight: "600",
                  }}
                >
                  You selected
                </p>
                <div
                  className="selection-summary"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <p
                    style={{
                      margin: 0,
                      flex: 1,
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {booking.roomDetails.length}{" "}
                    {booking.roomDetails.length > 1 ? "rooms " : "room "}
                    for {booking.capacity.adults}{" "}
                    {booking.capacity.adults > 1 ? "adults" : "adult"}
                    {booking.capacity.childs.count > 0 && (
                      <>
                        {" and "}
                        {booking.capacity.childs.count}{" "}
                        {booking.capacity.childs.count > 1
                          ? "children "
                          : "child "}
                        with {booking.capacity.childs.age} years old
                      </>
                    )}
                  </p>
                  <button
                    className="toggle-button"
                    onClick={toggleExpand}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isExpanded ? (
                      <FiChevronUp size={20} />
                    ) : (
                      <FiChevronDown size={20} />
                    )}
                  </button>
                </div>
                <div
                  className={`room-names ${isExpanded ? "expanded" : "collapsed"}`}
                  style={{
                    overflow: "hidden",
                    maxHeight: isExpanded ? "500px" : "0", // Smooth expand/collapse
                    transition: "max-height 0.3s ease",
                  }}
                >
                  {roomCounts && roomCounts.length !== 0 && (
                    <ul style={{ padding: 0, margin: 0 }}>
                      {roomCounts.map(([roomName, count], index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            listStyle: "none",
                          }}
                        >
                          {count} x {roomName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="total-price-container">
                  <div className="title">Total Price</div>
                  <h2>{formatCurrency(booking.total_price)}</h2>
                </div>
              </div>
            </div>
          </div>

        </div>




      ) : (
        <Loading />
      )}
    </>
  );
};
export default PartnerBookingDetail;
