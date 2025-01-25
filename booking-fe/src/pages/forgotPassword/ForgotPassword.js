import HeaderLogin from "../../componets/header/HeaderLogin";
import { initializeApp } from "firebase/app";
import { getAuth, updatePassword } from "firebase/auth";
import { resetPassword } from "../../api/userAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    inputData.email = email;

    const respone = await resetPassword(inputData);
    console.log(respone);

    if (respone === "") {
      navigate("/login");
    } else {
      setErrorForgotPassword(respone);
    }
  };
  return (
    <div>
      <HeaderLogin />
      <div className="loginContainer">
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
            <form className="formLogin" onSubmit={(e) => handleSubmit(e)}>
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
      </div>
    </div>
  );
};
export default ForgotPassword;
