import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import { LandingPage } from './pages/LandingPage.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import { ResumeBuilder } from './components/ResumeBuilder/ResumeBuilder.tsx'
import { AnalyzeResume } from './pages/AnalyzeResume.tsx'
import { JobMatch } from './pages/JobMatch.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="builder" element={<ResumeBuilder />} />
          <Route path="analyze" element={<AnalyzeResume />} />
          <Route path="match" element={<JobMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

