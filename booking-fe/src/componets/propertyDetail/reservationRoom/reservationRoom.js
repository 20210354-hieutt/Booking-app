import React, { useEffect, useState } from "react";
import "./reservationRoom.css";
import ReservationRoom_item from "./reservationRoom_item";
import RoomModal from "./roomModal";
import { checkRoomDateBooking } from "../../../function/searchRoomInProperty";
import SignInPopup from "./signInPopup";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, findUnfinishedBooking } from "../../../api/bookingAPI";
import { Button, Modal } from "react-bootstrap";
import {
  calculateNights,
  formatDateDayMonthAndYear,
} from "../../../helpers/dateHelpers";
import { formatCurrency } from "../../../helpers/currencyHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import moment from "moment";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
  findRoomByProperty,
  findRoomInReservation,
} from "../../../api/roomAPI";
import { set } from "date-fns";
import FailedDisplay from "../../failedDisplay/failedDisplay";

const ReservationRoom = ({ roomData, partnerId, propertyInfo }) => {
  const [selectedRoom, setSelectedRoom] = useState([]);

  const [reservationInfo, setReservationInfo] = useState({});

  const [numberOfGuests, setNumberOfGuests] = useState({
    adults: 0,
    childs: {
      count: 0,
      age: 0,
    },
  });
  const oneDayLater = new Date();
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: oneDayLater.setDate(oneDayLater.getDate() + 1),
      key: "selection",
    },
  ]);

  const [openDate, setOpenDate] = useState(false);

  const [numberOfNights, setNumberOfNights] = useState(3);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [modalRoom, setModalRoom] = useState(null);

  const [isSearchRoom, setIsSearchRoom] = useState(false);

  const [roomSearch, setRoomSearch] = useState(null);

  const [numberOfGuestInput, setNumberOfGuestInput] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [reserveFailed, setReserveFailed] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(false);

  const option = JSON.parse(localStorage.getItem("option"));

  const [bookingData, setBookingData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const check_in = JSON.parse(localStorage.getItem("option")).check_in;
  const check_out = JSON.parse(localStorage.getItem("option")).check_out;
  const adults = JSON.parse(localStorage.getItem("option")).capacity.adults;
  const children = JSON.parse(localStorage.getItem("option")).capacity.childs
    .count;
  const age =
    JSON.parse(localStorage.getItem("option")).capacity.childs.age || 0;
  const closeModal = () => {
    setIsModalOpen(false);
    setModalRoom(null);
  };

  useEffect(() => {
    setDate([
      {
        startDate: moment(check_in, "YYYY-MM-DD").toDate(),
        endDate: moment(check_out, "YYYY-MM-DD").toDate(),
      },
    ]);
    setNumberOfGuests({
      adults: adults,
      childs: {
        count: children,
        age: age,
      },
    });
    const totalNights = calculateNights(check_in, check_out);
    setNumberOfNights(totalNights);
  }, []);
  useEffect(() => {
    setReservationInfo({
      address: propertyInfo.address,
      hotelName: propertyInfo.hotelName,
      checkInDate: date[0].startDate,
      checkOutDate: date[0].endDate,
      totalPrice: totalPrice,
      capacity: numberOfGuests,
      roomData: selectedRoom,
      totalNight: numberOfNights,
      reviews: propertyInfo.reviews,
      partnerId: partnerId,
      property: propertyInfo.property,
    });

    
    
  }, [numberOfGuests, selectedRoom, date, totalPrice]);

  useEffect(() => {
    localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo));
  }, [reservationInfo])

  const handleTimeoutFailedDisplay = async () => {
    setReserveFailed(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Reservation Details:", {
      selectedRoom,
      date,
      numberOfGuests,
    });
  };

  const handleChangeDate = (item) => {
    option.check_in = moment(item.range1.startDate).format("YYYY-MM-DD");
    option.check_out = moment(item.range1.endDate).format("YYYY-MM-DD");
    localStorage.setItem("option", JSON.stringify(option));

    setDate([item.selection || item.range1]);
  };
  function formatDate(date) {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);

    return formattedDate.replace(",", "");
  }

  const handleChangeNumberOfGuest = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    if (value < 0) return;
    setNumberOfGuests((prev) => {
      if (e.target.name === "adults") {
        return {
          ...prev,
          [name]: value,
        };
      } else if (name === "childs") {
        if (value === 0) {
          return {
            ...prev,
            childs: {
              count: 0,
              age: 0,
            },
          };
        }
        return {
          ...prev,
          childs: {
            ...prev.childs,
            count: value,
          },
        };
      }
    });
  };

  const handleChangeAgeOfChilds = (e) => {
    e.stopPropagation();
    const { value } = e.target;
    if (value < 0) return;
    setNumberOfGuests((prev) => ({
      ...prev,
      childs: {
        ...prev.childs,
        age: value,
      },
    }));
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleReserveClick = async () => {
    try{
      
      const option = JSON.parse(localStorage.getItem('option'));
      const token = localStorage.getItem('accessToken')
      const checkPendingBooking = await findUnfinishedBooking(userId, token);
      if (checkPendingBooking.length !== 0) {
        setPendingBooking(true);
        setBookingData(checkPendingBooking);
      } else {
        if (selectedRoom.length > 0) {
          navigate("/payment", {state: reservationInfo});
        } else {
          await handleTimeoutFailedDisplay();
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        setShowModal(true);
      }
    }
  };
  const handleCloseModal = async () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSignIn = () => {
    setIsPopupOpen(false);
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/login");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await findRoomInReservation(
      roomData[0].room.property_id._id,
      check_in,
      check_out,
      {
        adults,
        childs: {
          count: children,
          age: age,
        },
      },
    );
    setIsSearchRoom(true);
    setRoomSearch(response);
  };

  return (
    <div className="ReservationForm">
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="fix-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign in required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You must sign in to reserve your room !</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleCloseModal()}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <h2>Reserve Your Room</h2>
      <form className="reservation-details" onSubmit={(e) => {}}>
        <label htmlFor="checkIn">Check-In Date:</label>
        <div className="checkIn-input">
          <div className="headerSearchItem iconCalendar">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <span
              onClick={() => {
                setOpenDate(!openDate);
              }}
              className="headerSearchText"
            >{`${formatDate(date[0].startDate)} - ${formatDate(date[0].endDate)}`}</span>
            {openDate && (
              <div className="dateInput">
                <div
                  className="blockInput"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDate(!openDate);
                  }}
                ></div>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => handleChangeDate(item)}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className="reservation-date"
                />
              </div>
            )}
          </div>
        </div>

        <label htmlFor="guests">Number of Guests:</label>
        <div
          className="guestInput"
          onClick={(e) => {
            e.preventDefault();
            setNumberOfGuestInput(true);
          }}
        >
          {numberOfGuests &&
            `${numberOfGuests.adults} Adults + ${numberOfGuests.childs.count} Childs`}
          {numberOfGuestInput && (
            <>
              <div
                className="blockInput"
                onClick={(e) => {
                  e.stopPropagation();
                  setNumberOfGuestInput(false);
                }}
              ></div>

              <div className="numberOfGuestInput">
                <div className="numberOfGuestInput-inputLabel">
                  <label>Adults: </label>
                  <input
                    type="number"
                    name="adults"
                    value={numberOfGuests.adults}
                    onChange={(e) => handleChangeNumberOfGuest(e)}
                  />
                </div>

                <div className="numberOfGuestInput-inputLabel">
                  <label>Childs: </label>
                  <input
                    type="number"
                    name="childs"
                    value={numberOfGuests.childs.count}
                    onChange={(e) => handleChangeNumberOfGuest(e)}
                  />
                </div>

                {numberOfGuests.childs.count > 0 && (
                  <div className="numberOfGuestInput-inputLabel">
                    <label>Childs Age: </label>
                    <input
                      type="number"
                      name={`childAge`}
                      value={numberOfGuests.childs.age}
                      onChange={(e) => {
                        handleChangeAgeOfChilds(e);
                      }}
                    />
                  </div>
                )}
                <button
                  className="finishChoosing"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNumberOfGuestInput(false);
                    const capacity = {
                      adults: parseInt(numberOfGuests.adults),
                      childs: {
                        count: parseInt(numberOfGuests.childs.count),
                        age: parseInt(numberOfGuests.childs.age),
                      },
                    };
                    option.capacity.childs = capacity.childs;
                    option.capacity.adults = capacity.adults;
                    localStorage.setItem("option", JSON.stringify(option));
                  }}
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className="update"
          onClick={(e) => handleUpdate(e)}
        >
          Update
        </button>
      </form>
      <form onSubmit={handleSubmit}>
        <div className="table-responsive">
          <table className="room-table">
            <thead>
              <tr key="0">
                <th>Room type</th>
                <th>Rates</th>
                <th>Number of guests</th>
                <th>Price for {numberOfNights ? numberOfNights : ""} nights</th>
                <th>Select rooms</th>
              </tr>
            </thead>
            <tbody>
              {!isSearchRoom
                ? roomData.map((room) => (
                    <ReservationRoom_item
                      key={room.room._id}
                      room={room.room}
                      totalPrice={room.totalPriceNight}
                      selectedRoom={selectedRoom}
                      numberOfNights={numberOfNights}
                      setTotalPrice={setTotalPrice}
                      setSelectedRoom={setSelectedRoom}
                      setIsModalOpen={setIsModalOpen}
                      setModalRoom={(room) => {
                        setModalRoom(room);
                        setIsModalOpen(true);
                      }}
                    />
                  ))
                : roomSearch.map((room) => (
                    <ReservationRoom_item
                      key={room._id}
                      room={room}
                      numberOfNights={numberOfNights}
                      setSelectedRoom={setSelectedRoom}
                      setTotalPrice={setTotalPrice}
                      setIsModalOpen={setIsModalOpen}
                      setModalRoom={(room) => {
                        setModalRoom(room);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
            </tbody>
          </table>
        </div>

        <div className="reserveButton">
          <div>
            <h4>Total Price: {formatCurrency(totalPrice)}</h4>
          </div>
          <button className="reserve" onClick={handleReserveClick}>
            Reserve Now
          </button>
        </div>
      </form>

      {isModalOpen && (
        <RoomModal isOpen={isModalOpen} onClose={closeModal} room={modalRoom} />
      )}

      <SignInPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSignIn={handleSignIn}
      />
      {reserveFailed && (
        <FailedDisplay
          text={"Vui lòng chọn phòng để đặt"}
          isOpen={reserveFailed}
          setIsOpen={setReserveFailed}
          bookingData={bookingData}
        />
      )}
      {pendingBooking && (
        <FailedDisplay
          text={"Vui lòng hoàn tất thanh toán đang có"}
          isOpen={pendingBooking}
          setIsOpen={setPendingBooking}
          bookingData={bookingData}
        />
      )}
    </div>
  );
};

export default ReservationRoom;
