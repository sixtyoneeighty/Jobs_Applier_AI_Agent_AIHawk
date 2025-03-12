import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

// Pages
import Dashboard from './pages/Dashboard';
import ResumeSetup from './pages/ResumeSetup';
import PreferencesSetup from './pages/PreferencesSetup';
import ApiKeySetup from './pages/ApiKeySetup';
import GenerateResume from './pages/GenerateResume';
import GenerateTailoredResume from './pages/GenerateTailoredResume';
import GenerateCoverLetter from './pages/GenerateCoverLetter';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import LoadingOverlay from './components/LoadingOverlay';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ my: 4, minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup/resume" element={<ResumeSetup />} />
            <Route path="/setup/preferences" element={<PreferencesSetup />} />
            <Route path="/setup/api-key" element={<ApiKeySetup />} />
            <Route path="/generate/resume" element={<GenerateResume />} />
            <Route path="/generate/tailored-resume" element={<GenerateTailoredResume />} />
            <Route path="/generate/cover-letter" element={<GenerateCoverLetter />} />
          </Routes>
        </Container>
        <Footer />
        <Notification />
        <LoadingOverlay />
      </Router>
    </AppProvider>
  );
}

export default App;
