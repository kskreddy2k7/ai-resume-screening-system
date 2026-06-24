import { BarChart3, FileText, Sparkles, Target } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { MetricCard } from '@/components/common/MetricCard'
import { usePlatformStore } from '@/store/usePlatformStore'

export const DashboardPage = () => {
  const { resumes, activeResumeId, latestAnalysis, latestMatch } = usePlatformStore()
  const active = resumes.find((resume) => resume.id === activeResumeId) ?? resumes[0]

  return (
    <section>
      <PageHeader title="Dashboard" description="Track resume quality, ATS health, and recent activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Recent Resumes" value={`${resumes.length}`} note="Stored in resume library" icon={FileText} />
        <MetricCard label="ATS Score" value={`${latestAnalysis?.atsScore ?? '--'}%`} note="Latest analyzer run" icon={BarChart3} />
        <MetricCard label="Resume Health" value={`${latestAnalysis?.readability ?? '--'}%`} note="Readability + structure" icon={Sparkles} />
        <MetricCard label="Job Match" value={`${latestMatch?.score ?? '--'}%`} note="Most recent JD comparison" icon={Target} />
      </div>
      <article className="mt-6 rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="text-lg font-medium text-slate-900">Recent resume</h2>
        <p className="mt-2 text-sm text-slate-600">{active.name}</p>
        <p className="text-xs text-slate-500">Updated {new Date(active.updatedAt).toLocaleString()}</p>
      </article>
    </section>
  )
}
