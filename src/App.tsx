import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  useEffect(() => {
    // Remove dark class to ensure Sunrise light theme renders
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] font-sans antialiased">
      <Outlet />
    </div>
  )
}

export default App
