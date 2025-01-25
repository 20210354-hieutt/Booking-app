import axios from "axios";
export const updatePropertyWithPartner = async (formData, token) => {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/property/updatePropertyWithPartner`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};
export const createPropertyWithPartner = async (formData, token) => {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/property/createPropertyWithPartner`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};
export const getAllProperty = async () => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getAllProperty`,
    { withCredentials: true },
  );

  return respone.data;
};
export const getPropertyById = async (id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getPropertyById/${id}`,
    { withCredentials: true },
  );
  console.log(respone);

  return respone.data;
};
export const getPropertyTypesByPlace = async (place) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/property/getPropertyTypesByPlace`,
    { place },
    { withCredentials: true },
  );

  return respone.data;
};
export const getPropertyByTypeAndPlace = async (place, type) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/property/getPropertyByTypeAndPlace`,
    { place, type },
    { withCredentials: true },
  );

  return respone.data;
};
export const getPropertyByPlace = async (place) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/property/getPropertyByPlace`,
    { place },
    { withCredentials: true },
  );
  return respone.data;
};
export const getPropertyByRates = async () => {
  try {
    const respone = await axios.get(
      `${process.env.REACT_APP_API_URL}/property/getPropertiesSortedByRate`,
      { withCredentials: true },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const getAllTypeOfProperties = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getAllTypeOfProperties`,
    { withCredentials: true },
  );
  return response.data;
};
export const updateImageForProperty = async (propertyId, image) => {
  try {
    const respone = await axios.put(
      `${process.env.REACT_APP_API_URL}/property/updateImageForProperty`,
      { propertyId, image },
      { withCredentials: true },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const getPropertyByOwner = async (id, currentPage, propertiesPage) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getPropetyWithOwner/${id}?page=${currentPage}&limit=${propertiesPage}`,
    { withCredentials: true },
  );
  return respone.data;
};
export const getPropertyNear = async (longitude, latitude) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/property/getPropertyNear`,
      { longitude, latitude },
      { withCredentials: true },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const getPropertyByplace = async (place) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/property/getPropertyByPlace`,
      { place },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const deletePropertyById = async (
  id,
  userId,
  currentPage,
  propertiesPage,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/property/deletePropertyById/${id}?page=${currentPage}&limit=${propertiesPage}`,
    {
      userId,
    },
  );

  return respone.data;
};
export const getDistinctPlace = async () => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getDistinctPlace`,
  );
  return respone.data;
};

export const getTransactionInformation = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/payment/vnpay_return`,
    );
    return res.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const getRateOfProperties = async () => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/property/getRateOfProperties`,
  );
  return respone.data;
};
export const getPropertyAndPriceByDistance = async (
  longitude,
  latitude,
  distance,
  check_in,
  check_out,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/property/getPropertyAndPriceByDistance?distance=${distance}&longitude=${longitude}&latitude=${latitude}`,
    {
      check_in,
      check_out,
    },
  );
  return respone.data;
};
