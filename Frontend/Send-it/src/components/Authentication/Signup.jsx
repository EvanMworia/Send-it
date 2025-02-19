import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import animation from "../../assets/images/authentication-preview.png";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "User",
    CreatedAt: new Date(),
    ProfilePicture: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "name") setNameError(null);
    if (name === "email") setEmailError(null);
    if (name === "phone") setPhoneError(null);
    if (name === "password") setPasswordError(null);
    if (name === "confirmPassword") setConfirmPasswordError(null);
  };

  const register = async (userData) => {
    const response = await axios.post("http://localhost:4000/users/registerUser", userData);
    console.log('response', response);
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    let valid = true;
    if (!formData.name) {
      setNameError("Please fill in the name field.");
      valid = false;
    }
    if (!formData.email) {
      setEmailError("Please fill in the email field.");
      valid = false;
    }
    if (!formData.phone) {
      setPhoneError("Please fill in the phone field.");
      valid = false;
    }
    if (!formData.password) {
      setPasswordError("Please fill in the password field.");
      valid = false;
    }
    if (!formData.confirmPassword) {
      setConfirmPasswordError("Please fill in the confirm password field.");
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const userData = {
        FullName: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Password: formData.password,
        Role: "User",
        ProfilePicture: "joi"
      };
      const response = await register(userData);
      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "User",
          CreatedAt: new Date(),
          ProfilePicture: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        throw new Error("Failed to register user");
      }
    } catch (err) {
      setError(err.message || "An error occurred while registering the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section">
      <div className="register-image">
        <img src={animation} alt="image" />
      </div>
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          <h2>Register a New User</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <div>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div>
            <label>Phone Number: </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          <div>
            <label>Confirm Password: </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="account">
            Already Have an Account?{" "}
            <Link to="/login" className="signup-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;