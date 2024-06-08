import { createContext, useContext, useReducer, useEffect } from 'react';

// Define the initial state and reducer for experiences
const initialState = {
  experiences: [],
};

const experienceReducer = (state, action) => {
    switch (action.type) {
      case 'SET_EXPERIENCES':
        return {
          ...state,
          experiences: action.payload,
        };
      case 'CREATE_EXPERIENCE':
        return {
          ...state,
          experiences: [action.payload, ...state.experiences],
        };
      case 'DELETE_EXPERIENCE':
        const { _id } = action.payload;
        const updatedExperiences = state.experiences.filter(exp => exp._id !== _id);
        // No need to fetch experiences here
        return {
          ...state,
          experiences: updatedExperiences,
        };
      default:
        return state;
    }
  };


// Create the context
export const ExperienceContext = createContext();

// Create a custom hook to use the context
export const useExperienceContext = () => {
  return useContext(ExperienceContext);
};

// Create the context provider component
export const ExperienceContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(experienceReducer, initialState);

  // Fetch experiences from the API
  const fetchExperiences = async () => {
    try {
      const response = await fetch('api/experiences');
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      const data = await response.json();
      dispatch({ type: 'SET_EXPERIENCES', payload: data });
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  // Fetch experiences on component mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <ExperienceContext.Provider value={{ state, dispatch, fetchExperiences }}>
      {children}
    </ExperienceContext.Provider>
  );
};
