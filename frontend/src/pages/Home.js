import { useEffect, useState } from 'react'

// components
import ExperienceDetails from '../components/experienceDetails'

const Home = () => {
    const [experiences, setExperiences] = useState(null)

    useEffect(() => {
        const fetchExperiences = async () => {
            const response = await fetch('/api/experiences')
            const json = await response.json()

            if (response.ok) {
                setExperiences(json)
            }
        }
        fetchExperiences()
    }, [])

    return (
        <div className="home">
            <div className="experiences">
                {experiences && experiences.map((experience) => (
                    < ExperienceDetails experience={experience} key={experience._id} />
                ))}
            </div>
        </div>
    )
}

export default Home
