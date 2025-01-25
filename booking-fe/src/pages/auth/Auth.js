import { useLocation, useNavigate } from "react-router-dom";
import HeaderLogin from "../../componets/header/HeaderLogin";

import "./Auth.css";
import {
  checkResetPasswordToken,
  confirmSignUpWithEmail,
  resetPassword,
} from "../../api/userAPI";
import { useEffect, useState } from "react";

const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const continueUrl = queryParams.get("continueUrl");
  const [inputData, setInputData] = useState({
    password: "",
    email: "",
    rePassword: "",
  });
  const [errorForgotPassword, setErrorForgotPassword] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputData({
      ...inputData,
      [name]: value,
    });
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const continueParams = new URLSearchParams(new URL(continueUrl).search);
    const token = continueParams.get("token");
    const userId = continueParams.get("userId");
    const email = localStorage.getItem("email");
    inputData.email = email;
    try {
      console.log(inputData);

      const respone = await checkResetPasswordToken(userId, token, inputData);

      if (respone.message === true) {
        const handleResetPassword = await resetPassword(inputData);
        if (handleResetPassword === "") {
          navigate("/login");
        } else {
          setErrorForgotPassword(handleResetPassword);
        }
      } else {
        setErrorForgotPassword(respone.message);
      }
    } catch (err) {
      setErrorForgotPassword(err.response.data.message);
    }
  };
  const getToken = () => {
    return localStorage.getItem("signUpInfo");
  };
  const verifyEmail = async () => {
    const token = getToken();

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp > Date.now() / 1000) {
        const response = await confirmSignUpWithEmail(payload);
        console.log(response);

        if (response) {
          navigate("/login");
        }
      }
    } catch (error) {
      return false;
    }
  };
  return (
    <div>
      <HeaderLogin />
      <div className="loginContainer">
        {mode === "verifyEmail" && (
          <div className="loginPanel">
            <div className="getOutBtn">
              <a href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-x"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                </svg>
              </a>
            </div>

            <h1>Verify Email</h1>
            <button onClick={() => verifyEmail()}>
              Click here to verify your email
            </button>
          </div>
        )}
        {mode === "resetPassword" && (
          <div className="loginPanel">
            <div className="getOutBtn">
              <a href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-x"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                </svg>
              </a>
            </div>

            <h2>Reset password</h2>
            <div className="formLoginContainer">
              <form
                className="formLogin"
                onSubmit={(e) => handleResetPassword(e)}
              >
                <div className="loginInput">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="password"
                    name="rePassword"
                    placeholder="Re-enter password"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errorForgotPassword && (
                  <p className="errorMessage">{errorForgotPassword}</p>
                )}

                <div className="buttonGroup">
                  <button type="submit" name="login">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Auth;
