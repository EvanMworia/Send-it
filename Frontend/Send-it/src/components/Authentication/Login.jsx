import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import animation from "../../assets/images/authentication-preview.png";
import "./Login.css";

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
      
      const { token, Role, User } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(User));


      console.log("Login succes`sful");
      
      // Conditional navigation based on user role
      if (Role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
      console.error("Login error:", error);
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
