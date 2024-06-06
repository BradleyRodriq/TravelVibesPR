import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext

const UserVibes = () => {
    const [vibes, setVibes] = useState([]);
    const [selectedVibes, setSelectedVibes] = useState([]);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchUserVibes = async () => {
        if (!user) {
            return; // Return early if user is null
        }

        try {
            const response = await fetch(`/api/user/getVibes`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user vibes');
            }

            const data = await response.json();
            setVibes(data); // Assuming the response contains an array of vibe IDs
        } catch (error) {
            console.error('Error fetching user vibes:', error);
            setVibes([]); // Set vibes to empty array on error
        }
    };

    // Fetch user vibes
    useEffect(() => {
        fetchUserVibes();
    }, [user]);

    // Fetch all available vibes
    useEffect(() => {
        fetch('/api/vibes')
            .then(res => res.json())
            .then(data => setVibes(data))
            .catch(err => console.error(err));
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

            fetchUserVibes();
        } catch (error) {
            console.error('Error deleting vibe:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user.token; // Access the token from the user object

        try {
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

            console.log('Vibes added successfully!');
            setSelectedVibes([]);
        } catch (error) {
            console.error('Error adding vibes:', error);
        }
    };

    return (
        <div>
            <h3>Current Vibes</h3>
            <ul>
                {vibes.map(vibe => (
                    <li key={vibe._id}>
                        {vibe.name}
                        <button onClick={() => handleDeleteVibe(vibe._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                <h3>Choose Vibes</h3>
                {vibes.map(vibe => (
                    <div key={vibe._id}>
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
                <button type="submit">Add to Profile</button>
            </form>
        </div>
    );
};

export default UserVibes;
