import React, { useState, useEffect } from "react";
import axios from "axios";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  const [parcelData, setParcelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/parcels");
        const parcels = response.data;
        setParcelData(parcels);
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

  const totalParcels = parcelData.length;
  const deliveredParcels = parcelData.filter(parcel => parcel.Status === "Delivered").length;
  const inTransitParcels = parcelData.filter(parcel => parcel.Status === "In Transit").length;
  const pendingParcels = parcelData.filter(parcel => parcel.Status === "Pending").length;

  const calculatePercentage = (count) => {
    return totalParcels > 0 ? ((count / totalParcels) * 100).toFixed(2) : 0;
  };

  const deliveredPercentage = calculatePercentage(deliveredParcels);
  const inTransitPercentage = calculatePercentage(inTransitParcels);
  const pendingPercentage = calculatePercentage(pendingParcels);

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        cardInfo={{
          title: "Packages Delivered",
          value: deliveredParcels,
          text: `We have delivered ${deliveredParcels} parcels.`,
        }}
        percentage={deliveredPercentage}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        cardInfo={{
          title: "In Transit",
          value: inTransitParcels,
          text: `We have ${inTransitParcels} parcels in transit.`,
        }}
        percentage={inTransitPercentage}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        cardInfo={{
          title: "Pending",
          value: pendingParcels,
          text: `We have ${pendingParcels} pending parcels.`,
        }}
        percentage={pendingPercentage}
      />
    </section>
  );
};

export default AreaCards;
