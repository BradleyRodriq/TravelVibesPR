import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext
import { Link } from 'react-router-dom';
import '../styles/UserVibes.css';

const UserVibes = () => {
    const [userVibes, setUserVibes] = useState([]);
    const [availableVibes, setAvailableVibes] = useState([]);
    const [selectedVibesToAdd, setSelectedVibesToAdd] = useState([]);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchUserVibes = async () => {
        if (!user) {
            return; // Return early if user is null
        }

        try {
            console.log('Fetching user vibes');
            const response = await fetch(`/api/user/vibes`, { // Ensure the endpoint matches your backend route
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user vibes');
            }

            const data = await response.json();
            setUserVibes(data.vibes); // Assuming the response contains a 'vibes' array

            const vibeIds = data.vibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error fetching user vibes:', error);
            setUserVibes([]); // Set userVibes to empty array on error
        }
    };

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

    const handleVibeSelection = (vibeId) => {
        // Check if the vibe is already in localStorage userVibes
        const storedVibes = JSON.parse(localStorage.getItem('userVibes')) || [];
        if (storedVibes.includes(vibeId)) {
            return; // Return early if the vibe is already in userVibes
        }

        // If not in userVibes, check if the vibe is already selected
        if (selectedVibesToAdd.includes(vibeId)) {
            return; // Return early if the vibe is already selected
        }

        // Add the vibe to selectedVibesToAdd
        setSelectedVibesToAdd([...selectedVibesToAdd, vibeId]);
    };


    const handleDeleteVibe = async (vibeId) => {
        const token = user.token; // Access the token from the user object

        try {
            const response = await fetch(`/api/user/deleteVibe/${vibeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            console.log('Vibe deleted successfully!');
            fetchUserVibes(); // Refresh user vibes

            const updatedVibes = userVibes.filter(vibe => vibe._id !== vibeId);
            const vibeIds = updatedVibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error deleting vibe:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user.token;

        console.log('Selected Vibes:', selectedVibesToAdd);

        try {
            // Assuming selectedVibesToAdd contains vibe IDs
            const response = await fetch('/api/user/addVibes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vibes: selectedVibesToAdd })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            const updatedUser = await response.json();
            console.log('Updated User:', updatedUser);

            setUserVibes(updatedUser.vibes); // Update userVibes with the server response

            console.log('Vibes added successfully!');
            setSelectedVibesToAdd([]);

            fetchUserVibes(); // Refresh user vibes

            const vibeIds = updatedUser.vibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error adding vibes:', error);
        }
    };

    return (
        <div className="user-vibes-container">
            <h3>Current Vibes</h3>
            <ul>
                {userVibes.map(vibe => (
                    <li key={vibe._id}>
                        {vibe.name}
                        <button onClick={() => handleDeleteVibe(vibe._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                <h3>Choose Vibes</h3>
                <div className="available-vibes-container">
                    {availableVibes.map(vibe => (
                        <button
                            key={vibe._id}
                            className={`vibe-button ${selectedVibesToAdd.includes(vibe._id) ? 'selected' : ''}`}
                            onClick={() => handleVibeSelection(vibe._id)}
                        >
                            {vibe.name}
                        </button>
                    ))}
                </div>
            </form>

            <div>
                <Link to="/">Check out matching experiences!</Link>
            </div>
        </div>
    );
};


export default UserVibes;
