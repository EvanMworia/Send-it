import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Map from '../Map/map';
import './Location.css';

const ParcelInformation = ({ isOpen, onRequestClose, parcel }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = { lat: -1.2921, lng: 36.8219 };
  const [sendingCoords, setSendingCoords] = useState(defaultCenter);
  const [pickupCoords, setPickupCoords] = useState(defaultCenter);

  useEffect(() => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    const geocodeLocation = (location, setCoords) => {
      if (!location) return;
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setCoords({ lat: lat(), lng: lng() });
        }
      });
    };

    geocodeLocation(parcel.SendingLocation, setSendingCoords);
    geocodeLocation(parcel.PickupLocation, setPickupCoords);
  }, [parcel.SendingLocation, parcel.PickupLocation]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="parcel-modal" overlayClassName="parcel-modal-overlay">
      <h2>Parcel Information</h2>
      <p><strong>Parcel ID:</strong> {parcel.ParcelID}</p>
      <p><strong>Sender:</strong> {parcel.SenderName}</p>
      <p><strong>Receiver:</strong> {parcel.ReceiverName}</p>
      <p><strong>Sending Location:</strong> {parcel.SendingLocation}</p>
      <p><strong>Pickup Location:</strong> {parcel.PickupLocation}</p>
      <p><strong>Status:</strong> {parcel.Status}</p>

      <Map  startLocation="Nairobi, Kenya" 
        endLocation="Mombasa, Kenya"
      />

      <button onClick={onRequestClose} className="close-button">Close</button>
    </Modal>
  );
};

export default ParcelInformation;
