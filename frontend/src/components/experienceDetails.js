import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useExperienceContext } from "../hooks/useExperienceContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// function to change a vibe from an object to its name value from the vibes collection
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

const ExperienceDetails = ({ experience, vibes, onDelete }) => {
    const { dispatch } = useExperienceContext();
    const { user } = useAuthContext();
    const [vibeNames, setVibeNames] = useState([]);

    useEffect(() => {
        const fetchVibeNames = async () => {
            const names = await getVibeNames(vibes);
            setVibeNames(names);
        };

        fetchVibeNames();
    }, [vibes]);

    const handleClick = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        const response = await fetch('/api/experiences/' + experience._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'DELETE_EXPERIENCE', payload: json });
            onDelete();
        }
    };

    const municipalities = [
        'Adjuntas', 'Aguada', 'Aguadilla', 'Aguas Buenas', 'Aibonito', 'Añasco', 'Arecibo',
        'Arroyo', 'Barceloneta', 'Barranquitas', 'Bayamón', 'Cabo Rojo', 'Caguas', 'Camuy',
        'Canóvanas', 'Carolina', 'Cataño', 'Cayey', 'Ceiba', 'Ciales', 'Cidra', 'Coamo',
        'Comerío', 'Corozal', 'Culebra', 'Dorado', 'Fajardo', 'Florida', 'Guánica', 'Guayama',
        'Guayanilla', 'Guaynabo', 'Gurabo', 'Hatillo', 'Hormigueros', 'Humacao', 'Isabela',
        'Jayuya', 'Juana Díaz', 'Juncos', 'Lajas', 'Lares', 'Las Marías', 'Las Piedras',
        'Loíza', 'Luquillo', 'Manatí', 'Maricao', 'Maunabo', 'Mayagüez', 'Moca', 'Morovis',
        'Naguabo', 'Naranjito', 'Orocovis', 'Patillas', 'Peñuelas', 'Ponce', 'Quebradillas',
        'Rincón', 'Río Grande', 'Sabana Grande', 'Salinas', 'San Germán', 'San Juan', 'San Lorenzo',
        'San Sebastián', 'Santa Isabel', 'Toa Alta', 'Toa Baja', 'Trujillo Alto', 'Utuado', 'Vega Alta',
        'Vega Baja', 'Vieques', 'Villalba', 'Yabucoa', 'Yauco',
    ];

    const municipality = municipalities.find(municipality => experience.location.includes(municipality));

    return (
        <Link to={`/experience/${experience._id}`} className="experience-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="experience-details" style={{ width: '300px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <h4 style={{ padding: '10px', margin: '0' }}>{experience.name}</h4>
                <img src={experience.pictureUrl} alt={experience.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                    <div><strong>Location: </strong>{municipality || experience.location}</div>
                    <div>
                        <strong>Vibes: </strong>
                        <div>{vibeNames.join(' | ')}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ExperienceDetails;
