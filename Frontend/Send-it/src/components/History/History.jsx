import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./History.css";
import emptybox from "../../assets/images/empty-preview.png";

const History = () => {
  const [selectedRole, setSelectedRole] = useState("Sender");
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    const fetchPackagesAndUsers = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser || !loggedInUser.User || !loggedInUser.User.UserID) {
          throw new Error("User is not logged in or UserID is not available");
        }
        const [packagesResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:4000/parcel/parcels'),
          axios.get(`http://localhost:4000/users/getUserById/${loggedInUser.User.UserID}`)
        ]);
        setPackages(packagesResponse.data.data || []); // Ensure packages is an array
        setUsers(usersResponse.data || []); // Ensure users is an array
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesAndUsers();
  }, []);

  const getUserNameById = (UserID) => {
    const user = users.find((user) => user.UserID === UserID);
    return user ? user.FullName : "Unknown";
  };

  const filteredPackages = Array.isArray(packages) ? packages.filter((pkg) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) return false;
    const isSenderOrReceiver =
      pkg.SenderID === loggedInUser.User.UserID || pkg.ReceiverID === loggedInUser.User.UserID;
    if (!isSenderOrReceiver) return false;
    if (pkg.Status !== "Picked") return false;
    if (selectedRole === "Sender" && pkg.SenderID !== loggedInUser.User.UserID)
      return false;
    if (selectedRole === "Receiver" && pkg.ReceiverID !== loggedInUser.User.UserID)
      return false;
    return true;
  }) : [];

  return (
    <section>
      <nav>
        <h2
          className={selectedRole === "Sender" ? "selected-role" : ""}
          onClick={() => handleRoleClick("Sender")}
        >
          Sending
        </h2>
        <h2
          className={selectedRole === "Receiver" ? "selected-role" : ""}
          onClick={() => handleRoleClick("Receiver")}
        >
          Receiving
        </h2>
      </nav>
      <div className="package-cards">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredPackages.length === 0 ? (
          <div className="empty-state">
            <img src={emptybox} alt="Empty box" />
            <p>Nothing to see here</p>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <div className="card" key={pkg.ParcelID}>
              <h2>Parcel</h2>
              <VerticalTimeline layout="1-column" className="custom-timeline">
                <VerticalTimelineElement
                  iconStyle={{
                    background: "rgb(33, 150, 243)",
                    color: "#fff",
                    width: "10px",
                    height: "10px",
                  }}
                  icon={<div className="custom-icon"></div>}
                >
                  <h3 className="vertical-timeline-element-title">
                    Sending Location
                  </h3>
                  <p>{pkg.SendingLocation}</p>
                  <p>Sender: {getUserNameById(pkg.SenderID)}</p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  iconStyle={{
                    background: "rgb(33, 150, 243)",
                    color: "#fff",
                    width: "10px",
                    height: "10px",
                  }}
                  icon={<div className="custom-icon"></div>}
                >
                  <h3 className="vertical-timeline-element-title">
                    Pickup Location
                  </h3>
                  <p>{pkg.PickupLocation}</p>
                  <p>Receiver: {getUserNameById(pkg.ReceiverID)}</p>
                </VerticalTimelineElement>
              </VerticalTimeline>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default History;