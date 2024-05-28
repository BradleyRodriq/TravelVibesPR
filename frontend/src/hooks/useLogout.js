import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = async () => {
        // remove the user from local storage
        localStorage.removeItem('user')

        // logout action
        dispatch({type: 'LOGOUT'})
    }
    return { logout }
}
