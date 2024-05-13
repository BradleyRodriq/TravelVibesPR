import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ExperienceContextProvider } from './context/experienceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExperienceContextProvider>
      <App />
    </ExperienceContextProvider>
  </React.StrictMode>
);
