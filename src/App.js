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
import Landing from './pages/Landing';
import Random from './pages/Random';
import ExactMatch from './pages/ExactMatch';
import ExperienceCreated from './pages/ExperienceCreated';
import './styles/App.css';


function App() {
  const { user } = useAuthContext();
  const [redirectedToLogin, setRedirectedToLogin] = useState(false);

  if (!user && !redirectedToLogin) {
    setRedirectedToLogin(true);
    return <Navigate to="/login" />;
  }


  return (
    <div className="App-container">
      <LoadScript googleMapsApiKey="AIzaSyDP8zkTwAzKinxwNbrxis42EyX5dCkece4">
        <BrowserRouter>
          <Navbar/>
          <div>
            <Routes>
              <Route path="/TravelVibesPR/" element={<Landing />} />
	      <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/select-vibes" element={<UserVibes />} />
              <Route path="/add-experience" element={<CreateExperience />} />
              <Route path="/experience/:id" element={<ExperienceDetailsPage />} />
              <Route path="/signupthanks" element={<SignupThanks/>} />
              <Route path="/ExperienceMap" element={<MapPage />} />
              <Route path="/exact-match" element={<ExactMatch />} />
              <Route path="/random" element={<Random />} />
              <Route path="/experiencecreated" element={<ExperienceCreated/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </LoadScript>
    </div>
  );
}

export default App;
