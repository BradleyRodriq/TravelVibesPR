import React from 'react';
import '../styles/Landing.css';

function Landing() {
    return (
        <div className="Landing">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Our Landing Page</h1>
                    <p>Discover amazing features and more!</p>
                    <a href="#" className="cta-button">Get Started</a>
                </div>
            </section>

            <section className="features">
                <div className="feature">
                    <h2>Feature 1</h2>
                    <p>Details about Feature 1.</p>
                </div>
                <div className="feature">
                    <h2>Feature 2</h2>
                    <p>Details about Feature 2.</p>
                </div>
                {/* Add more features as needed */}
            </section>

            <footer className="footer">
                <p>&copy; 2024 Bradley Rodriguez. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Landing;
