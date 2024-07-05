import React from 'react';
import '../styles/Landing.css';

function Landing() {
    return (
        <div className="Landing">
            <div className="Landing-container">
                <div className="Landing-title">
                    <h1>Welcome to TravelVibes!</h1>
                </div>
                <div className="team-container">
                    <h2>Meet our team!</h2>
                    <div className="team-member-container">
                        <h3 className='team-member'>Bradley A. Rodriguez</h3>
                        <p>Full-stack Dev</p>
                        <h3 className='team-member'>Leandro Pagani</h3>
                        <p>Backend Dev</p>
                        <h3 className='team-member'>Sebastian Quiñones</h3>
                        <p>Frontend Dev</p>
                    </div>
                </div>
                <div>
                    <h1 className='features-header'>Features</h1>
                </div>
                <div className="feature">
                    <h2>Vibe Matching</h2>
                    <p>Match up your vibes with our growing experiences database!</p>
                </div>
                <div className="feature">
                    <h2>Map View</h2>
                    <p>View our experiences as pins in our seamless map experience!</p>
                </div>
                <div className="feature">
                    <h2>Experience Creation</h2>
                    <p>Share your experiences with the world!</p>
                </div>
                <div className="feature">
                    <h2>Automatic Notifications</h2>
                    <p>Receive an email when an experience added matches your vibes!</p>
                </div>
                <div className="Website-link">
                    <a href="/home" className="home-button">Visit TravelVibesPR!</a>
                </div>

                <footer className="footer">
                    <p>&copy; 2024 TravelVibesPR. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default Landing;
