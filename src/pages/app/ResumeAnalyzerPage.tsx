import { useMemo } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { analyzeResume, applySuggestionToResume } from '@/lib/analysis'
import { usePlatformStore } from '@/store/usePlatformStore'

export const ResumeAnalyzerPage = () => {
  const { resumes, activeResumeId, setLatestAnalysis, latestAnalysis, importSections } = usePlatformStore()
  const resume = useMemo(() => resumes.find((item) => item.id === activeResumeId) ?? resumes[0], [resumes, activeResumeId])

  const runAnalysis = () => setLatestAnalysis(analyzeResume(resume))

  const applySuggestion = (text: string, target: string) => {
    const updated = applySuggestionToResume(resume, target, text)
    importSections(updated.sections)
  }

  return (
    <section>
      <PageHeader
        title="Resume Analyzer"
        description="AI analysis for ATS score, grammar, formatting, readability, strengths, and weaknesses."
        actions={<button onClick={runAnalysis} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white">Run Analysis</button>}
      />
      {!latestAnalysis ? (
        <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-8 text-sm text-slate-600">Run analysis to see recommendations.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="font-medium">Scores</h2>
            <p className="mt-2 text-sm text-slate-600">ATS Score: <span className="font-semibold text-orange-600">{latestAnalysis.atsScore}%</span></p>
            <p className="text-sm text-slate-600">Readability: <span className="font-semibold text-orange-600">{latestAnalysis.readability}%</span></p>
          </article>
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="font-medium">Issues</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {[...latestAnalysis.grammarIssues, ...latestAnalysis.formattingIssues].map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="font-medium">Gaps</h2>
            <p className="mt-2 text-sm text-slate-600">Missing skills: {latestAnalysis.missingSkills.join(', ') || 'None'}</p>
            <p className="text-sm text-slate-600">Weak verbs: {latestAnalysis.weakVerbs.join(', ') || 'None'}</p>
          </article>
          <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="font-medium">AI Suggestions</h2>
            <div className="mt-2 grid gap-2">
              {latestAnalysis.suggestions.map((item) => (
                <button key={`${item.target}-${item.text}`} onClick={() => applySuggestion(item.text, item.target)} className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-left text-xs text-orange-700">
                  <strong>{item.target}:</strong> {item.text}
                </button>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
