import React, { useContext } from 'react';
import { VibesContext } from './vibeContext'; // Assuming this is where VibesContext is exported

const useVibeContext = () => {
    const { vibes, setVibes, loading, error } = useContext(VibesContext);

    return { vibes, setVibes, loading, error };
};

export default useVibeContext;
