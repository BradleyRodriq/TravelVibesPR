import { useExperienceContext } from "../hooks/useExperienceContext"
import { useAuthContext } from "../hooks/useAuthContext"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ExperienceDetails = ({ experience }) => {
    const { dispatch, fetchExperiences } = useExperienceContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch('api/experiences/' + experience._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'DELETE_EXPERIENCE', payload: json });

            // Fetch experiences again
            fetchExperiences(dispatch);
        }
    };


    return (
        <div className="experience-details">
            <h4>{experience.name}</h4>
            <div><strong>Location: </strong>{experience.location}</div>
            <div><strong>Vibes: </strong>{experience.vibes.map((vibe, index) => (
                <p key={index}>{vibe.name}</p>
            ))}</div>
            <p>{formatDistanceToNow(new Date(experience.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    );
};

export default ExperienceDetails;
