import React from 'react';
import { Link } from 'react-router-dom';

const SignupThanks = () => {
    return (
        <div>
            <h2>Thank You for Signing Up!</h2>
            <p>Your account has been created successfully.</p>
            <Link to="/">Go to Homepage</Link>
            <Link to="/select-vibes">Add your vibes!</Link>
        </div>
    );
}

export default SignupThanks;
