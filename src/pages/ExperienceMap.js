import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import "../styles/ExperienceMap.css";

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
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const navigate = useNavigate();

  const fetchExperiences = async () => {
    try {
      const userVibes = JSON.parse(localStorage.getItem('userVibes')) || [];

      const response = await fetch("/api/experiences"); // Adjust the endpoint as needed
      const data = await response.json();

      let experiences;
      if (userVibes.length === 0) {
        experiences = data.map((exp) => ({
          position: { lat: exp.geolocation.coordinates[1], lng: exp.geolocation.coordinates[0] },
          photo: exp.pictureUrl,
          name: exp.name,
          description: exp.description, // Assuming there is a description field
          id: exp._id,
        }));
      } else {
        // Filter experiences based on userVibes
        experiences = data.filter(exp => {
          // Assuming each experience has a `vibes` array
          return exp.vibes.some(vibe => userVibes.includes(vibe));
        }).map((exp) => ({
          position: { lat: exp.geolocation.coordinates[1], lng: exp.geolocation.coordinates[0] },
          photo: exp.pictureUrl,
          name: exp.name,
          description: exp.description, // Assuming there is a description field
          id: exp._id,
        }));
      }

      setMarkers(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

useEffect(() => {
  fetchExperiences();
}, []);


  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleMouseOver = (index) => {
    setActiveMarker(index);
  };

  const handleMouseOut = () => {
    setActiveMarker(null);
  };

  return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
            onClick={() => handleMarkerClick(marker)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={handleMouseOut}
            className={`marker ${activeMarker === index ? 'active' : ''}`}
          />
        ))}
        <div className="info">
        {selectedMarker && (
          <InfoWindow className="infoWindow"
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}

          >
            <div className="info-window-content">
              <h2 className="info-window-title">{selectedMarker.name}</h2>
              <p className="info-window-description">{selectedMarker.description}</p>
              <img
                src={selectedMarker.photo}
                alt={selectedMarker.name}
                className="info-window-image"
              />
              <button
                onClick={() => navigate(`/experience/${selectedMarker.id}`)}
                className="info-window-button"
              >
                View Details
              </button>
            </div>
          </InfoWindow>

        )}
        </div>
      </GoogleMap>
  );
};

export default ExperienceMap;
