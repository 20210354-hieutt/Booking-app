import React, { useState } from "react";
import "./Signup.css"; // Optional: for custom styling

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [hiddenSignUp, changeHiddenState] = useState(true);

  const handleHidden = (e) => {
    changeHiddenState((prev) => !prev);
  };

  const [isSignUp, setIsSignUp] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSignUp(true);
  };
  return (
    <div className="signup-container">
      {isSignUp ? (
        <div className="signup-box">
          <h2>Sign Up</h2>
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>

          <div className="social-signup">
            <button className="social-btn google-btn">Google</button>
          </div>

          <p className="or-divider">OR</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {/* <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          /> */}

            {hiddenSignUp ? (
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div></div>
            )}

            <button type="submit" className="signup-btn">
              Sign Up
            </button>

            <button type="button" onClick={handleHidden}>
              Change
            </button>
          </form>

          <p>
            By signing up you agree to our <a href="/terms">Terms of Service</a>{" "}
            and <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Signup;
