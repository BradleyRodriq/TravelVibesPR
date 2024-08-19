// configContext.js
import React, { createContext, useContext } from 'react';

// Define the initial config
const initialConfig = {
  apiUrl: '/api'
};

// Create the ConfigContext with the initial config
const ConfigContext = createContext(initialConfig);

export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider value={initialConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the ConfigContext
export const useConfig = () => {
  return useContext(ConfigContext);
};

