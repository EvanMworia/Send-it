import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminHistory.css';

const TABLE_HEADS = [
  "id",
  "Sender Name",
  "Receiver Name",
  "Sending Location",
  "Pickup Location",
  "Status",
];

const AdminHistory = () => {
  const [parcelData, setParcelData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParcelAndUserData = async () => {
      try {
        const [parcelsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:4000/parcels"),
          axios.get("http://localhost:4000/users/getAllUsers"),
        ]);
        setParcelData(parcelsResponse.data);
        setUserData(usersResponse.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchParcelAndUserData();
  }, []);

  const getUserNameById = (id) => {
    const user = userData.find((user) => user.id === id);
    return user ? user.FullName : "Unknown";
  };

  const filteredParcels = parcelData.filter(parcel => parcel.Status === "Picked");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Picked Parcels</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredParcels?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.id}</td>
                  <td>{getUserNameById(dataItem.SenderID)}</td>
                  <td>{getUserNameById(dataItem.ReceiverID)}</td>
                  <td>{dataItem.SendingLocation}</td>
                  <td>{dataItem.PickupLocation}</td>
                  <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.Status.toLowerCase()}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.Status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminHistory;