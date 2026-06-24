import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { LandingPage } from '@/pages/public/LandingPage'
import { FeaturesPage } from '@/pages/public/FeaturesPage'
import { PricingPage } from '@/pages/public/PricingPage'
import { TemplatesPage } from '@/pages/public/TemplatesPage'
import { AuthPage } from '@/pages/public/AuthPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { ResumeBuilderPage } from '@/pages/app/ResumeBuilderPage'
import { ResumeAnalyzerPage } from '@/pages/app/ResumeAnalyzerPage'
import { ATSScannerPage } from '@/pages/app/ATSScannerPage'
import { JobMatchPage } from '@/pages/app/JobMatchPage'
import { AppTemplatesPage } from '@/pages/app/AppTemplatesPage'
import { ResumeLibraryPage } from '@/pages/app/ResumeLibraryPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { SettingsPage } from '@/pages/app/SettingsPage'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/register" element={<AuthPage type="register" />} />
      </Route>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="resume-builder" element={<ResumeBuilderPage />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzerPage />} />
        <Route path="ats-scanner" element={<ATSScannerPage />} />
        <Route path="job-match" element={<JobMatchPage />} />
        <Route path="templates" element={<AppTemplatesPage />} />
        <Route path="resume-library" element={<ResumeLibraryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
