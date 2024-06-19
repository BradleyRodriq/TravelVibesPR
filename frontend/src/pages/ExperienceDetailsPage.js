import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import '../styles/ExperienceDetailsPage.css'; // Import the CSS file

const getVibeNames = async (vibeIds) => {
    try {
        const response = await fetch('/api/vibes/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vibeIds }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const vibeNames = await response.json();
        return vibeNames || ['Unknown Vibe'];
    } catch (error) {
        console.error('Failed to fetch vibes:', error);
        return ['Unknown Vibe'];
    }
};

const ExperienceDetailsPage = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [vibeNames, setVibeNames] = useState([]);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await fetch(`/api/experiences/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch experience details');
                }
                const data = await response.json();
                setExperience(data);

                // Fetch vibe names
                if (data.vibes && data.vibes.length > 0) {
                    const names = await getVibeNames(data.vibes);
                    setVibeNames(names);
                }
            } catch (error) {
                console.error('Error fetching experience details:', error);
            }
        };

        fetchExperience();
    }, [id]);

    if (!experience) {
        return <div>Loading...</div>;
    }

    return (
        <div className="experience-detail" style={{ width: '1000px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            <h1>{experience.name}</h1>
            <p><strong>Location:</strong> {experience.location}</p>
            <p><strong>Coordinates:</strong> {experience.geolocation?.coordinates.join(', ')}</p>
            <p><strong>Picture:</strong></p>
            {experience.pictureUrl && (
                <img src={experience.pictureUrl} alt={experience.name} style={{ width: '100%', maxWidth: '600px', height: 'auto' }} />
            )}
            <p><strong>Vibes:</strong></p>
            <ul>
                {vibeNames.map((vibe, index) => (
                    <li key={index}>{vibe}</li>
                ))}
            </ul>
            <p><strong>Created:</strong> {formatDistanceToNow(new Date(experience.createdAt))} ago</p>
            <p><strong>Updated:</strong> {formatDistanceToNow(new Date(experience.updatedAt))} ago</p>
        </div>
    );
};

export default ExperienceDetailsPage;
