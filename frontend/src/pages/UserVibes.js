import React, { useState, useEffect } from 'react';

const VibesForm = () => {
    const [vibes, setVibes] = useState([]);

    useEffect(() => {
        fetch('/api/vibes')
            .then(res => res.json())
            .then(data => setVibes(data.vibes))
            .catch(err => console.error(err));
    }, []);

    const handleVibeSelection = (e) => {
        e.preventDefault();
        // Handle signup logic with selected vibes
    };

    return (
        <form onSubmit={handleVibeSelection}>
            <h3>Choose Vibes</h3>
            {vibes.map(vibe => (
                <div key={vibe.id}>
                    <input type="checkbox" id={vibe.name} name={vibe.name} value={vibe.name} />
                    <label htmlFor={vibe.name}>{vibe.name}</label>
                </div>
            ))}
            <button type="submit">Select</button>
        </form>
    );
};

export default VibesForm;
