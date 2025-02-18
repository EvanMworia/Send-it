import React, { useState, useEffect } from "react";
import axios from "axios";
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "ParcelID",
  "Sender Name",
  "Receiver Name",
  "Sending Location",
  "Receiving Location",
  "Status",
  "Action",
];

const AreaTable = () => {
  const [parcelData, setParcelData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchParcelAndUserData = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const token = loggedInUser.token;
        const [parcelsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:4000/parcel/parcels"),
          axios.get("http://localhost:4000/users/getAllUsers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        console.log(parcelsResponse.data); 
        setParcelData(Array.isArray(parcelsResponse.data) ? parcelsResponse.data : []);
        setUserData(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelAndUserData();
  }, []);

  const getUserNameById = (UserID) => {
    const user = userData.find((user) => user.UserID === UserID);
    return user ? user.FullName : "Unknown";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parcelData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(parcelData.length / itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Parcels</h4>
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
            {currentItems?.map((dataItem) => (
              <tr key={dataItem.ParcelID}>
                <td>{dataItem.ParcelID}</td>
                <td>{getUserNameById(dataItem.SenderID)}</td>
                <td>{getUserNameById(dataItem.ReceiverID)}</td>
                <td>{dataItem.SendingLocation}</td>
                <td>{dataItem.PickupLocation}</td>
                <td>
                  <div className="dt-status">
                    <span
                      className={`dt-status-dot dot-${dataItem.Status?.toLowerCase() || 'unknown'}`}
                    ></span>
                    <span className="dt-status-text">{dataItem.Status || 'Unknown'}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <AreaTableAction ParcelID={dataItem.ParcelID} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AreaTable;