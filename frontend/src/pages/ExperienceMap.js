import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
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

  useEffect(() => {
    const addAdvancedMarker = async (photo, name, lat, lng) => {
      const marker = {
        position: { lat, lng },
        photo: photo,
        name: name,
      };

      setMarkers((prevMarkers) => [...prevMarkers, marker]);
    };

    addAdvancedMarker("https://example.com/photo.jpg", "Example Place", 18.2362, -66.4534);
  }, []);

  return (
    <div className="map-container">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10} className="map">
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default ExperienceMap;
