import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
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
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
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
          description: exp.description, // Assuming there is a description field
          id: exp._id,
        }));

        setMarkers(experiences);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

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
    <div className="map-container">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10} className="map">
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
            onClick={() => handleMarkerClick(marker)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={handleMouseOut}
            /*
            icon={{
              url: marker.photo,
              scaledSize: new window.google.maps.Size(
                activeMarker === index ? 50 : 40,
                activeMarker === index ? 50 : 40
              ),
            }}
            */
          />
        ))}

        {selectedMarker && (
          <InfoWindow className="info-window-container"
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="info-window">
              <h2>{selectedMarker.name}</h2>
              <p>{selectedMarker.description}</p>
              <img
                src={selectedMarker.photo}
                alt={selectedMarker.name}
                style={{ width: "100px" }}
              />
              <button
                onClick={() => navigate(`/experience/${selectedMarker.id}`)}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default ExperienceMap;
