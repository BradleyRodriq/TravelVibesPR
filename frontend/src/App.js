import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserVibes from './pages/UserVibes';
import Navbar from './components/Navbar';
import CreateExperience from './pages/ExperienceManager';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage';
import SignupThanks from './pages/SignupThanks';
import MapPage from './pages/MapPage';
import { LoadScript } from '@react-google-maps/api';

function App() {
  const { user } = useAuthContext();
  const [redirectedToLogin, setRedirectedToLogin] = useState(false);

  if (!user && !redirectedToLogin) {
    setRedirectedToLogin(true);
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyDP8zkTwAzKinxwNbrxis42EyX5dCkece4">
        <BrowserRouter>
          <Navbar />
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/select-vibes" element={<UserVibes />} />
              <Route path="/add-experience" element={<CreateExperience />} />
              <Route path="/experience/:id" element={<ExperienceDetailsPage />} />
              <Route path="/signupthanks" element={<SignupThanks/>} />
              <Route path="/ExperienceMap" element={<MapPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LoadScript>
    </div>
  );
}

export default App;
