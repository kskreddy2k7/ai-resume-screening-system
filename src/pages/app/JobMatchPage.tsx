import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { matchResumeToJob } from '@/lib/analysis'
import { usePlatformStore } from '@/store/usePlatformStore'

export const JobMatchPage = () => {
  const [jobDescription, setJobDescription] = useState('')
  const { resumes, activeResumeId, latestMatch, setLatestMatch } = usePlatformStore()
  const resume = useMemo(() => resumes.find((item) => item.id === activeResumeId) ?? resumes[0], [resumes, activeResumeId])

  const runMatch = () => {
    if (!jobDescription.trim()) return
    setLatestMatch(matchResumeToJob(resume, jobDescription))
  }

  return (
    <section>
      <PageHeader
        title="Job Match"
        description="Compare resume against a job description with ATS-focused recommendations."
        actions={<button onClick={runMatch} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white">Run Match</button>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          className="min-h-[280px] rounded-xl border border-[#E2E8F0] bg-white p-4 text-sm"
          placeholder="Paste target job description here..."
        />
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          {!latestMatch ? (
            <p className="text-sm text-slate-600">Run match to get score and keyword gaps.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Match Score <span className="font-semibold text-orange-600">{latestMatch.score}%</span></p>
              <p className="text-sm text-slate-600">Keyword Density {latestMatch.keywordDensity}%</p>
              <p className="text-sm text-slate-600">Missing Keywords: {latestMatch.missingKeywords.join(', ') || 'None'}</p>
              <p className="text-sm text-slate-600">Missing Skills: {latestMatch.missingSkills.join(', ') || 'None'}</p>
              <ul className="space-y-1 text-xs text-slate-500">
                {latestMatch.recommendations.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
