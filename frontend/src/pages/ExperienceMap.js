import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import "../styles/Map.css";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 18.2362, // Puerto Rico latitude
  lng: -66.4534, // Puerto Rico longitude
};

const ExperienceMap = () => {
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/experiences"); // Adjust the endpoint as needed
        const data = await response.json();

        const experiences = data.map((exp) => ({
          position: { lat: exp.geolocation.coordinates[1], lng: exp.geolocation.coordinates[0] },
          photo: exp.pictureUrl,
          name: exp.name,
          id: exp._id,
        }));

        setMarkers(experiences);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    fetchExperiences();
  }, []);

  const handleMarkerClick = (id) => {
    navigate(`/experience/${id}`);
  };

  return (
    <div className="map-container">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10} className="map">
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
            onClick={() => handleMarkerClick(marker.id)}
            /*
            icon={{
              url: marker.photo,
              scaledSize: new window.google.maps.Size(40, 40),
            }} */ // this would display the custom image
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default ExperienceMap;
