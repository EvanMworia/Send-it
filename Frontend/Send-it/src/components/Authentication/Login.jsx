import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import animation from "../../assets/images/authentication-preview.png";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      setEmailError(null);
    } else if (name === "password") {
      setPassword(value);
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    let valid = true;
    if (!email) {
      setEmailError("Please fill in the email field.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Please fill in the password field.");
      valid = false;
    }
    if (!valid) return;

    try {
      const response = await axios.post("http://localhost:4000/users/login", {
        Email: email,
        Password: password,
      });
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login successful");
      if (user.Role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-image">
        <img src={animation} alt="Login" />
      </div>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          <button type="submit">Login</button>
          <p className="account">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;