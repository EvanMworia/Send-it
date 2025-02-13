import React from 'react';
import Modal from 'react-modal';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Location.css';

const ParcelInformation = ({ isOpen, onRequestClose, parcel }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: -1.2921, 
    lng: 36.8219, 
  };

  const sendingLocation = {
    lat: parseFloat(parcel.SendingLat) || center.lat,
    lng: parseFloat(parcel.SendingLng) || center.lng,
  };

  const pickupLocation = {
    lat: parseFloat(parcel.PickupLat) || center.lat,
    lng: parseFloat(parcel.PickupLng) || center.lng,
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="parcel-modal" overlayClassName="parcel-modal-overlay">
      <h2>Parcel Information</h2>
      <p><strong>Parcel ID:</strong> {parcel.ParcelID}</p>
      <p><strong>Sender:</strong> {parcel.SenderName}</p>
      <p><strong>Receiver:</strong> {parcel.ReceiverName}</p>
      <p><strong>Sending Location:</strong> {parcel.SendingLocation}</p>
      <p><strong>Pickup Location:</strong> {parcel.PickupLocation}</p>
      <p><strong>Status:</strong> {parcel.Status}</p>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
          <Marker position={sendingLocation} label="S" />
          <Marker position={pickupLocation} label="P" />
        </GoogleMap>
      </LoadScript>
      <button onClick={onRequestClose} className="close-button">Close</button>
    </Modal>
  );
};

export default ParcelInformation;