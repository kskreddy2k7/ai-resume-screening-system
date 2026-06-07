import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col relative overflow-x-hidden">
      {/* Global Background Glows (Sunrise morning energy blobs) */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Sticky Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 flex flex-col">
        {children}
      </main>

      {/* 4-Column Professional Footer Grid */}
      <footer className="border-t border-[#E2E8F0] bg-white py-16 mt-auto relative z-20">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Product */}
            <div className="text-left space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm text-[#475569]">
                <li>
                  <a href="/builder" className="hover:text-[#F97316] transition-colors font-medium">Resume Builder</a>
                </li>
                <li>
                  <a href="/analyze" className="hover:text-[#F97316] transition-colors font-medium">ATS Analyzer</a>
                </li>
                <li>
                  <a href="/builder?step=7" className="hover:text-[#F97316] transition-colors font-medium">Templates</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="text-left space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm text-[#475569]">
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">Contact</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">Privacy Policy</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="text-left space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm text-[#475569]">
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">Blog</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">Career Tips</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">Help Center</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div className="text-left space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Socials</h4>
              <ul className="space-y-3 text-sm text-[#475569]">
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">GitHub</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F97316] transition-colors font-medium">LinkedIn</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#475569] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7A18] to-[#FF9F43]" />
              <span>© {new Date().getFullYear()} TalentFlow AI. All rights reserved.</span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">Handcrafted with precision for global builders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
