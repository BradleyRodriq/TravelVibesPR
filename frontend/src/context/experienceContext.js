import { createContext, useReducer } from 'react'

export const ExperienceContext = createContext()

export const experienceReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EXPERIENCES':
            return {
                experiences: action.payload
            }
        case 'CREATE_EXPERIENCE':
            return {
                experiences: [action.payload, ...state.experiences]
            }
        case 'DELETE_EXPERIENCE':
            return {
                experiences: state.experiences.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const ExperienceContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(experienceReducer, {
        experiences: null
    })

    return (
        <ExperienceContext.Provider value={{...state, dispatch}}>
            { children }
        </ExperienceContext.Provider>
    )
}
