import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import '../styles/experienceManager.css';

const CreateExperience = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');
    const [availableVibes, setAvailableVibes] = useState([]);
    const [selectedVibes, setSelectedVibes] = useState([]);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchAvailableVibes = async () => {
        try {
            console.log('Fetching available vibes');
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

    const handleVibeSelection = (e) => {
        const vibeId = e.target.value;
        if (e.target.checked) {
            setSelectedVibes([...selectedVibes, vibeId]);
        } else {
            setSelectedVibes(selectedVibes.filter(vibe => vibe !== vibeId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user.token;

        console.log('Selected Vibes:', selectedVibes);

        try {
            const response = await fetch('/api/experiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, location, pictureUrl, vibes: selectedVibes })
            });

            console.log('Response:', pictureUrl);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            const newExperience = await response.json();
            console.log('New Experience:', newExperience);

            // Clear the form
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
        <div className="create-experience-container">
            <h3>Create Experience</h3>
            <form className="create-experience-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pictureUrl">Picture URL:</label>
                    <input
                        type="text"
                        id="pictureUrl"
                        value={pictureUrl}
                        onChange={(e) => setPictureUrl(e.target.value)}
                        required
                    />
                </div>
                <h3>Choose Vibes</h3>
                <div className="vibes-container">
                    {availableVibes.map(vibe => (
                        <div key={vibe._id} className="vibe-item">
                            <input
                                type="checkbox"
                                id={vibe.name}
                                name={vibe.name}
                                value={vibe._id}
                                onChange={handleVibeSelection}
                                checked={selectedVibes.includes(vibe._id)}
                            />
                            <label htmlFor={vibe.name}>{vibe.name}</label>
                        </div>
                    ))}
                </div>
                <button className="submit-button" type="submit">Create Experience</button>
            </form>
        </div>
    );
};

export default CreateExperience;
