import React, { useState } from 'react';
import { useExperienceContext } from '../hooks/useExperienceContext';
import { useAuthContext } from '../hooks/useAuthContext';

const ExperienceForm = () => {
    const { dispatch } = useExperienceContext();
    const { user } = useAuthContext();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [vibes, setVibes] = useState([]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleVibeSelection = (vibe) => {
        if (vibes.includes(vibe)) {
            setVibes(vibes.filter((selectedVibe) => selectedVibe !== vibe));
        } else {
            setVibes([...vibes, vibe]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            return setError('You must be logged in to add an experience.');
        }

        const experience = { name, location, vibes };

        const response = await fetch('/api/experiences', {
            method: 'POST',
            body: JSON.stringify(experience),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }

        if (response.ok) {
            setName('');
            setLocation('');
            setVibes([]);
            setError(null);
            setEmptyFields([]);
            console.log('new experience added,', json);
            dispatch({ type: 'CREATE_EXPERIENCE', payload: json });
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new Experience</h3>

            <label>Experience name: </label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
            />

            <label>Location: </label>
            <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                className={emptyFields.includes('location') ? 'error' : ''}
            />

            <label>Vibes: </label>
            <div>
                {['Nature', 'Adventure', 'Relaxation', 'Culture'].map((vibe) => (
                    <label key={vibe}>
                        <input
                            type="checkbox"
                            value={vibe}
                            checked={vibes.includes(vibe)}
                            onChange={() => handleVibeSelection(vibe)}
                        />
                        {vibe}
                    </label>
                ))}
            </div>

            <button>Add Experience</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default ExperienceForm;
