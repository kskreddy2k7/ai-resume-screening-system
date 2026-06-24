import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Logo = () => (
  <Link to="/" className="inline-flex items-center gap-2 font-semibold text-slate-900">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
      <Sparkles className="h-4 w-4" />
    </span>
    <span>TalentFlow AI</span>
  </Link>
)
