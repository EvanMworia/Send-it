import React from 'react';
import Modal from 'react-modal';

import './Location.css';
import Map from '../Map/map';

const ParcelInformation = ({ isOpen, onRequestClose, parcel }) => {
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="parcel-modal" overlayClassName="parcel-modal-overlay">
      <h2>Parcel Information</h2>
      <p><strong>Parcel ID:</strong> {parcel.ParcelID}</p>
      <p><strong>Sender:</strong> {parcel.SenderName}</p>
      <p><strong>Receiver:</strong> {parcel.ReceiverName}</p>
      <p><strong>Sending Location:</strong> {parcel.SendingLocation}</p>
      <p><strong>Pickup Location:</strong> {parcel.PickupLocation}</p>
      <p><strong>Status:</strong> {parcel.Status}</p>
      <Map  startLocation={parcel.SendingLocation} 
        endLocation="parcel.PickupLocation"
      />
      <button onClick={onRequestClose} className="close-button">Close</button>
    </Modal>
  );
};

export default ParcelInformation;