import { ExperienceContext } from "../context/experienceContext";
import { useContext } from "react";

export const useExperienceContext = () => {
    const context = useContext(ExperienceContext)

    if (!context) {
        throw Error('useExperienceContext must be used inside a experienceContextProvider')
    }

    return context
}
