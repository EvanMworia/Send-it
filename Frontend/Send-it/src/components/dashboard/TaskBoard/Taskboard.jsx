import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './Taskboard.css';
import emptybox from "../../../assets/images/empty-preview.png";
import Location from '../../Location/Location';

const Taskboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedRole, setSelectedRole] = useState('Sender');
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    const fetchPackagesAndUsers = async () => {
      try {
        const [packagesResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:4000/parcels'),
          axios.get('http://localhost:4000/users/getAllUsers')
        ]);
        setPackages(packagesResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesAndUsers();
  }, []);

  const getUserNameById = (id) => {
    const user = users.find((user) => user.id === id);
    return user ? user.FullName : 'Unknown';
  };

  const handleParcelClick = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
  };

  const filteredPackages = packages.filter((pkg) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) return false;
    const isSenderOrReceiver = pkg.SenderID === loggedInUser.id || pkg.ReceiverID === loggedInUser.id;
    if (!isSenderOrReceiver) return false;
    if (selectedRole === 'Sender' && pkg.SenderID !== loggedInUser.id) return false;
    if (selectedRole === 'Receiver' && pkg.ReceiverID !== loggedInUser.id) return false;
    if (selectedFilter === 'All') return true;
    return pkg.Status === selectedFilter;
  });

  return (
    <section>
      <nav>
        <h2
          className={selectedRole === 'Sender' ? 'selected-role' : ''}
          onClick={() => handleRoleClick('Sender')}
        >
          Sending
        </h2>
        <h2
          className={selectedRole === 'Receiver' ? 'selected-role' : ''}
          onClick={() => handleRoleClick('Receiver')}
        >
          Receiving
        </h2>
      </nav>
      <div className="filter-buttons">
        {['All', 'Pending', 'In Transit', 'Delivered'].map((filter) => (
          <button
            key={filter}
            className={selectedFilter === filter ? 'selected' : ''}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
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
            <div className="card" key={pkg.ParcelID} onClick={() => handleParcelClick(pkg)}>
              <h2>Parcel</h2>
              <VerticalTimeline layout="1-column" className="custom-timeline">
                <VerticalTimelineElement
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff', width: '10px', height: '10px' }}
                  icon={<div className="custom-icon"></div>}
                >
                  <h3 className="vertical-timeline-element-title">Sending Location</h3>
                  <p>{pkg.SendingLocation}</p>
                  <p>Sender: {getUserNameById(pkg.SenderID)}</p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff', width: '10px', height: '10px' }}
                  icon={<div className="custom-icon"></div>}
                >
                  <h3 className="vertical-timeline-element-title">Pickup Location</h3>
                  <p>{pkg.PickupLocation}</p>
                  <p>Receiver: {getUserNameById(pkg.ReceiverID)}</p>
                </VerticalTimelineElement>
              </VerticalTimeline>
            </div>
          ))
        )}
      </div>
      {selectedParcel && (
        <Location
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          parcel={selectedParcel}
        />
      )}
    </section>
  );
};

export default Taskboard;