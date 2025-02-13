import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = ({ sendingLocation, pickupLocation }) => {
  const [locations, setLocations] = useState({ sending: null, pickup: null });

  const geocodeLocation = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject("Geocode failed: " + status);
        }
      });
    });
  };

  useEffect(() => {
    if (window.google) {
      Promise.all([geocodeLocation(sendingLocation), geocodeLocation(pickupLocation)])
        .then(([sendingCoords, pickupCoords]) => {
          setLocations({ sending: sendingCoords, pickup: pickupCoords });
        })
        .catch((error) => console.error(error));
    }
  }, [sendingLocation, pickupLocation]);

  const mapContainerStyle = { width: "100%", height: "400px" };
  const center = locations.sending || { lat: -1.286389, lng: 36.817223 }; // Default center (Nairobi)

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
        {locations.sending && <Marker position={locations.sending} label="S" />}
        {locations.pickup && <Marker position={locations.pickup} label="P" />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;