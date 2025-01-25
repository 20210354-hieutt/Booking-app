import axios from "axios";

export const getAllPayment = async (token) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/payment/getAllPayment`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        },
      );
      return response.data;
}