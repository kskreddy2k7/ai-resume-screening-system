import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const highlights = [
  'Create or import resumes in minutes',
  'Canva-style visual editing with live preview',
  'ATS and job-match intelligence in one workspace',
  'Version history and one-click PDF export',
]

export const LandingPage = () => (
  <>
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
      <div className="space-y-6">
        <p className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
          TalentFlow AI v3 Platform
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Create, Edit, Analyze, Optimize and Export Professional Resumes Using AI
        </h1>
        <p className="text-lg text-slate-600">
          A complete resume SaaS: build from scratch, import existing resumes, improve ATS score, match job descriptions, and manage versions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/app" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white hover:bg-orange-600">
            Launch App <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/features" className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Explore Features
          </Link>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Platform Capabilities</h2>
        <div className="mt-4 space-y-3">
          {highlights.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  </>
)
