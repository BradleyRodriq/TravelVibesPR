import React from 'react';
import ExperienceMap from './ExperienceMap';
import '../styles/MapPage.css';

const MapPage = () => {
  return (
    <div className="map-page-container">
      <div className="map-page-header">
        <h1>Explore Puerto Rico</h1>
        <p>Discover amazing experiences across the island</p>
      </div>
      <div className="map-page-content">
        <ExperienceMap />
      </div>
    </div>
  );
};

export default MapPage;
