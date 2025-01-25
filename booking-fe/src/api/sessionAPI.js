import axios from "axios";

export const getSessionByUser = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/session/getSessionByUser/${id}`,
  );
  return respone.data;
};
export const getSessionHistory = async (userId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/session/getSessionHistory/${userId}`,
  );
  return respone.data;
};
export const checkSession = async (userId, accessToken) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/session/refreshAccessToken/${userId}`,
    { accessToken },
  );
  return respone.data;
};
export const updateLastProperties = async (userId, propertyId) => {
  const respone = await axios.put(
    `${process.env.REACT_APP_API_URL}/session/updateLastProperties/${userId}`,
    { propertyId },
  );
  return respone.data;
};
export const refreshAccessToken = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/session/refreshAccessToken`,
    { withCredentials: true },)
    return response.data
}