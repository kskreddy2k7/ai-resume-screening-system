import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Resume Builder', path: '/builder' },
    { name: 'Resume Analyzer', path: '/analyze' },
    { name: 'Job Match', path: '/match' },
    { name: 'Templates', path: '/builder?step=7' }
  ]

  const activePath = location.pathname

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] w-full bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
        <div className="container-premium h-full flex items-center justify-between">
          
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A18] to-[#FF9F43] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,24,0.15)] text-white font-black text-base font-mono group-hover:scale-105 transition-transform duration-300">
              TF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider leading-none text-[#0F172A]">TalentFlow AI</span>
              <span className="text-[9px] text-[#475569] font-bold uppercase tracking-wide leading-none mt-1">
                AI Career Platform
              </span>
            </div>
          </Link>

          {/* Center Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {navItems.map((item) => {
              const isTemplates = item.name === 'Templates'
              const isActive = isTemplates 
                ? activePath === '/builder' && location.search.includes('step=7')
                : activePath === item.path && !location.search.includes('step=7')

              return (
                <div key={item.name} className="relative h-full flex items-center px-4">
                  <Link
                    to={item.path}
                    className={`text-sm font-semibold transition-colors duration-200 relative ${
                      isActive ? 'text-[#0F172A]' : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div 
                        layoutId="activeHeaderUnderline" 
                        className="absolute bottom-[-26px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF7A18] to-[#FF9F43]" 
                      />
                    )}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Right Side CTA: Create Resume */}
          <div className="hidden md:flex items-center">
            <Link to="/builder" className="btn-premium-primary !h-[42px] px-5 rounded-xl text-sm shadow-none">
              Create Resume
            </Link>
          </div>

          {/* Mobile menu hamburger toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-45 md:hidden bg-[#FAFAF8] pt-24 px-6 flex flex-col justify-between pb-10 border-b border-[#E2E8F0]"
          >
            <div className="space-y-6 text-left">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-[#E2E8F0] pb-3">
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-bold text-[#475569] hover:text-[#0F172A]"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <Link
                to="/builder"
                onClick={() => setIsOpen(false)}
                className="btn-premium-primary w-full text-center"
              >
                Create Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
