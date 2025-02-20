import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Delete.css';

const Delete = () => {
  const { ParcelID } = useParams();
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/parcel/parcels/${ParcelID}`);
        setParcelData(response.data.data);
      } catch (error) {
        setError('Error fetching parcel data');
      } finally {
        setLoading(false);
      }
    };

    if (ParcelID) {
      fetchParcelData();
    }
  }, [ParcelID]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:4000/parcel/parcels/${ParcelID}`);
      navigate('/dashboard');
    } catch (error) {
      setError('Error deleting parcel');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!parcelData) {
    return <p>No parcel data found.</p>;
  }

  return (
    <section className="delete-section">
      <div className="delete-container">
        <h2>Delete Parcel</h2>
        <p>Are you sure you want to delete the parcel with ID: {parcelData.ParcelID}?</p>
        <button onClick={handleShowModal} className="delete-button">Delete</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this parcel?</p>
            <button onClick={handleDelete} className="confirm-button">Yes, Delete</button>
            <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Delete;