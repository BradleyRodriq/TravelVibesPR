import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupThanks.css';

const SignupThanks = () => {
    return (
        <div className="thank-you">
            <h2>Thank You for Signing Up!</h2>
            <p>Your account has been created successfully.</p>
            <Link to="/">Go to Homepage</Link>
            <Link to="/select-vibes">Add your vibes!</Link>
        </div>
    );
}

export default SignupThanks;
