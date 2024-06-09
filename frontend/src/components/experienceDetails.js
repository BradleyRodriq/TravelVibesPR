import { useExperienceContext } from "../hooks/useExperienceContext"
import { useAuthContext } from "../hooks/useAuthContext"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from "react"

// function to change a vibe from an object to its name value from the vibes collection
const getVibeName = async (vibeId) => {
    try {
        const response = await fetch(`/api/vibes/${vibeId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const vibeName = await response.json();
        return vibeName || 'Unknown Vibe';
    } catch (error) {
        console.error('Failed to fetch vibe:', error);
        return 'Unknown Vibe';
    }
};
const ExperienceDetails = ({ experience, vibes, onDelete }) => {
    const { dispatch } = useExperienceContext();
    const { user } = useAuthContext();

    const [vibeNames, setVibeNames] = useState([]);

    useEffect(() => {
        const fetchVibeNames = async () => {
            const names = await Promise.all(vibes.map(vibeId => getVibeName(vibeId)));
            setVibeNames(names);
        };

        fetchVibeNames();
    }, [vibes]);

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch('/api/experiences/' + experience._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'DELETE_EXPERIENCE', payload: json });
            onDelete();
        }
    };

    return (
        <div className="experience-details">
            <h4>{experience.name}</h4>
            <div><strong>Location: </strong>{experience.location}</div>
            <div>
                <strong>Vibes: </strong>
                {Array.isArray(vibeNames) && vibeNames.length > 0 ? (
                    vibeNames.map((vibeName, index) => (
                        <div key={index}>{vibeName}</div>
                    ))
                ) : (
                    <div>Loading vibes...</div>
                )}
            </div>
            <p>{formatDistanceToNow(new Date(experience.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    );
};

export default ExperienceDetails;
