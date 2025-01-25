import axios from "axios";

export const findAvailableRoomWithSearch = async (data) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/room/findAvailableRoomWithSearch`,
      data,
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const findRoomByProperty = async (property_id) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/room/getRoomWithProperty`,
      { property_id },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const updateImageForRoom = async (roomId, image) => {
  try {
    const respone = await axios.put(
      `${process.env.REACT_APP_API_URL}/room/updateImageForRoom`,
      { roomId, image },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const getMonthlyOccupancyRatesByOwner = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/room/getMonthlyOccupancyRatesByOwner/${id}`,
  );

  return respone.data;
};
export const getMonthlyOccupancyRatesByProperty = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/room/getMonthlyOccupancyRatesByProperty/${id}`,
  );

  return respone.data;
};

export const deleteRoomById = async (roomId) => {
  const respone = await axios.delete(
    `${process.env.REACT_APP_API_URL}/room/deleteRoomById/${roomId}`,
  );

  return respone.data;
};
export const getAllRoomWithTotalPrice = async (
  check_in,
  check_out,
  capacity,
  userId,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/room/getAllRoomWithTotalPrice`,
    { check_in, check_out, place: "all", capacity, userId },
  );

  return respone.data;
};
export const getRoomWithPriceByProperty = async (
  property_id,
  check_in,
  check_out,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/room/getRoomWithPriceByProperty`,
    { check_in, check_out, property_id },
  );

  return respone.data;
};
export const findRoomInReservation = async (
  property_id,
  check_in_date,
  check_out_date,
  capacity,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/room/findRoomInReservation`,
    { check_in_date, check_out_date, property_id, capacity },
  );

  return respone.data;
};
export const getAllRoomWithDetails = async () => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/room/getAllRoomWithDetails`,
  );

  return respone.data;
};
export const getRoomById = async(roomId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/room/getRoomById/${roomId}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}
