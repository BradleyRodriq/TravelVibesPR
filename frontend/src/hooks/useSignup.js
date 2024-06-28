import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error || 'Signup failed');
                return false; // Return false or handle failure as needed
            }

            // Save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // Update the auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
            return true; // Return true for successful signup
        } catch (error) {
            console.error('Signup Error:', error);
            setIsLoading(false);
            setError(error.message || 'Signup failed');
            return false; // Return false or handle failure in catch block
        }
    };

    return { signup, isLoading, error };
};
