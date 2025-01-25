import { useState } from "react";
import "./RegisterBox.css";
import { checkEmail } from "../../../api/userAPI";
const RegisterBox = ({ setIsRegister, setExistedUser }) => {
  const [email, setEmail] = useState();
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegister(true);
    const respone = await checkEmail(email);

    if (respone !== true) {

      setExistedUser(respone);
    }
  };
  return (
    <div className="containerr">
      <div className="content-box">
        <h1 className="title">Create your partner account</h1>
        <p className="subtitle">
          Create an account to list and manage your property.
        </p>

        <form className="form">
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="Email address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="continue-button"
            onClick={(e) => handleRegister(e)}
          >
            Continue
          </button>
        </form>

        <hr className="divider" />

        <p className="help-text">
          Questions about your property or the Extranet? Check out
          <a href="/partner-help" className="link">
            {" "}
            Partner Help
          </a>{" "}
          or ask another partner in the
          <a href="/partner-community" className="link">
            {" "}
            Partner Community
          </a>
          .
        </p>

        <button className="sign-in-button">Sign in</button>

        <p className="footer-text">
          By signing in or creating an account, you agree with our
          <a href="/terms" className="link">
            {" "}
            Terms & Conditions
          </a>{" "}
          and
          <a href="/privacy" className="link">
            {" "}
            Privacy Statement
          </a>
          .
        </p>
      </div>
    </div>
  );
};
export default RegisterBox;
