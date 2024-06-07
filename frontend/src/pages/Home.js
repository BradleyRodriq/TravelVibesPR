import { useEffect } from 'react'
import { useExperienceContext } from '../hooks/useExperienceContext'

// components
import ExperienceDetails from '../components/experienceDetails'
import ExperienceForm from '../components/experienceForm'

const Home = () => {
    const {experiences, dispatch} = useExperienceContext()

    useEffect(() => {
        const fetchExperiences = async () => {
            const response = await fetch('/api/experiences')
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_EXPERIENCES', payload: json})
            }
        }
        fetchExperiences() // Fetch experiences regardless of user login status
    }, [dispatch])

    return (
        <div className="home">
            <div className="experiences">
                {experiences && experiences.map((experience) => (
                    < ExperienceDetails experience={experience} key={experience._id} />
                ))}
            </div>
            <ExperienceForm />
        </div>
    )

}

export default Home
