import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupThanks.css';

const SignupThanks = () => {
    return (
        <div className="signup-thanks-container">
            <h2>Thank You for Signing Up!</h2>
            <p>Your account has been created successfully.</p>
            <Link to="/home" className="btn-link">Go to Homepage</Link>
            <Link to="/select-vibes" className="btn-link">Add your vibes!</Link>
        </div>
    );
};

export default SignupThanks;
