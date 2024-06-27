import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 18.2362, // Puerto Rico latitude
  lng: -66.4534, // Puerto Rico longitude
};

const ExperienceMap = () => {
  const [markers, setMarkers] = useState([]);

  const addAdvancedMarker = async (photo, name, lat, lng) => {
    const marker = {
      position: { lat, lng },
      photo: photo,
      name: name,
    };

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  // Example to add a marker (can be triggered by an event or useEffect)
  useEffect(() => {
    addAdvancedMarker("https://example.com/photo.jpg", "Example Place", 18.2362, -66.4534);
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDP8zkTwAzKinxwNbrxis42EyX5dCkece4">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

const MapPage = () => {
  return (
    <div>
      <h3>Experience Map</h3>
      <ExperienceMap />
    </div>
  );
};

export default MapPage;
