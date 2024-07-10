import React from 'react';
import '../styles/Landing.css';
import BradleyImage from '../pictures/bradley.jpg';
import LeandroImage from '../pictures/leandro.jpg';
import SebastianImage from '../pictures/sebastian.jpg'
import VibesImage from '../pictures/vibes.png';
import MapImage from '../pictures/Map-view.png';
import ExperienceImage from '../pictures/experiences.png';

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
                        <div className="team-member">
                            <img src={BradleyImage} alt="Bradley A. Rodriguez" />
                            <h3>Bradley Rodriguez</h3>
                            <p>Full-stack Dev</p>
                        </div>
                        <div className="team-member">
                            <img src={LeandroImage} alt="Leandro Pagani" />
                            <h3>Leandro Pagani</h3>
                            <p>Backend Dev</p>
                        </div>
                        <div className="team-member">
                            <img src={SebastianImage} alt="Sebastian Quiñones" />
                            <h3>Sebastian Quiñones</h3>
                            <p>Frontend Dev</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="features-header">Features</h1>
                </div>
                <div className="feature">
                <h2 className='feature-head'>Vibe Matching</h2>
                <p>Match up your vibes with our growing experiences database!</p>
                    <img src={VibesImage} alt="Vibes" />

                </div>
                <div className="feature">
                    <h2 className='feature-head'>Map View</h2>
                    <p>View our experiences as pins in our seamless map experience!</p>
                    <img src={MapImage} alt="Map View" />

                </div>
                <div className="feature">
                    <h2 className='feature-head'>Experience Creation</h2>
                    <p>Share your experiences with the world!</p>
                    <img src={ExperienceImage} alt="Experiences" />
                </div>
                <div className="feature">
                    <h2 className='feature-head'>Automatic Notifications</h2>
                    <p>Receive an email when an experience added matches your vibes!</p>
                </div>
                <div className="Website-link">
                    <a href="/home" className="home-button">Click Here to Visit TravelVibesPR!</a>
                </div>
                <footer className="footer">
                    <p>&copy; 2024 TravelVibesPR. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default Landing;
