import { useExperienceContext } from "../hooks/useExperienceContext"
import { useAuthContext } from "../hooks/useAuthContext"

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ExperienceDetails = ({ experience }) => {
    const { dispatch } = useExperienceContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }
        const response = await fetch('api/experiences/' + experience._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
                dispatch({ type: 'DELETE_EXPERIENCE', payload: json })
        }
    }

    return (
        <div className="experience-details">
            <h4>{experience.name}</h4>
            <p><strong>Location: </strong>{experience.location}</p>
            <p><strong>Vibes: </strong>{experience.vibes}</p>
            <p>{formatDistanceToNow(new Date(experience.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

export default ExperienceDetails
