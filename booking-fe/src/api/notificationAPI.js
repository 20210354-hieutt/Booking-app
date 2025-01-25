import axios from "axios";

export const getAllNotificationWithUser = async (user_id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/notification/getAllNotification/${user_id}`,
  );
  console.log(response);

  return response.data;
};
export const markAsRead = async (noti_id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/notification/markAsRead/${noti_id}`,
  );

  return response.data;
};
export const markAllAsRead = async (user_id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/notification/markAllAsRead/${user_id}`,
  );

  return response.data;
};
