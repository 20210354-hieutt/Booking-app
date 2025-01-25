import React, { useEffect, useState } from "react";
import "./Signup-page.css";
import HeaderLogin from "../../componets/header/HeaderLogin";
import { checkEmail, signIn, signUp } from "../../api/userAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getProvince } from "../../api/addressAPI";
import Error from "../../componets/404/404Page";
const provider = new GoogleAuthProvider();

function SignUp_page() {
  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: "AIzaSyDYdEjNqRULS_W0926owilWh2pP2x_bUxk",
    authDomain: "maithetuan-20211010.firebaseapp.com",
    projectId: "maithetuan-20211010",
    storageBucket: "maithetuan-20211010.firebasestorage.app",
    messagingSenderId: "435921427887",
    appId: "1:435921427887:web:b06070ed551bb244d2a35a",
    measurementId: "G-Q0EX51YDGG"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const initialInputData = {
    email: "",
    password: "",
    userName: "",
    birthday: "",
    number: "",
    address: {
      province: "",
      district: "",
      ward: "",
    },
  };

  const [inputData, setInputData] = useState({
    email: "",
    password: "",
    userName: "",
    birthday: "",
    number: "",
    address: {
      province: "",
      district: "",
      ward: "",
    },
  });

  const [errorSignUp, setErrorSignUp] = useState("");

  const [enter, setEnter] = useState(false);

  const handleClickLogIn = () => {
    console.log("fun");
  };
  const [address, setAddress] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();
  const handleGetAddress = async () => {
    const respone = await getProvince();
    setAddress(respone);
  };
  const getDistrict = async (code) => {
    const findDistrict = address.find((index) => index.code === parseInt(code));
    console.log(findDistrict);

    setDistrict(findDistrict.districts);
  };
  const getWard = async (code) => {
    const findWard = district.find((index) => index.code === parseInt(code));
    console.log(findWard);

    setWard(findWard?.wards);
  };
  useEffect(() => {
    handleGetAddress();
  }, []);
  const handleChangeOptions = async (e) => {
    const { name, value } = e.target;
    const selectedOptions = e.target.options[e.target.selectedIndex];
    const code = selectedOptions.getAttribute("data-code");

    if (name === "province") {
      await getDistrict(code);
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "district") {
      await getWard(code);
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "ward") {
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  async function handleSubmit(event, inputData) {
    event.preventDefault();
    const action = event.nativeEvent.submitter.name;
    console.log(inputData);

    const respone = await signUp(inputData);

    if (typeof respone === "string") {
      setErrorSignUp(respone);
    } else {
      localStorage.setItem("signUpInfo", respone.jwtToken);
      navigate("/login");
      alert("Verify email has been sent!");
    }
  }

  async function handleCheckEmail() {
    console.log(inputData);

    const respone = await checkEmail(inputData.email);

    if (!respone) {
      setErrorSignUp("");
      setEnter(true);
    } else {
      setErrorSignUp("Email has already existed");
    }
  }

  function handleGoBackToEmail() {
    setErrorSignUp("");
    setInputData({
      ...initialInputData,
      email: inputData.email,
    });
    setEnter(false);
  }

  const [userId, setUserId] = useState();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
  }, []);

  return (
    <div>
      {!userId ? (
        <>
          <HeaderLogin />
          <div className="signUpContainer">
            <div className="signUpPanel">
              {enter && (
                <button
                  className="backBtn"
                  onClick={(e) => {
                    handleGoBackToEmail();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.854 4.146a.5.5 0 0 1 0 .708L2.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 8a.5.5 0 0 1-.5.5H2.707a.5.5 0 0 1 0-1H9.5A.5.5 0 0 1 10 8z"
                    />
                  </svg>
                </button>
              )}
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

              <h2>Sign Up</h2>
              <div className="logInText">
                Do u have an account ?
                <a href="/login">
                  <span onClick={handleClickLogIn} className="logInLink">
                    Log In
                  </span>
                </a>
              </div>

              <div className="formSignUpContainer">
                <form
                  className="formSignUp"
                  onSubmit={(e) => {
                    handleSubmit(e, inputData);
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                  />

                  {enter && (
                    <div className="formSignUp">
                      <input
                        type="text"
                        name="userName"
                        placeholder="Tên đăng nhập"
                        onChange={handleInputChange}
                      />
                      <input
                        type="date"
                        name="dob"
                        placeholder="ngày sinh"
                        onChange={handleInputChange}
                      />
                      <input
                        type="number"
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handleInputChange}
                      />
                      <label>Địa chỉ:</label>
                      <div className="address-group">
                        <select
                          id="province"
                          name="province"
                          onChange={handleChangeOptions}
                          required
                        >
                          <option value="">Tỉnh/Thành phố</option>
                          {address.map((index) => (
                            <option value={index.name} data-code={index.code}>
                              {index.name}
                            </option>
                          ))}
                        </select>

                        <select
                          id="district"
                          name="district"
                          onChange={handleChangeOptions}
                        >
                          <option value="">Quận/Huyện</option>
                          {district?.map((index) => (
                            <option value={index.name} data-code={index.code}>
                              {index.name}
                            </option>
                          ))}
                        </select>

                        <select
                          id="ward"
                          name="ward"
                          onChange={handleChangeOptions}
                        >
                          <option value="">Phường/Xã</option>
                          {ward?.map((index) => (
                            <option value={index.name} data-code={index.code}>
                              {index.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {errorSignUp && <p className="errorMessage">{errorSignUp}</p>}
                  <div className="signUp-buttonGroup">
                    {!enter && (
                      <button type="button" onClick={(e) => handleCheckEmail()}>
                        Enter
                      </button>
                    )}
                    {enter && (
                      <button type="submit" name="signup">
                        Sign Up
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default SignUp_page;
