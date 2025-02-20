import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./Delivery.css";

const Delivery = () => {
  const [formData, setFormData] = useState({
    senderId: "",
    receiverId: "",
    sendingLocation: "",
    pickupLocation: "",
    status: "Pending",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const majorTowns = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Garissa', 'Nyeri'
  ];
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const token = loggedInUser.token;

        const response = await axios.get(
          "http://localhost:4000/users/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.filter((user) => user.Role === "User"));
      } catch (error) {
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const token = loggedInUser.token;

      const response = await axios.post(
        "http://localhost:4000/parcel/parcels",
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setSuccessMessage("Parcel created successfully!");
        setFormData({
          senderId: "",
          receiverId: "",
          sendingLocation: "",
          pickupLocation: "",
          status: "Pending",
        });
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.UserID,
    label: user.FullName,
  }));

  return (
    <section className="delivery-section">
      <div className="delivery-container">
        <h2>Create Parcel Delivery</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Sender:</label>
            <Select
              name="senderId"
              value={userOptions.find(
                (option) => option.value === formData.senderId
              )}
              onChange={handleSelectChange}
              options={userOptions}
              isClearable
              placeholder="Select Sender"
              required
            />
          </div>
          <div>
            <label>Receiver:</label>
            <Select
              name="receiverId"
              value={userOptions.find(
                (option) => option.value === formData.receiverId
              )}
              onChange={handleSelectChange}
              options={userOptions}
              isClearable
              placeholder="Select Receiver"
              required
            />
          </div>
          <div>
            <label>Sending Location:</label>
            <select
              name="sendingLocation"
              value={formData.sendingLocation}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Location</option>
              {majorTowns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Pickup Location:</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Location</option>
              {majorTowns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Parcel"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Delivery;
