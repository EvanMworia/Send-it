import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './Delivery.css';

const Delivery = () => {
  const [formData, setFormData] = useState({
    SenderID: '',
    ReceiverID: '',
    SendingLocation: '',
    PickupLocation: '',
    Status: 'Pending',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data.filter(user => user.Role === 'User'));
      } catch (error) {
        setError('Error fetching users');
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
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post('http://localhost:3000/parcels', {
        ...formData,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        IsDeleted: false,
      });
      if (response.status === 201) {
        setSuccessMessage('Parcel created successfully!');
        setFormData({
          SenderID: '',
          ReceiverID: '',
          SendingLocation: '',
          PickupLocation: '',
          Status: 'Pending',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      setError('Error creating parcel');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(user => ({
    value: user.id,
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
              name="SenderID"
              value={userOptions.find(option => option.value === formData.SenderID)}
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
              name="ReceiverID"
              value={userOptions.find(option => option.value === formData.ReceiverID)}
              onChange={handleSelectChange}
              options={userOptions}
              isClearable
              placeholder="Select Receiver"
              required
            />
          </div>
          <div>
            <label>Sending Location:</label>
            <input
              type="text"
              name="SendingLocation"
              value={formData.SendingLocation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Pickup Location:</label>
            <input
              type="text"
              name="PickupLocation"
              value={formData.PickupLocation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Parcel'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Delivery;