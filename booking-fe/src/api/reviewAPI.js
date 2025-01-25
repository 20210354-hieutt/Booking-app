import axios from "axios";

export const createReview = async (data, token) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/createReview`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  ); 
  return respone.data;
};
export const getMonthlyRate = async (owner_id) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/review/getMonthlyRating/${owner_id}`,
  );
  return respone.data;
};
export const getMonthlyRateByProperty = async (property_id) => {
  console.log(property_id);

  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/review/getMonthlyRatingByProperty/${property_id}`,
  );
  return respone.data;
};
export const findReviewWithProperty = async (property_id, page) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/review/findReviewWithProperty/${property_id}?page=${page}`,
  );
  return respone.data;
};
export const getReviewByRate = async (property_id, minRate, maxRate, page) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/getReviewByRate/${property_id}?page=${page}`,
    { min: minRate, max: maxRate },
  );
  return respone.data;
};
export const getReviewByType = async (property_id, review_type, page) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/getReviewByType/${property_id}?page=${page}`,
    { review_type },
  );
  return respone.data;
};
export const getReviewByRateAndType = async (
  property_id,
  review_type,
  min,
  max,
  page,
) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/getReviewByRateAndType/${property_id}?page=${page}`,
    { review_type, min, max },
  );
  return respone.data;
};
