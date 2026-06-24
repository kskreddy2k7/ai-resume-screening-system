import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';
import TemplateGallery from './pages/onboarding/TemplateGallery';
import ExistingResumeCheck from './pages/onboarding/ExistingResumeCheck';
import ImportResume from './pages/onboarding/ImportResume';
import GuidedCreator from './pages/onboarding/GuidedCreator';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/start" element={<ExistingResumeCheck />} />
        <Route path="/import" element={<ImportResume />} />
        <Route path="/builder" element={<GuidedCreator />} />
        <Route path="/app" element={<Workspace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
