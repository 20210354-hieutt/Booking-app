import axios from "axios";

export const getProvince = async () => {
  const respone = await axios.get("https://provinces.open-api.vn/api/?depth=3");
  return respone.data;
};
