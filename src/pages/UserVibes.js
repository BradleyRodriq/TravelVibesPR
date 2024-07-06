import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext
import { Link } from 'react-router-dom';
import '../styles/UserVibes.css';

const UserVibes = () => {
    const [userVibes, setUserVibes] = useState([]);
    const [availableVibes, setAvailableVibes] = useState({});
    const [selectedVibesToAdd, setSelectedVibesToAdd] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchUserVibes = useCallback(async () => {
        if (!user) return; // Return early if user is null

        try {
            console.log('Fetching user vibes');
            const response = await fetch(`/api/user/vibes`, {
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
    }, [user]);

    const fetchAvailableVibes = useCallback(async () => {
        try {
            console.log('Fetching available vibes');
            const response = await fetch('/api/vibes');
            if (!response.ok) {
                throw new Error('Failed to fetch available vibes');
            }
            const data = await response.json();
            // Convert the array of vibes into a dictionary for quick lookup
            const vibesDict = data.reduce((acc, vibe) => {
                acc[vibe._id] = vibe.name;
                return acc;
            }, {});
            setAvailableVibes(vibesDict);
        } catch (error) {
            console.error('Error fetching available vibes:', error);
            setAvailableVibes({}); // Set availableVibes to empty dictionary on error
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (user) {
                await Promise.all([fetchUserVibes(), fetchAvailableVibes()]);
            }
            setLoading(false);
        };
        fetchData();
    }, [user, fetchUserVibes, fetchAvailableVibes]);

    const handleVibeSelection = (vibeId) => {
        const storedVibes = JSON.parse(localStorage.getItem('userVibes')) || [];
        if (storedVibes.includes(vibeId) || selectedVibesToAdd.includes(vibeId)) {
            return;
        }
        setSelectedVibesToAdd([...selectedVibesToAdd, vibeId]);
    };

    const handleDeleteVibe = async (vibeId) => {
        const token = user.token;

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-vibes-container">
            <h3>Current Vibes</h3>
            <ul>
                {userVibes.map(vibe => (
                    <li key={vibe._id}>
                        {availableVibes[vibe._id] || 'Unknown Vibe'}
                        <button onClick={() => handleDeleteVibe(vibe._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                <h3>Choose Vibes</h3>
                <div className="available-vibes-container">
                    {Object.entries(availableVibes).map(([vibeId, vibeName]) => (
                        <button
                            key={vibeId}
                            className={`vibe-button ${selectedVibesToAdd.includes(vibeId) ? 'selected' : ''}`}
                            onClick={() => handleVibeSelection(vibeId)}
                        >
                            {vibeName}
                        </button>
                    ))}
                </div>
            </form>

            <div>
                <Link to="/Home">Click here to check out your matching experiences!</Link>
            </div>
        </div>
    );
};

export default UserVibes;
