import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/parcel/parcels');
        const parcels = response.data;
        const userNotifications = Object.values(parcels).filter(
          (parcel) => parcel.ReceiverID === loggedInUser.User.UserID && parcel.Status === 'Delivered'
        );

        setNotifications(userNotifications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className='notification-list'>
          {notifications.map((notification) => (
            <li key={notification.ParcelID} className='notification-item'>
              Your parcel from {notification.SendingLocation} to {notification.PickupLocation} has been delivered.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;