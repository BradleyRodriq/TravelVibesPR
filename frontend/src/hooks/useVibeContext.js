import React, { useContext } from 'react';
import { VibeContext } from './vibeContext';

const useVibeContext = () => {
    const { vibes, addVibe, removeVibe, clearVibes } = useContext(VibeContext);

    return { vibes, addVibe, removeVibe, clearVibes };
};

export default useVibeContext;
