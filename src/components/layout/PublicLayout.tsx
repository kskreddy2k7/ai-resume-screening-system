import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Templates', to: '/templates' },
]

export const PublicLayout = () => (
  <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="transition hover:text-orange-500">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">Login</Link>
          <Link to="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
            Start Free
          </Link>
        </div>
      </div>
    </header>
    <Outlet />
  </div>
)
