import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-bottom">
                <p className="footer-copyright">
                    &copy; 2024 TravelVibesPR. All rights reserved.
                </p>
                <div className="footer-social">
                    <span className="footer-tagline">
                        <svg className="heart-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        Made for Puerto Rico
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
