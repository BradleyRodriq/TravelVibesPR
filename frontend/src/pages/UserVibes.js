import React, { useState, useEffect } from 'react';

const UserVibes = () => {
    const [vibes, setVibes] = useState([]);
    const [selectedVibes, setSelectedVibes] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tokenString = localStorage.getItem("token");
        const token = tokenString ? JSON.parse(tokenString) : null;

        console.log("token", token) // Retrieve the token from localStorage

        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            const response = await fetch('/api/user/addVibes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token to the request headers
                },
                body: JSON.stringify({ vibes: selectedVibes })
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the response
                throw new Error(errorData.error || 'Failed response from server.');
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
            <h3>Choose Vibes</h3>
            {vibes.map(vibe => (
                <div key={vibe._id}>
                    <input
                        type="checkbox"
                        id={vibe.name}
                        name={vibe.name}
                        value={vibe.name}
                        onChange={handleVibeSelection}
                        checked={selectedVibes.includes(vibe.name)}
                    />
                    <label htmlFor={vibe.name}>{vibe.name}</label>
                </div>
            ))}
            <button type="submit">Add to Profile</button>
        </form>
    );
};

export default UserVibes;
