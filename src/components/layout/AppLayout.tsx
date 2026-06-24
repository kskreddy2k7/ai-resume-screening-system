import { LayoutDashboard, FilePenLine, ScanText, Radar, BriefcaseBusiness, Library, User, Settings, LayoutTemplate } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'

const appLinks = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard, end: true },
  { label: 'Resume Builder', to: '/app/resume-builder', icon: FilePenLine },
  { label: 'Resume Analyzer', to: '/app/resume-analyzer', icon: ScanText },
  { label: 'ATS Scanner', to: '/app/ats-scanner', icon: Radar },
  { label: 'Job Match', to: '/app/job-match', icon: BriefcaseBusiness },
  { label: 'Templates', to: '/app/templates', icon: LayoutTemplate },
  { label: 'Resume Library', to: '/app/resume-library', icon: Library },
  { label: 'Profile', to: '/app/profile', icon: User },
  { label: 'Settings', to: '/app/settings', icon: Settings },
]

export const AppLayout = () => (
  <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] lg:grid lg:grid-cols-[280px_1fr]">
    <aside className="border-r border-[#E2E8F0] bg-white p-4 lg:p-6">
      <Logo />
      <nav className="mt-6 grid gap-1">
        {appLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
)
