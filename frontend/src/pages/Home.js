import { useEffect } from 'react'
import { useExperienceContext } from '../hooks/useExperienceContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import ExperienceDetails from '../components/experienceDetails'
import ExperienceForm from '../components/experienceForm'

const Home = () => {
    const {experiences, dispatch} = useExperienceContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchExperiences = async () => {
            const response = await fetch('/api/experiences', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_EXPERIENCES', payload: json})
            }
        }
        if(user) {
            fetchExperiences()
        }
    }, [dispatch, user])

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
