import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'
import { useEffect, useState } from 'react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ startLocation, endLocation }) => {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const geocodeLocation = async (location) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    };

    const fetchData = async () => {
      const start = await geocodeLocation(startLocation);
      const end = await geocodeLocation(endLocation);
      setStartCoords(start);
      setEndCoords(end);
      
      // Get route data
      const serviceUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const routeResponse = await fetch(serviceUrl);
      const routeData = await routeResponse.json();
      
      setRouteCoords(routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      setDistance((routeData.routes[0].distance / 1000).toFixed(2));
    };

    fetchData();
  }, [startLocation, endLocation]);

  if (!startCoords || !endCoords) return <div>Loading...</div>;

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={startCoords}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={startCoords}>
          <Popup>{startLocation}</Popup>
        </Marker>

        <Marker position={endCoords}>
          <Popup>{endLocation}</Popup>
        </Marker>

        <Polyline 
          positions={routeCoords}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      </MapContainer>

      {distance && (
        <div style={{ marginTop: '10px' }}>
          Distance between {startLocation} and {endLocation}: {distance} km
        </div>
      )}
    </div>
  );
};

export default Map;