import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupThanks.css';

const ExperienceCreated = () => {
    return (
        <div className="signup-thanks-container">
            <h2>Experience Created</h2>
            <p>Your experience has been added successfully!</p>
            <Link to="/home" className="btn-link">Go to Homepage</Link>
        </div>
    );
};

export default ExperienceCreated;
