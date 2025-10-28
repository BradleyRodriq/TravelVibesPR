import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import '../styles/ExperienceManager.css';

const CreateExperience = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');
    const [availableVibes, setAvailableVibes] = useState([]);
    const [selectedVibes, setSelectedVibes] = useState([]);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    // Function to fetch available vibes
    const fetchAvailableVibes = async () => {
        try {
            const response = await fetch('/api/vibes');
            if (!response.ok) {
                throw new Error('Failed to fetch available vibes');
            }
            const data = await response.json();
            setAvailableVibes(data); // Assuming the response contains an array of vibes
        } catch (error) {
            console.error('Error fetching available vibes:', error);
            setAvailableVibes([]); // Set availableVibes to empty array on error
        }
    };

    // Fetch all available vibes when the component mounts
    useEffect(() => {
        fetchAvailableVibes();
    }, []);

    // Function to handle vibe selection
    const handleVibeSelection = (e) => {
        const vibeId = e.target.value;
        if (e.target.checked) {
            setSelectedVibes([...selectedVibes, vibeId]);
        } else {
            setSelectedVibes(selectedVibes.filter(vibe => vibe !== vibeId));
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user.token;

        try {
            const response = await fetch('/api/experiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, location, pictureUrl, vibes: selectedVibes })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            const newExperience = await response.json();
            console.log('New Experience:', newExperience);

            // Clear the form fields after successful submission
            setName('');
            setLocation('');
            setPictureUrl('');
            setSelectedVibes([]);

            console.log('Experience created successfully!');
        } catch (error) {
            console.error('Error creating experience:', error);
        }
    };

    return (
        <div className="experience-manager-page">
            <div className="create-experience-container">
                <div className="form-header">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <h1>Create New Experience</h1>
                    <p>Share your favorite places with the community</p>
                </div>

                <form onSubmit={handleSubmit} className="experience-form">
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="name">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                                Experience Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter experience name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                placeholder="e.g., San Juan, Puerto Rico"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pictureUrl">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                Picture URL
                            </label>
                            <input
                                type="url"
                                id="pictureUrl"
                                placeholder="https://example.com/image.jpg"
                                value={pictureUrl}
                                onChange={(e) => setPictureUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="vibes-section">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                            </svg>
                            Select Vibes
                        </h3>
                        <div className="vibes-container">
                            {availableVibes.map(vibe => (
                                <label 
                                    key={vibe._id} 
                                    className={`vibe-checkbox ${selectedVibes.includes(vibe._id) ? 'checked' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        id={vibe._id}
                                        name={vibe._id}
                                        value={vibe._id}
                                        onChange={handleVibeSelection}
                                        checked={selectedVibes.includes(vibe._id)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="vibe-name">{vibe.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Create Experience
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateExperience;
