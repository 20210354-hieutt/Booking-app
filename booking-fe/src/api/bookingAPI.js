import axios from "axios";

export const getMonthlyRevenue = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getMonthlyRevenue/${id}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
};
export const getMonthlyRevenueByProperty = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getMonthlyRevenueByProperty/${id}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
};
export const getBooking = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getBookingByOwner/${id}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
};
export const createBooking = async (
  user_id,
  partnerId,
  property,
  roomData,
  capacity,
  check_in_date,
  check_out_date,
  totalPrice,
  token,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/booking/createBooking`,
    {
      user_id,
      partnerId,
      property,
      roomData,
      capacity,
      check_in_date,
      check_out_date,
      totalPrice,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );
  return respone.data;
};
export const findUnfinishedBooking = async (userId, token) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/findUnfinishedBooking/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );

  return respone.data;
};
export const getBookingByOwner = async (userId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getBookingByOwner/${userId}`,
    {
      withCredentials: true,
    },
  );

  return respone.data;
};
export const calculateTotalNightPriceForReservation = async (
  rooms,
  check_in_date,
  check_out_date,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/booking/calculateTotalNightPriceForReservation`,
    {
      rooms,
      check_in_date,
      check_out_date,
    },
    {
      withCredentials: true,
    },
  );

  return respone.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/booking/updateBookingStatus/${bookingId}`,
    status,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
export const getAllBooking = async (token) => {
  console.log(token)
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getAllBooking`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );
  return response.data;
}
export const createBookingWithAdmin = async (data) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/createBookingWithAdmin`, { data },
    {

      withCredentials: true,
    },
  );
  return response.data;
}
export const deleteBookingByAdmin = async (bookingId) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_URL}/booking/deleteBookingById/${bookingId}`,
    {

      withCredentials: true,
    },
  );
  return response.data;
}
export const updateBookingWithAdmin = async (bookingId, data) => {
  const response = await axios.put(
    `${process.env.REACT_APP_API_URL}/booking/updateBookingById/${bookingId}`, { data },
    {

      withCredentials: true,
    },
  );
  return response.data;
}
export const getCompletedAndCancelledBookingByUser = async (userId) => {

  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getCompletedAndCancelledBookingByUser/${userId}`,
    {

      withCredentials: true,
    },
  );
  return response.data;
}
export const cancelBooking = async (id) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_URL}/booking/cancelBooking/${id}`,
    {

      withCredentials: true,
    },
  );
  return response.data;
}
export const getBookingById = async(bookingId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/booking/getBookingById/${bookingId}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}