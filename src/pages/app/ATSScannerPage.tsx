import { useMemo } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { analyzeResume } from '@/lib/analysis'
import { usePlatformStore } from '@/store/usePlatformStore'

export const ATSScannerPage = () => {
  const { resumes, activeResumeId } = usePlatformStore()
  const resume = useMemo(() => resumes.find((item) => item.id === activeResumeId) ?? resumes[0], [resumes, activeResumeId])
  const result = analyzeResume(resume)

  return (
    <section>
      <PageHeader title="ATS Scanner" description="Dedicated ATS compatibility scan with keyword and formatting checks." />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4"><p className="text-sm text-slate-600">ATS Compatibility</p><p className="text-3xl font-semibold text-orange-600">{result.atsScore}%</p></article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4"><p className="text-sm text-slate-600">Keyword Gaps</p><p className="text-3xl font-semibold text-slate-900">{result.missingSkills.length}</p></article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4"><p className="text-sm text-slate-600">Weak Verb Flags</p><p className="text-3xl font-semibold text-slate-900">{result.weakVerbs.length}</p></article>
      </div>
    </section>
  )
}
