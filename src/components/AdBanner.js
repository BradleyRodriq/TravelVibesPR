import React, { useState } from 'react';
import '../styles/AdBanner.css';

const AdBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="ad-banner">
            <div className="ad-content">
                <div className="ad-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Ad
                </div>
                <div className="ad-text">
                    Your ad could be here! Contact us for advertising opportunities.
                </div>
            </div>
            <button 
                className="ad-close" 
                aria-label="Close ad" 
                onClick={() => setIsVisible(false)}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    );
};

export default AdBanner;

