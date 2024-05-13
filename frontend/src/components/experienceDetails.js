const ExperienceDetails = ({ experience }) => {

    return (
        <div className="experience-details">
            <h4>{experience.name}</h4>
            <p><strong>Location: </strong>{experience.location}</p>
            <p><strong>Vibes: </strong>{experience.vibes}</p>
            <p>{experience.createdAt}</p>
        </div>
    )
}

export default ExperienceDetails
