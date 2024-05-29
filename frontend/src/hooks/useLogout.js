import { useAuthContext } from './useAuthContext'
import { useExperienceContext } from './useExperienceContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: experienceDispatch } = useExperienceContext()

    const logout = async () => {
        // remove the user from local storage
        localStorage.removeItem('user')

        // logout action
        dispatch({type: 'LOGOUT'})
        experienceDispatch({type: 'SET_EXPERIENCES', payload: null})
    }
    return { logout }
}
