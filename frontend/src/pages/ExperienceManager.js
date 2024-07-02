import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';

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
        <div>
            <h3>Create Experience</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="pictureUrl">Picture URL:</label>
                    <input
                        type="text"
                        id="pictureUrl"
                        value={pictureUrl}
                        onChange={(e) => setPictureUrl(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <h3>Choose Vibes</h3>
                <div>
                    {availableVibes.map(vibe => (
                        <div key={vibe._id}>
                            <input
                                type="checkbox"
                                id={vibe._id}
                                name={vibe._id}
                                value={vibe._id}
                                onChange={handleVibeSelection}
                                checked={selectedVibes.includes(vibe._id)}
                            />
                            <label htmlFor={vibe._id}>{vibe.name}</label>
                        </div>
                    ))}
                </div>
                <div>
                    <button type="submit">Create Experience</button>
                </div>
            </form>
        </div>
    );
};

export default CreateExperience;
