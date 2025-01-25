import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../componets/loading/Loading";
import "./bookingDetails.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Navbar from "../../componets/navbar/Navbar";

import {
  calculateNights,
  formatDateDayMonthAndYear,
} from "../../helpers/dateHelpers";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { formatCurrency } from "../../helpers/currencyHelpers";
import {bookingAPI, cancelBooking} from "../../api/bookingAPI";
import { findReviewWithProperty } from "../../api/reviewAPI";


const BookingDetails = () => {
  const location = useLocation();
  const booking = location.state || {};
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({ numberStar: 0, desc: '' });
  const [reviews,setReviews] = useState([]);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const rateToText = (star) => {
    if (star >= 1 && star < 2) {
        return "Bad";
    } else if (star >= 2 && star < 3) {
      return "Pleasant";
    } else if (star >= 3 && star < 4) {
      return "Good";
    } else if (star >= 4) {
      return "Excellent";
    }

  }



  const toggleModal = () => {
    setIsModalOpen(true);
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCancelBooking = async () => {
    try {
      console.log(booking);
      await cancelBooking(booking._id);
      navigate("/");

    } catch(error) {
      console.log(error);
    }

  }

  const loadData = async () => {
  try {
    const data = await findReviewWithProperty(booking.property._id, 1);
    setReviews(data.reviews);

    if (data.reviews.length > 0) {
      let totalStar = 0;
      data.reviews.forEach((review) => {
        totalStar += review.rating;
      });

      const averageStar = totalStar / data.reviews.length;
      const roundedStar = Math.round(averageStar);

      setReviewSummary({
        numberStar: roundedStar,
        desc: rateToText(averageStar),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadData();
}, []);
 
  return (
    <>
          <Navbar />
          {booking ? (
        <div className="partner-booking-detail-container">
          <div className="partner-booking-detail-container-left">
            <div className="customer-detail">
              <div className="partner-booking-user-info">
                <h2>Customer Detail</h2>
                <p>Email: {booking.user_id.email}</p>
              </div>
              <p>Phone: {booking.user_id.phoneNumber}</p>
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

              {
                booking.booking_status === "Completed" && (
                  <button className="cancelBookingBtn" onClick={toggleModal}>Cancel Booking</button>
                )
              }
            </div>


            <div className="property-detail-information">
              <div className="property-detail-image">
                <img
                  src={booking.property.images[0]}
                  className="image-thumbnail"
                />
              </div>
              <div className="property-detail-text">
                <div className="property-detail-name">
                  {/* {booking.propertyDetails.name} */}
                  Gatsby Hanoi Hotel & Travel
                </div>
                <div className="property-detail-address">
                  {booking.property.address.street},{" "}
                  {booking.property.address.ward},{" "}
                  {booking.property.address.district},{" "}
                  {booking.property.address.province}
                </div>
                <div className="property-detail-rate">
                  <div className="rate-number">
                    {/* {booking.propertyDetails.rate}  */}
                    {reviewSummary.numberStar}.0
                  </div>
                  <span>{reviewSummary.desc} -  {reviews.length} reviews</span>

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
                    { booking.capacity.child > 0 ? (
                       <div className="mySelected">
                       {booking.capacity.room} rooms for{" "}
                       {booking.capacity.adults} adults,{" "}
                       {booking.capacity.childs.count} childs
                     </div>
                    ) : (
                      <div className="mySelected">
                       {booking.capacity.room} rooms for{" "}
                       {booking.capacity.adults} adults{" "}
                    </div>
                    )

                    }
                  </p>
                  {/* <button
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
                  </button> */}
                </div>
                {/* <div
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
                </div> */}
                <div className="total-price-container">
                  <div className="title">Total Price</div>
                  <h2>{formatCurrency(booking.total_price)}</h2>
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "550px",
                textAlign: "center",
                borderRadius: "10px",
              },
            }}
          >
            {booking.booking_status === "Completed" ? (
              <div>
                <h3>Bạn có muốn hủy chuyến đi không?
                </h3>
                <h4>Nếu đồng ý chúng tôi sẽ gửi email để xác nhận</h4>
              </div>
            ) : (
              <div>
                <h3>Bạn có muốn hủy chuyến đi không?
                </h3>
              </div>
            )}
            
            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleCancelBooking}
              >
                Đồng ý
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={closeModal}
              >
                Không
              </button>
            </div>
          </Modal>

        </div>




      ) : (
        <Loading />
      )}
    </>
  );
};
export default BookingDetails;
