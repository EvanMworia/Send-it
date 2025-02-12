import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    FullName: '',
    Email: '',
    Phone: '',
    ProfilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
          const response = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
          const user = response.data;
          setUserData({
            FullName: user.FullName,
            Email: user.Email,
            Phone: user.Phone,
            ProfilePicture: user.ProfilePicture,
          });
        }
      } catch (error) {
        setError('Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
      const currentUserData = response.data;

      const updatedUserData = {
        ...currentUserData,
        ...userData,
      };

      await axios.put(`http://localhost:3000/users/${loggedInUser.id}`, updatedUserData);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/'); 
      }, 3000);
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="profile-section">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h2>Profile</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="FullName"
              value={userData.FullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              name="Phone"
              value={userData.Phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Profile Picture:</label>
            <input
              type="text"
              name="ProfilePicture"
              value={userData.ProfilePicture}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;