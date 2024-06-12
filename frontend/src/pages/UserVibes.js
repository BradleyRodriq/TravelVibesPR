import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext
import '../styles/userVibes.css';

const UserVibes = () => {
    const [userVibes, setUserVibes] = useState([]);
    const [availableVibes, setAvailableVibes] = useState([]);
    const [selectedVibes, setSelectedVibes] = useState([]);
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

    // Fetch user vibes when the user changes
    useEffect(() => {
        if (user) {
            fetchUserVibes();
        }
    }, [user]);

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

        console.log('Selected Vibes:', selectedVibes);

        try {
            // Assuming selectedVibes contains vibe names, not IDs
            const response = await fetch('/api/user/addVibes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vibes: selectedVibes })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            const updatedUser = await response.json();
            console.log('Updated User:', updatedUser);

            setUserVibes(updatedUser.vibes); // Update userVibes with the server response

            console.log('Vibes added successfully!');
            setSelectedVibes([]);

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
            <ul className="vibes-list">
                {userVibes.map(vibe => (
                    <li key={vibe._id} className="vibe-item">
                        {vibe.name}
                        <button className="delete-button" onClick={() => handleDeleteVibe(vibe._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <form className="vibes-form" onSubmit={handleSubmit}>
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
                <button className="submit-button" type="submit">Add to Profile</button>
            </form>
        </div>
    );
};

export default UserVibes;
