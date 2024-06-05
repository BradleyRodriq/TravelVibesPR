import React, { useState, useEffect } from 'react';

const VibeForm = () => {
    const [vibes, setVibes] = useState([]);
    const [selectedVibe, setSelectedVibe] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        fetch('/api/vibes')
            .then(response => response.json())
            .then(data => setVibes(data))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
            const response = await fetch('/api/user/addVibes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                body: JSON.stringify({ vibes: selectedVibes })
            });
            if (!response.ok) {
                throw new Error('Failed to add vibes');
            }
            console.log('Vibes added successfully!');
            // Reset selected vibes after submission
            setSelectedVibes([]);
        } catch (error) {
            console.error('Error adding vibes:', error);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Vibe</h3>
            <select
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
            >
                <option value="" disabled>Select Vibe</option>
                {vibes.map(vibe => (
                    <option key={vibe._id} value={vibe._id}>{vibe.name}</option>
                ))}
            </select>
            <button type="submit" disabled={loading}>Add Vibe</button>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
        </form>
    );
};

export default VibeForm;
