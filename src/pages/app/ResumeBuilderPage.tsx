import { useMemo, useState } from 'react'
import { Download, Plus, Redo2, Save, Trash2, Undo2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { usePlatformStore } from '@/store/usePlatformStore'
import { templateCatalog } from '@/lib/defaults'
import { parseImportedResume } from '@/lib/importer'

const sectionTypes = ['summary', 'education', 'experience', 'projects', 'skills', 'certificates', 'achievements', 'languages', 'custom'] as const

export const ResumeBuilderPage = () => {
  const {
    resumes,
    activeResumeId,
    selectedSectionId,
    zoom,
    setZoom,
    selectSection,
    updateSection,
    updateSectionTitle,
    reorderSection,
    duplicateSection,
    removeSection,
    addSection,
    updateResumeName,
    updateTemplate,
    saveVersion,
    importSections,
    undo,
    redo,
  } = usePlatformStore()

  const [fontSize, setFontSize] = useState(15)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [textColor, setTextColor] = useState('#0F172A')
  const [dragId, setDragId] = useState<string | null>(null)

  const resume = useMemo(() => resumes.find((item) => item.id === activeResumeId) ?? resumes[0], [resumes, activeResumeId])

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const sections = await parseImportedResume(file)
    importSections(sections)
  }

  const exportPdf = () => window.print()

  return (
    <section>
      <PageHeader
        title="Resume Builder"
        description="Canva-style editor with inline editing, drag reordering, undo/redo, autosave, and versioning."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={undo} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs"><Undo2 className="h-4 w-4" /></button>
            <button onClick={redo} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs"><Redo2 className="h-4 w-4" /></button>
            <button onClick={() => saveVersion(`Version ${new Date().toLocaleTimeString()}`)} className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs"><Save className="h-4 w-4" /> Save Version</button>
            <button onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs text-white"><Download className="h-4 w-4" /> Export PDF</button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
          <input value={resume.name} onChange={(event) => updateResumeName(event.target.value)} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />

          <div className="grid gap-2 text-xs">
            <label className="text-slate-600">Template</label>
            <select value={resume.template} onChange={(event) => updateTemplate(event.target.value)} className="rounded-lg border border-[#E2E8F0] px-2 py-2 text-sm">
              {templateCatalog.map((template) => (
                <option key={template} value={template}>{template}</option>
              ))}
            </select>
          </div>

          <label className="block rounded-lg border border-dashed border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
            Import Resume (PDF, DOCX, TXT)
            <input type="file" className="mt-2 block w-full text-xs" accept=".pdf,.docx,.txt" onChange={handleImport} />
          </label>

          <div className="grid gap-2 text-xs">
            <label className="text-slate-600">Font size</label>
            <input type="range" min={12} max={22} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
            <label className="text-slate-600">Line spacing</label>
            <input type="range" min={1} max={2.2} step={0.1} value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
            <label className="text-slate-600">Text color</label>
            <input type="color" value={textColor} onChange={(event) => setTextColor(event.target.value)} className="h-9 w-full rounded" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sectionTypes.map((type) => (
              <button key={type} onClick={() => addSection(type)} className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-2 py-2 text-xs hover:bg-slate-100">
                <Plus className="h-3 w-3" /> {type}
              </button>
            ))}
          </div>

          <div className="grid gap-2">
            {resume.sections.map((section) => (
              <button
                key={section.id}
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragId && dragId !== section.id) reorderSection(dragId, section.id)
                }}
                onClick={() => selectSection(section.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${selectedSectionId === section.id ? 'border-orange-300 bg-orange-50' : 'border-[#E2E8F0] bg-white'}`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
            <span>Zoom</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(zoom - 10)} className="rounded border border-[#E2E8F0] px-2 py-1">-</button>
              <span>{zoom}%</span>
              <button onClick={() => setZoom(zoom + 10)} className="rounded border border-[#E2E8F0] px-2 py-1">+</button>
            </div>
          </div>
          <article style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            {resume.sections.map((section) => (
              <div key={section.id} className="group mb-5 rounded-lg border border-transparent p-2 hover:border-orange-200">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    value={section.title}
                    onChange={(event) => updateSectionTitle(section.id, event.target.value)}
                    className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-sm font-medium"
                  />
                  <button onClick={() => duplicateSection(section.id)} className="rounded border border-[#E2E8F0] px-2 py-1 text-xs">Duplicate</button>
                  <button onClick={() => removeSection(section.id)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"><Trash2 className="h-3 w-3" /></button>
                </div>
                <textarea
                  value={section.content}
                  onChange={(event) => updateSection(section.id, event.target.value)}
                  className="min-h-[120px] w-full rounded border border-[#E2E8F0] p-3 text-sm"
                  style={{ fontSize, lineHeight, color: textColor }}
                />
              </div>
            ))}
          </article>
        </div>
      </div>
    </section>
  )
}
