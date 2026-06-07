import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileEdit, BarChart3, Sparkles, CheckCircle2, 
  ArrowRight, Star, ChevronDown, Award, Sparkle, AlertTriangle,
  Lightbulb, Compass, GraduationCap, ArrowUpRight
} from 'lucide-react'
import { Header } from '@/components/layout/Header'

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx)
  }

  const floatVariants: any = {
    animate: {
      y: [0, -8, 0],
      rotate: [-0.5, 0.5, -0.5],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      }
    }
  };

  const logos = [
    { name: 'Stripe' },
    { name: 'Vercel' },
    { name: 'Linear' },
    { name: 'Apple' },
    { name: 'Notion' },
    { name: 'OpenAI' }
  ]

  const features = [
    {
      title: "Resume Builder",
      desc: "An onboarding-style wizard that guides you section by section to generate recruiter-ready tech resumes.",
      icon: FileEdit,
      path: "/builder"
    },
    {
      title: "ATS Analysis",
      desc: "Scan your resume against parsing rules, layout structures, and industry keyword checklists.",
      icon: BarChart3,
      path: "/analyze"
    },
    {
      title: "Job Match",
      desc: "Compare your resume experience against any job description using semantic text-matching compatibility gauges.",
      icon: Sparkles,
      path: "/match"
    },
    {
      title: "Template Library",
      desc: "Choose from clean, premium templates optimized for applicant tracking systems and modern readability.",
      icon: GraduationCap,
      path: "/builder?step=7"
    },
    {
      title: "Interview Prep",
      desc: "Generate custom AI interview questions tailored specifically to your resume and experience level.",
      icon: Lightbulb,
      path: "/analyze"
    },
    {
      title: "Career Insights",
      desc: "Instantly detect tech stack keyword gaps required by hiring managers in your target roles.",
      icon: Compass,
      path: "/analyze"
    }
  ]

  const testimonials = [
    {
      quote: "TalentFlow helped me completely restructure my project bullets. I went from getting zero replies to three recruiter screens in a single week.",
      author: "Sarah Jenkins",
      role: "Frontend Engineer at Vercel",
      stars: 5
    },
    {
      quote: "The guided wizard and immediate ATS scanner suggestions are top-tier. Extremely smooth UX with zero account-creation friction.",
      author: "Marcus Vance",
      role: "Backend Architect at Stripe",
      stars: 5
    },
    {
      quote: "Simple, incredibly clean, and fast. The DOCX export saved me hours of manually copying formatting between Word documents.",
      author: "Deepak Mehta",
      role: "Product Designer at Linear",
      stars: 5
    }
  ]

  const faqs = [
    {
      q: "Do I need to create an account to use TalentFlow AI?",
      a: "No. TalentFlow AI is built for instant access. You can write your resume, scan your ATS score, compute job matches, and download PDF or DOCX copies immediately without entering an email address."
    },
    {
      q: "How does the ATS Resume Analyzer score my file?",
      a: "Our analyzer evaluates your document's text formatting, headings, structure, and keyword density. It runs a parsing script that compares your text against essential developer keywords to calculate your ATS Suitability rating."
    },
    {
      q: "Can I export my resume to Microsoft Word (.docx) formats?",
      a: "Yes! The Resume Builder supports both browser-based PDF printing layouts and Word-compatible DOCX file exports, giving you total editing flexibility."
    },
    {
      q: "What is Job Match Intelligence?",
      a: "Rather than simple word-counting, Job Match uses semantic analysis to compare your resume experience against any job description, identifying critical skill gaps and recommending optimizations."
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] overflow-x-hidden relative flex flex-col">
      {/* Background glow meshes (Sunrise morning energy) */}
      <div className="absolute top-[-10vw] left-[-10vw] w-[50vw] h-[50vw] bg-[#FF7A18]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10vw] right-[-10vw] w-[50vw] h-[50vw] bg-[#FFB84D]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Subtle Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Global Navbar */}
      <Header />

      {/* Hero Section */}
      <header className="relative z-10 pt-24 pb-24 container-premium text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF7A18]/10 border border-[#FF7A18]/20 text-xs font-semibold text-[#F97316] tracking-wide shadow-sm justify-center">
              <Sparkle className="w-3.5 h-3.5 text-[#F97316] animate-spin duration-3000" />
              <span>Sunrise Intelligence 2.0</span>
            </div>

            <h1 className="text-hero font-black tracking-tight leading-[1.1] text-[#0F172A]">
              Build a Resume <br />
              <span className="text-gradient-sunrise font-black">That Opens Doors</span>
            </h1>

            <p className="text-body-custom max-w-xl">
              Create ATS-friendly resumes, analyze your profile, match jobs, and accelerate your career with AI.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <Link to="/builder" className="btn-premium-primary text-center">
                Create Resume
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/analyze" className="btn-premium-secondary text-center">
                Analyze Resume
              </Link>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup Column */}
          <div className="lg:col-span-5 relative h-[480px] w-full flex items-center justify-center lg:justify-end">
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="w-full max-w-[420px] rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-6 relative z-10 backdrop-blur-xl space-y-6"
            >
              {/* Card Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-[#475569] font-mono ml-1.5 font-bold">resume_preview.json</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A18]/10 text-[9px] text-[#F97316] font-bold border border-[#FF7A18]/20">
                  NLP LIVE
                </span>
              </div>

              {/* Animated Preview Elements */}
              <div className="space-y-4">
                
                {/* 1. ATS Score Widget */}
                <div className="p-4 bg-[#FAFAF8] border border-[#E2E8F0] rounded-2xl flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] text-[#475569] block uppercase tracking-wider font-bold">ATS Score</span>
                    <span className="text-2xl font-black text-[#0F172A]">87%</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[10px] text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> Optimal Score
                  </div>
                </div>

                {/* 2. Match Score Widget */}
                <div className="p-4 bg-[#FAFAF8] border border-[#E2E8F0] rounded-2xl flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] text-[#475569] block uppercase tracking-wider font-bold">Match Score</span>
                    <span className="text-2xl font-black text-[#F97316]">92%</span>
                  </div>
                  <div className="text-[10px] text-[#475569] font-bold">Senior DevOps Role</div>
                </div>

                {/* 3. Resume Strength Widget */}
                <div className="p-4 bg-[#FAFAF8] border border-[#E2E8F0] rounded-2xl flex items-center justify-between">
                  <div className="text-left space-y-0.5">
                    <h4 className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">Resume Strength</h4>
                    <p className="text-xs text-[#FF7A18] font-bold">95% (Strong Fit)</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FF7A18]/10 flex items-center justify-center text-[#F97316]">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </header>

      {/* Grayscale Social Proof Logos */}
      <section className="border-t border-b border-[#E2E8F0] bg-white py-10 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-around gap-8">
          {logos.map((logo) => (
            <span 
              key={logo.name} 
              className="text-lg font-black tracking-widest text-[#94A3B8] hover:text-[#475569] transition-colors duration-300 select-none cursor-default uppercase font-mono"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Cards Section (3-Column Layout, Equal Height, 32px Padding) */}
      <section id="features" className="relative z-10 py-24 container-premium text-center">
        <div className="max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-section-title text-[#0F172A] font-black tracking-tight leading-tight">
            Comprehensive Resume Tools
          </h2>
          <p className="text-body-custom max-w-lg mx-auto">
            Select an action to launch our instant optimization dashboard. No credentials needed.
          </p>
        </div>

        {/* Features 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.title} className="card-premium p-8 flex flex-col text-left group hover:scale-[1.01] min-h-[320px] justify-between">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF7A18]/10 border border-[#FF7A18]/25 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-card-title text-[#0F172A] group-hover:text-[#F97316] transition-colors flex items-center justify-between">
                      <span>{feat.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
                <Link to={feat.path} className="btn-premium-secondary w-full text-center mt-8 !h-[44px] rounded-xl text-sm">
                  Launch Tool
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Interactive Mockup Score & ATS Preview Section */}
      <section className="relative z-10 py-20 bg-white border-t border-b border-[#E2E8F0]">
        <div className="container-premium grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6 text-left">
            <h2 className="text-section-title font-black leading-tight text-[#0F172A]">Instant ATS Analysis</h2>
            <p className="text-body-custom">
              Analyze keyword patterns, spacing densities, and formatting boundaries against standardized ATS filters in seconds. Get precise suggestions to improve callback rates.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Core Keyword Optimization', desc: 'Identifies technical skill gaps based on context parsing.' },
                { title: 'Typography Hierarchy Verification', desc: 'Ensures machine-readable fonts and heading structures.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FF7A18]/10 border border-[#FF7A18]/20 flex items-center justify-center text-[#F97316] mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs text-[#475569] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="card-premium p-6 w-full max-w-md bg-[#FAFAF8] text-left space-y-4 border border-[#E2E8F0]">
              <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Analysis Preview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-1.5">
                    <span>Keyword Match Rate</span>
                    <span className="text-[#F97316]">82%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F97316]" style={{ width: '82%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-1.5">
                    <span>Layout Score</span>
                    <span className="text-[#FF9F43]">90%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF9F43]" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
              
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-left flex gap-2.5 mt-4">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Critical Issue</h4>
                  <p className="text-[10px] text-[#475569] mt-0.5">Missing technologies: Kubernetes, AWS</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 container-premium text-center">
        <div className="max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-section-title font-black tracking-tight leading-tight text-[#0F172A]">
            Trusted by Builders
          </h2>
          <p className="text-body-custom max-w-md mx-auto">
            Read comments from tech professionals who landed roles at industry startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.author} className="card-premium p-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#475569] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                <p className="text-xs font-bold text-[#0F172A]">{t.author}</p>
                <p className="text-[10px] text-[#475569]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 py-24 container-premium max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-section-title font-black tracking-tight leading-tight text-[#0F172A]">Frequently Asked Questions</h2>
          <p className="text-body-custom text-gray-400 max-w-md mx-auto">Get answers to standard operations and platform capabilities.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div key={idx} className="card-premium overflow-hidden select-none">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-[#0F172A]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[#475569] border-t border-[#E2E8F0] leading-relaxed text-left">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
