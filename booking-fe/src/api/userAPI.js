import axios from "axios";
export const signUp = async (user) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/sign-up-with-email`,
      user,
      {
        withCredentials: true,
      },
    );
    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const confirmSignUpWithEmail = async (user) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/confirm-signup`,
    user,
    {
      withCredentials: true,
    },
  );
  return respone.data;
};
export const signUpWithGoogle = async () => {};
export const signIn = async (user) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/sign-in`,
      user,
      { withCredentials: true },
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const signInWithGoogle = async (user) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/sign-in-with-google`,
      user,
      { withCredentials: true },
    );
    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const signOut = async (userId) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/session/sign-out`,
      { userId },
      { withCredentials: true },
    );
    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const resetPassword = async (user) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/reset-password`,
      user,
    );

    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const checkEmail = async (email) => {
  try {
    const respone = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/check-email`,
      {
        data: email,
      },
    );
    return respone.data;
  } catch (error) {
    const respone = error.response.data.message;

    return respone;
  }
};
export const updatePartnerAccount = async (partner) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/updatePartnerAccount`,
    { partner },
  );
  return respone.data;
};
export const updateInformationForGoogle = async (user) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/updateInformationForGoogle`,
    { user },
    {
      withCredentials: true,
    },
  );
  return respone.data;
};
export const getPendingUser = async () => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/getPendingUser`,
  );
  return respone.data;
};
export const requestToPartner = async (userId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/requestToPartner/${userId}`,
  );
  return respone.data;
};
export const checkRequestPartner = async (userId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/checkRequest/${userId}`,
  );
  return respone.data;
};
export const updateResetPasswordToken = async (userId, email) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/updateResetPasswordToken/?userId=${userId}&email=${email}`,
  );
  return respone.data;
};
export const checkResetPasswordToken = async (userId, token, user) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/checkResetPasswordToken/?userId=${userId}&token=${token}`,
    user,
  );

  return respone.data;
};
export const acceptRequestPartner = async (userId) => {
  const respone = await axios.put(
    `${process.env.REACT_APP_API_URL}/user/updateRequestPartner`,
    { userId, status: "Partner" },
  );
  return respone.data;
};
export const declineRequestPartner = async (userId) => {
  const respone = await axios.put(
    `${process.env.REACT_APP_API_URL}/user/updateRequestPartner`,
    { userId, status: "Member" },
  );
  return respone.data;
};
export const getAllUser = async (token) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/getAllUser`,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      withCredentials: true,
    },
  );
  return respone.data;
};
export const createUserWithAdmin = async (data) => {
  const respone = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/create-user`, data,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}
export const updateUserWithAdmin = async(userId, data) => {
  const respone = await axios.put(
    `${process.env.REACT_APP_API_URL}/user/updateUserById/${userId}`, data,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}
export const deleteUserWithAdmin = async(userId) => {
  const respone = await axios.delete(
    `${process.env.REACT_APP_API_URL}/user/deleteUserById/${userId}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}
export const getUserById = async(userId) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/getUserById/${userId}`,
    {
      withCredentials: true,
    },
  );
  return respone.data;
}

export const getPartner = async (token) => {
  const respone = await axios.get(
    `${process.env.REACT_APP_API_URL}/user/getPartner`,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      withCredentials: true,
    },
  );
  return respone.data;
}