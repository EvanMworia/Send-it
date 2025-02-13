import React, { useState, useEffect } from "react";
import axios from "axios";

const AreaProgressChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/parcels");
        const parcels = response.data;
        const locationData = parcels.reduce((acc, parcel) => {
          const location = parcel.SendingLocation;
          if (!acc[location]) {
            acc[location] = { location, count: 0 };
          }
          acc[location].count += 1;
          return acc;
        }, {});
        const totalParcels = parcels.length;
        const chartData = Object.values(locationData).map((item) => ({
          ...item,
          percentValues: ((item.count / totalParcels) * 100).toFixed(2),
        }));

        setData(chartData);
      } catch (error) {
        setError("Error fetching parcel data");
      } finally {
        setLoading(false);
      }
    };

    fetchParcelData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Popular Sending Locations</h4>
      </div>
      <div className="progress-bar-list">
        {data.map((progressbar) => (
          <div className="progress-bar-item" key={progressbar.location}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.location}</p>
              <p className="bar-item-info-value">{progressbar.percentValues}%</p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `${progressbar.percentValues}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;