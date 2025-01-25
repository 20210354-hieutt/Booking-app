import React, { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import "./resultPayment.css";
import axios from "axios";
import moment from "moment";
import { findUnfinishedBooking } from "../../api/bookingAPI";

function ResultPayment() {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const queryParams = new URLSearchParams(location.search); // Lấy các tham số query từ URL
  const navigate = useNavigate();

  // Lấy giá trị của tham số vnp_BankCode
  const amount = queryParams.get("vnp_Amount");
  const transactionStatus = queryParams.get("vnp_TransactionStatus");
  const payDate = queryParams.get("vnp_PayDate");
  const transactionCode = queryParams.get("vnp_TxnRef");
  const overViewData = JSON.parse(localStorage.getItem("overViewData"));
  
  const {
    email,
    firstName,
    lastName,
    bookingId,
    checkInDate,
    checkOutDate,
    address,
    hotelName,
  } = overViewData;
  const [paymentMethod, setPaymentMethod] = useState("");
  const bankCode = queryParams.get("vnp_BankCode");
  const [isApiCalled, setIsApiCalled] = useState(false);

  const [message, setMessage] = useState(true);
  const formatDateTime = (dateTimeString) => {
    const year = dateTimeString.slice(0, 4);
    const month = dateTimeString.slice(4, 6);
    const day = dateTimeString.slice(6, 8);
    const hours = dateTimeString.slice(8, 10);
    const minutes = dateTimeString.slice(10, 12);
    const seconds = dateTimeString.slice(12, 14);

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const dateString = "20241125191328";
  const date = moment(dateString, "YYYYMMDDHHmmss").toDate();

  const method = () => {
    if (bankCode === "VISA") {
      setPaymentMethod("Thanh toán qua thẻ quốc tế");
    } else if (bankCode === "VNMART") {
      setPaymentMethod("Thanh toán qua ví điện tử VNMART");
    } else {
      setPaymentMethod("Thanh toán qua thẻ ngân hàng nội địa");
    }
  };

  const sendData = () => {
    if (transactionStatus === "00") {
      const paymentData = {
        booking_id: bookingId,
        amount: amount,
        payment_method: paymentMethod,
        paymentCode: transactionCode,
        paymentDate: moment(payDate, "YYYYMMDDHHmmss").toDate(),
      };

      const emailData = {
        firstname: firstName,
        lastname: lastName,
        transactionCode: transactionCode,
        transactionTime: formatDateTime(payDate),
        price: amount.toLocaleString("vi-VN"),
        checkInDate: moment(checkInDate).format("DD-MM-YYYY"),
        checkOutDate: moment(checkOutDate).format("DD-MM-YYYY"),
        email: email,
        hotelName: hotelName,
        address: address,
        paymentMethod: paymentMethod,
      };
      const updateData = {
        booking_status: "Completed",
        payment_status: "Paid",
      };
      if (!isApiCalled) {
        console.log(paymentData)
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/payment/create_payment`,
            paymentData,
          )
          .then((res) => {
            setIsApiCalled(true);
          })
          .catch((err) => console.log(err));

        // axios
        //   .post(`${process.env.REACT_APP_API_URL}/payment/save_payment`, emailData)
        //   .then((res) => {
        //     console.log(res.data);
        //     setIsApiCalled(true);
        //   })
        //   .catch((err) => console.log(err));

        axios
          .post(
            `${process.env.REACT_APP_API_URL}/booking/updateBookingStatus/${bookingId}`,
            updateData,
          )
          .then((res) => {
            console.log(res.data);
            setIsApiCalled(true);
          })
          .catch((err) => console.log(err));
      }
      
      setMessage(true);
    } else {
      setMessage(false);
    }
  };

  useEffect(() => {
    method();
  }, []);

  useEffect(() => {
    if (paymentMethod !== "") {
      sendData();
    }
  }, [paymentMethod]);
  const handleReturnHome = () => {
    localStorage.removeItem('overViewData');
    localStorage.removeItem('unfinishedBooking');

    navigate("/");
  };

  const handleReturnPayment = async () => {
    try {
      const data = await findUnfinishedBooking(localStorage.getItem('userId'));
      localStorage.getItem('unfinishedBooking',data);
      navigate("/");
    } catch(error) {
      console.log(error);
    }
    

  };
  return (
    <div className="resultPayment">
      {message ? (
        <div>
          <h4>
            Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng
            dịch vụ
          </h4>
          <table className="transactionInfoTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Số tiền được thanh toán</td>
                <td>{amount.toLocaleString("en-US")} VND</td>
              </tr>
              <tr>
                <td>Mã giao dịch</td>
                <td>{transactionCode}</td>
              </tr>

              <tr>
                <td>Thời gian giao dịch</td>
                <td>{formatDateTime(payDate)}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleReturnHome}>Quay trở lại trang chủ</button>
        </div>
      ) : (
        <div>
          <h4>
            Giao dịch thất bại.Quý khách vui lòng quay lại trang thanh toán để
            thực hiện lại giao dịch
          </h4>
          <button onClick={handleReturnPayment}>
            Quay trở lại trang chủ
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultPayment;
