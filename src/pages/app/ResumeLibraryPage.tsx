import { useState } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { usePlatformStore } from '@/store/usePlatformStore'

export const ResumeLibraryPage = () => {
  const [versionName, setVersionName] = useState('Manual Save')
  const { resumes, activeResumeId, setActiveResume, duplicateResume, renameResume, deleteResume, saveVersion, restoreVersion } = usePlatformStore()
  const active = resumes.find((resume) => resume.id === activeResumeId) ?? resumes[0]

  return (
    <section>
      <PageHeader
        title="Resume Library"
        description="Manage all resumes, duplicate, rename, delete, and restore previous versions."
        actions={<button onClick={() => saveVersion(versionName)} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white">Save Version</button>}
      />
      <div className="mb-4 max-w-sm">
        <input value={versionName} onChange={(event) => setVersionName(event.target.value)} className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {resumes.map((resume) => (
            <article key={resume.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <button onClick={() => setActiveResume(resume.id)} className="text-left text-sm font-medium text-slate-900 hover:text-orange-600">{resume.name}</button>
              <p className="text-xs text-slate-500">Updated {new Date(resume.updatedAt).toLocaleString()}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => duplicateResume(resume.id)} className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-2 py-1 text-xs"><Copy className="h-3 w-3" /> Duplicate</button>
                <button onClick={() => renameResume(resume.id, `${resume.name} Updated`)} className="rounded-lg border border-[#E2E8F0] px-2 py-1 text-xs">Rename</button>
                <button onClick={() => deleteResume(resume.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600"><Trash2 className="h-3 w-3" /> Delete</button>
              </div>
            </article>
          ))}
        </div>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <h2 className="text-sm font-medium text-slate-900">Version History: {active.name}</h2>
          <div className="mt-3 space-y-2">
            {active.versions.length === 0 && <p className="text-xs text-slate-500">No versions yet.</p>}
            {active.versions.map((version) => (
              <button key={version.id} onClick={() => restoreVersion(version.id)} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-left text-xs hover:border-orange-300">
                {version.name} • {new Date(version.createdAt).toLocaleString()}
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
