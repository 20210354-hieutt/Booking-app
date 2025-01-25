import React, { useState, useEffect, useRef } from "react";
import "./payment.css";
import Navbar from "../../componets/navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { cancelBooking, createBooking } from "../../api/bookingAPI";
import Modal from "react-modal";
import {
  calculateNights,
} from "../../helpers/dateHelpers";
import {
  faWifi,
  faPlaneDeparture,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  //object
  /*  address(chỗ này gửi được chuỗi đầy đủ như này luôn thì tốt "190 Le Thanh Ton, District 1, Ho Chi Minh City, Vietnam")
        hotelName
        checkInDate()
        checkOutDate()
        totalPrice(số tiền: ví dụ: 4000000)
        capacity {
          adults: (số lượng),
          childs: {
            count: (số lg),
            age: (tuổi)
          }
        }
        roomData(Mảng)
        totalNight(số lượng: ví dụ:2)
        review: {
          total: (số lượng nhận xét)
          point: (số điểm)
          desc: (mô tả)
        }
      parterId: (id)
      property:(id)
    */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const [hasChild, setHasChild] = useState(false);
  const [reservationInfo, setReservationInfo] = useState({
    address: "",
    hotelName: "",
    checkInDate: "",
    checkOutDate: "",
    totalPrice: 0,
    capacity: {
      adults: 0,
      childs: {},
    },
    roomData: [],
    totalNight: 0,
    reviews: {},
    partnerId: "",
    property: "",
  });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    amount: 0,
    bankCode: "",
    language: "vn",
  });

  const [isLoading, setIsLoading] = useState(true);
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Kiểm tra nếu chuỗi ngày không hợp lệ
    if (isNaN(date)) return "Invalid Date";

    const dayName = date.toLocaleString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const navigate = useNavigate();
  const [errorPayment, setErrorPayment] = useState(
    "Please fill in your last name",
  );
  const totalRoomRef = useRef(0);
  const location = useLocation();
  const dataFromProperty = location.state;
  const pendingBooking = JSON.parse(localStorage.getItem('unfinishedBooking'));
  const loadData = () => {
    if (dataFromProperty) {
      if (dataFromProperty) {
        console.log(dataFromProperty);
      }
      return dataFromProperty ? dataFromProperty : null;
    } else {
      const ri = JSON.parse(localStorage.getItem('unfinishedBooking'));
      const address = ri[0].propertyDetails.address
      const data = {
        address: `${address.street}, ${address.ward}, ${address.province}, ${address.district}  `,
        hotelName: `${ri[0].propertyDetails.name}`,
        checkInDate: `${ri[0].check_in_date}`,
        checkOutDate: `${ri[0].check_out_date}`,
        totalPrice: ri[0].total_price,
        capacity: {
          adults: ri[0].capacity.adults,
          childs: ri[0].capacity.childs,
        },
        roomData: ri[0].room_id,
        totalNight: calculateNights(ri[0].check_in_date,ri[0].check_out_date),
        reviews: {
          total: 15,
          point: ri[0].propertyDetails.rate,
          desc: "Good"
        },
        partnerId: "",
        property: `${ri[0].property}`,
      }
     return data;
    }

  };

  const editData = () => {
    let totalRoom = 0;
    const data = loadData();
    if (data) {
      setReservationInfo(data); // Cập nhật state
      // Xử lý logic trực tiếp với dữ liệu mới
      if (!dataFromProperty) {
        totalRoomRef.current = pendingBooking[0].capacity.room;
      } else {
        data.roomData.forEach((room) => {
          totalRoom += room.numberOfRooms;
        });
  
        totalRoomRef.current = totalRoom; // Cập nhật giá trị vào ref
      }

      // console.log(data.totalPrice);
      if (data.capacity.childs.count !== 0) {
        setHasChild(true);
      } else {
        setHasChild(false);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    editData();
  }, []);

  const handleChangeSelection = () => {
    if (!dataFromProperty) {
      setIsModalOpen(true);
    } else {
      navigate(`/property/${reservationInfo.property}`);
    }

  };

  const handleCancelBooking = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("unfinishedBooking"));
      await cancelBooking(data[0]._id);
      localStorage.removeItem('overViewData');
      localStorage.removeItem('unfinishedBooking');
      navigate(`/property/${reservationInfo.property}`);
      closeModal();
    } catch (error) {
      console.log(error);
    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };


  let overViewData = {};

  const handleCreateBooking = async () => {
    if (dataFromProperty) {
      const user_id = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");
      // console.log(`${user_id} ${token}`);
      const capacity = { ...reservationInfo.capacity, room: Number(totalRoomRef.current) };

      const booking = await createBooking(
        user_id,
        reservationInfo.partnerId,
        reservationInfo.property,
        reservationInfo.roomData,
        capacity,
        reservationInfo.checkInDate,
        reservationInfo.checkOutDate,
        reservationInfo.totalPrice,
        token
      );
      console.log('Booking created:', booking);

      overViewData = {
        bookingId: booking._id
      }

    } else {
      overViewData = {
        bookingId: pendingBooking[0]._id
      }
    }
    overViewData = {
      ...overViewData,
      checkInDate: reservationInfo.checkInDate,
      checkOutDate: reservationInfo.checkOutDate,
      address: reservationInfo.address,
      hotelName: reservationInfo.hotelName,
      firstName: formData.firstname,
      email: formData.email,
      lastName: formData.lastname
  };

    localStorage.setItem('overViewData', JSON.stringify(overViewData));
    console.log(overViewData);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateBooking();
    formData.amount = reservationInfo.totalPrice;
    
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/payment/create_transaction`,
        formData,
      )
      .then((res) => {
        if (localStorage.getItem("overViewData")) {
          window.location.href = res.data.paymentUrl;
        }
      })
      .catch((err) => console.log(err));


  };

  return (
    <div>
      {!isLoading && (
        <>
          <Navbar />
          <div className="payment">
            <div className="paymentContainer">
              <div className="leftContent">
                <div className="bookingInformation">
                  <h3>{reservationInfo.hotelName}</h3>
                  <div className="address">{reservationInfo.address}</div>
                  <span>
                    {reservationInfo?.review?.desc || "Good"} Location
                  </span>
                  <div className="infoEvaluation">
                    <div className="infoScore">
                      <div>{reservationInfo.reviews.point}</div>
                    </div>

                    <div className="infoRating">
                      <div className="infoComment">
                        {reservationInfo?.reviews?.desc || "Good"}
                      </div>
                      <div className="infoReview">
                        {reservationInfo.reviews.total} reviews
                      </div>
                    </div>
                  </div>

                  <div className="infoExtra">
                    <div className="wifi">
                      <FontAwesomeIcon icon={faWifi} className="iconWifi" />
                      <span>Free WiFi</span>
                    </div>

                    <div className="airport">
                      <FontAwesomeIcon
                        icon={faPlaneDeparture}
                        className="iconPlane"
                      />
                      <span>Airport shuttle</span>
                    </div>
                  </div>
                </div>

                <div className="bookingDetails">
                  <h3>Your booking details</h3>
                  <div className="timeBooking">
                    <div className="checkIn">
                      <div className="checkInTitle">Check-in</div>
                      <div className="checkInTime">
                        {formatDate(reservationInfo.checkInDate)}
                      </div>
                      <div className="checkInFrom">From 14:00</div>
                    </div>

                    <div className="checkOut">
                      <div className="checkOutTitle">Check-out</div>
                      <div className="checkOutTime">
                        {formatDate(reservationInfo.checkOutDate)}
                      </div>
                      <div className="checkOutUntil">Until 11:00</div>
                    </div>
                  </div>
                  <div className="lengthStay">
                    <div className="lengthStayTitle">Total length of stay:</div>
                    <div className="totalNight">
                      {reservationInfo.totalNight} nights
                    </div>
                  </div>

                  <div className="selected">
                    <div className="selectedTitle">You selected</div>

                    {hasChild === true ? (
                      <div className="mySelected">
                        {totalRoomRef.current} rooms for{" "}
                        {reservationInfo.capacity.adults} adults,{" "}
                        {reservationInfo.capacity.childs.count} childs
                      </div>
                    ) : (
                      <div className="mySelected">
                        {totalRoomRef.current} rooms for{" "}
                        {reservationInfo.capacity.adults} adults
                      </div>
                    )}
                    <button
                      className="changeSelection"
                      onClick={handleChangeSelection}
                    >
                      Change your selection{" "}
                    </button>
                  </div>
                </div>

                <div className="priceSummary">
                  <h3>Your price summary</h3>
                  <div className="totalPrice">
                    <div className="textLeft">Total</div>
                    <div className="textRight">VND {reservationInfo?.totalPrice?.toLocaleString("en-US")}</div>
                  </div>
                </div>
              </div>
              <div className="rightContent">

                <div className="yourDetails">
                  <h3>Enter your details</h3>
                  <div className="alert">
                    <FontAwesomeIcon icon={faInfo} className="iconInfo" />
                    <div className="yourAlert">
                      Almost done! Just fill in the{" "}
                      <span className="required">*</span> required info
                    </div>
                  </div>
                  <div className="formInput">
                    <form
                      onSubmit={handleSubmit}
                      id="payment_form"
                      accept-charset="UTF-8"
                    // action="http://localhost:8000/payment/create_transaction"
                    // method="post"
                    >
                      <label>
                        First name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="firstname"
                        onChange={handleChange}
                        required
                      />
                      <label>
                        Last name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-comment form-control-lg"
                        name="lastname"
                        onChange={handleChange}
                        required
                      />
                      <label>
                        Email address<span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        class="form-control form-control-lg"
                        name="email"
                        onChange={handleChange}
                        required
                      />
                      <label>
                        Phone number<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        pattern="\d+"
                        id="Phone"
                        className="form-control form-control-comment form-control-lg"
                        name="phone"
                        onChange={handleChange}
                        required
                      />

                      <label for="amount">
                        Total price<span className="required">*</span>
                      </label>
                      <input
                        class="form-control"
                        data-val="true"
                        data-val-number="The field Amount must be a number."
                        data-val-required="The Amount field is required."
                        id="amount"
                        name="amount"
                        type="number"
                        readOnly
                        value={reservationInfo.totalPrice}
                        onChange={handleChange}
                      />

                      <label htmlFor="bankcode">Payment method</label>
                      <select
                        name="bankCode"
                        id="bankcode"
                        class="form-control"
                        onChange={handleChange}
                      >
                        <option value="">Không chọn </option>
                        <option value="VNMART"> Vi dien tu VnMart</option>
                        <option value="VISA">VISA</option>
                        <option value="VIETCAPITALBANK">VIETCAPITALBANK</option>
                        <option value="SCB">Ngan hang SCB</option>
                        <option value="NCB">Ngan hang NCB</option>
                        <option value="SACOMBANK">Ngan hang SacomBank </option>
                        <option value="EXIMBANK">Ngan hang EximBank </option>
                        <option value="MSBANK">Ngan hang MSBANK </option>
                        <option value="NAMABANK">Ngan hang NamABank </option>
                        <option value="VIETINBANK">
                          Ngan hang Vietinbank{" "}
                        </option>
                        <option value="VIETCOMBANK">Ngan hang VCB </option>
                        <option value="HDBANK">Ngan hang HDBank</option>
                        <option value="DONGABANK">Ngan hang Dong A</option>
                        <option value="TPBANK">Ngân hàng TPBank </option>
                        <option value="OJB">Ngân hàng OceanBank</option>
                        <option value="BIDV">Ngân hàng BIDV </option>
                        <option value="TECHCOMBANK">
                          Ngân hàng Techcombank{" "}
                        </option>
                        <option value="VPBANK">Ngan hang VPBank </option>
                        <option value="AGRIBANK">Ngan hang Agribank </option>
                        <option value="MBBANK">Ngan hang MBBank </option>
                        <option value="ACB">Ngan hang ACB </option>
                        <option value="OCB">Ngan hang OCB </option>
                        <option value="IVB">Ngan hang IVB </option>
                        <option value="SHB">Ngan hang SHB </option>
                      </select>

                      <label htmlFor="language">
                        Language<span className="required">*</span>
                      </label>
                      <select
                        name="language"
                        id="language"
                        class="form-control"
                        onChange={handleChange}
                      >
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                      {errorPayment && (
                        <p className="errorMessage">{errorPayment}</p>
                      )}

                      <div className="btnDiv">
                        <button className="btnSub" onClick={handleSubmit}>
                          Next: Final details
                        </button>

                      </div>
                    </form>
                  </div>
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
            <h3>Bạn có muốn hủy chuyến đi không?
            </h3>
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
        </>
      )}
    </div>
  );
}

export default Payment;
