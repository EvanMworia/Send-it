import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Status.css";

const Status = () => {
  const { id } = useParams();
  const [parcelData, setParcelData] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/parcels/${id}`);
        setParcelData(response.data);
        setStatus(response.data.Status);
      } catch (error) {
        setError("Error fetching parcel data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchParcelData();
    }
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:3000/parcels/${id}`, {
        ...parcelData,
        Status: status,
        UpdatedAt: new Date(),
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Error updating parcel status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="status-section">
      <div className="status-container">
        <h2>Edit Parcel Status</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Status:</label>
            <select value={status} onChange={handleStatusChange} required>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Picked">Picked</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Status;
