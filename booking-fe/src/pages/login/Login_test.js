import React, { useState } from "react";
import "./login.css";
import HeaderLogin from "../../componets/header/HeaderLogin";

function Login_test() {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const [errorSignUp, setErrorSignUp] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false); // New state to check if email is verified
  const [emailExists, setEmailExists] = useState(null); // New state to store if email exists in database

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const checkEmailInDatabase = (email) => {
    // Fake API call to check if email exists in the database
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "existingemail@example.com") {
          resolve(true); // Email exists
        } else {
          resolve(false); // Email does not exist
        }
      }, 1000);
    });
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setErrorSignUp("");
    const emailExistsInDb = await checkEmailInDatabase(inputData.email);
    setEmailExists(emailExistsInDb);
    setIsEmailChecked(true); // Email check is done
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (inputData.password.length <= 8) {
      setErrorSignUp("Mật khẩu phải lớn hơn 8");
      return;
    }
    // Proceed with login API call
    console.log("Logging in with:", inputData);
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    // Proceed with sign-up API call
    console.log("Signing up with:", inputData);
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

          <h2>
            {emailExists === null
              ? "Log In"
              : emailExists
                ? "Log In"
                : "Sign Up"}
          </h2>
          <div className="signUpText">
            {emailExists === null
              ? "Don't have an account? Enter your email to check."
              : emailExists
                ? "Welcome back!"
                : "You don't have an account, please sign up."}
          </div>

          <div className="formLoginContainer">
            <form
              className="formLogin"
              onSubmit={
                emailExists === null
                  ? handleCheckEmail
                  : emailExists
                    ? handleLogin
                    : handleSignUp
              }
            >
              <input
                type="email"
                name="email"
                placeholder="email"
                onChange={handleInputChange}
                disabled={isEmailChecked}
              />
              {isEmailChecked && (
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={handleInputChange}
                />
              )}
              <p>{errorSignUp}</p>
              <div className="buttonGroup">
                {!isEmailChecked && <button type="submit">Check Email</button>}
                {isEmailChecked && (
                  <button type="submit">
                    {emailExists ? "Login" : "Sign Up"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_test;
