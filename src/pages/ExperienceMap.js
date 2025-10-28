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
          description: exp.location || 'Puerto Rico', // Use location as description
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
          description: exp.location || 'Puerto Rico', // Use location as description
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
    <div className="map-wrapper">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#1e293b" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0f172a" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#94a3b8" }]
            }
          ]
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
            onClick={() => handleMarkerClick(marker)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={handleMouseOut}
            icon={{
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="${activeMarker === index ? '#7c3aed' : '#8b5cf6'}"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                  ${activeMarker === index ? '<circle cx="20" cy="20" r="24" fill="#a78bfa" opacity="0.3"/>' : ''}
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40)
            }}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="map-info-window">
              <div className="map-info-header">
                <h3>{selectedMarker.name}</h3>
                <p className="map-info-location">{selectedMarker.description}</p>
              </div>
              <img
                src={selectedMarker.photo || 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop'}
                alt={selectedMarker.name}
                className="map-info-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop';
                }}
              />
              <button
                onClick={() => navigate(`/experience/${selectedMarker.id}`)}
                className="map-info-button"
              >
                View Experience
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default ExperienceMap;
