import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStarterResume } from '@/lib/defaults'
import type { AnalysisResult, JobMatchResult, ResumeDocument, ResumeSection } from '@/types/resume'

interface PlatformState {
  resumes: ResumeDocument[]
  activeResumeId: string
  selectedSectionId: string | null
  zoom: number
  history: ResumeDocument[]
  future: ResumeDocument[]
  latestAnalysis: AnalysisResult | null
  latestMatch: JobMatchResult | null
  createResume: () => void
  setActiveResume: (id: string) => void
  updateResumeName: (name: string) => void
  updateTemplate: (template: string) => void
  addSection: (type: ResumeSection['type']) => void
  updateSection: (id: string, content: string) => void
  updateSectionTitle: (id: string, title: string) => void
  removeSection: (id: string) => void
  duplicateSection: (id: string) => void
  reorderSection: (sourceId: string, targetId: string) => void
  saveVersion: (name: string) => void
  restoreVersion: (versionId: string) => void
  renameResume: (id: string, name: string) => void
  duplicateResume: (id: string) => void
  deleteResume: (id: string) => void
  importSections: (sections: ResumeSection[]) => void
  setZoom: (value: number) => void
  selectSection: (id: string | null) => void
  undo: () => void
  redo: () => void
  setLatestAnalysis: (result: AnalysisResult) => void
  setLatestMatch: (result: JobMatchResult) => void
}

const activeResume = (state: PlatformState): ResumeDocument =>
  state.resumes.find((resume) => resume.id === state.activeResumeId) ?? state.resumes[0]

const withSnapshot = (state: PlatformState): Pick<PlatformState, 'history' | 'future'> => ({
  history: [...state.history, JSON.parse(JSON.stringify(activeResume(state))) as ResumeDocument].slice(-40),
  future: [],
})

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => {
      const starter = createStarterResume()

      return {
        resumes: [starter],
        activeResumeId: starter.id,
        selectedSectionId: null,
        zoom: 100,
        history: [],
        future: [],
        latestAnalysis: null,
        latestMatch: null,

        createResume: () =>
          set((state) => {
            const resume = createStarterResume()
            return {
              resumes: [resume, ...state.resumes],
              activeResumeId: resume.id,
              selectedSectionId: resume.sections[0]?.id ?? null,
            }
          }),

        setActiveResume: (id) => set({ activeResumeId: id, selectedSectionId: null }),

        updateResumeName: (name) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId ? { ...resume, name, updatedAt: new Date().toISOString() } : resume,
            ),
          })),

        updateTemplate: (template) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId ? { ...resume, template, updatedAt: new Date().toISOString() } : resume,
            ),
          })),

        addSection: (type) =>
          set((state) => {
            const id = crypto.randomUUID()
            const title = type.charAt(0).toUpperCase() + type.slice(1)
            const section: ResumeSection = { id, type, title, content: '' }
            return {
              ...withSnapshot(state),
              selectedSectionId: id,
              resumes: state.resumes.map((resume) =>
                resume.id === state.activeResumeId
                  ? { ...resume, sections: [...resume.sections, section], updatedAt: new Date().toISOString() }
                  : resume,
              ),
            }
          }),

        updateSection: (id, content) =>
          set((state) => ({
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId
                ? {
                    ...resume,
                    sections: resume.sections.map((section) => (section.id === id ? { ...section, content } : section)),
                    updatedAt: new Date().toISOString(),
                  }
                : resume,
            ),
          })),

        updateSectionTitle: (id, title) =>
          set((state) => ({
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId
                ? {
                    ...resume,
                    sections: resume.sections.map((section) => (section.id === id ? { ...section, title } : section)),
                    updatedAt: new Date().toISOString(),
                  }
                : resume,
            ),
          })),

        removeSection: (id) =>
          set((state) => ({
            ...withSnapshot(state),
            selectedSectionId: null,
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId
                ? {
                    ...resume,
                    sections: resume.sections.filter((section) => section.id !== id),
                    updatedAt: new Date().toISOString(),
                  }
                : resume,
            ),
          })),

        duplicateSection: (id) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) => {
              if (resume.id !== state.activeResumeId) return resume
              const source = resume.sections.find((section) => section.id === id)
              if (!source) return resume
              return {
                ...resume,
                sections: [...resume.sections, { ...source, id: crypto.randomUUID(), title: `${source.title} Copy` }],
                updatedAt: new Date().toISOString(),
              }
            }),
          })),

        reorderSection: (sourceId, targetId) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) => {
              if (resume.id !== state.activeResumeId) return resume
              const sourceIndex = resume.sections.findIndex((section) => section.id === sourceId)
              const targetIndex = resume.sections.findIndex((section) => section.id === targetId)
              if (sourceIndex < 0 || targetIndex < 0) return resume
              const reordered = [...resume.sections]
              const [moved] = reordered.splice(sourceIndex, 1)
              reordered.splice(targetIndex, 0, moved)
              return { ...resume, sections: reordered, updatedAt: new Date().toISOString() }
            }),
          })),

        saveVersion: (name) =>
          set((state) => ({
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId
                ? {
                    ...resume,
                    versions: [
                      {
                        id: crypto.randomUUID(),
                        name,
                        createdAt: new Date().toISOString(),
                        sections: JSON.parse(JSON.stringify(resume.sections)) as ResumeSection[],
                      },
                      ...resume.versions,
                    ].slice(0, 30),
                  }
                : resume,
            ),
          })),

        restoreVersion: (versionId) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) => {
              if (resume.id !== state.activeResumeId) return resume
              const version = resume.versions.find((item) => item.id === versionId)
              if (!version) return resume
              return {
                ...resume,
                sections: JSON.parse(JSON.stringify(version.sections)) as ResumeSection[],
                updatedAt: new Date().toISOString(),
              }
            }),
          })),

        renameResume: (id, name) =>
          set((state) => ({
            resumes: state.resumes.map((resume) => (resume.id === id ? { ...resume, name, updatedAt: new Date().toISOString() } : resume)),
          })),

        duplicateResume: (id) =>
          set((state) => {
            const source = state.resumes.find((resume) => resume.id === id)
            if (!source) return state
            const copy: ResumeDocument = {
              ...JSON.parse(JSON.stringify(source)) as ResumeDocument,
              id: crypto.randomUUID(),
              name: `${source.name} Copy`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            return { resumes: [copy, ...state.resumes], activeResumeId: copy.id }
          }),

        deleteResume: (id) =>
          set((state) => {
            const remaining = state.resumes.filter((resume) => resume.id !== id)
            if (!remaining.length) {
              const fallback = createStarterResume()
              return { resumes: [fallback], activeResumeId: fallback.id }
            }
            return {
              resumes: remaining,
              activeResumeId: state.activeResumeId === id ? remaining[0].id : state.activeResumeId,
            }
          }),

        importSections: (sections) =>
          set((state) => ({
            ...withSnapshot(state),
            resumes: state.resumes.map((resume) =>
              resume.id === state.activeResumeId ? { ...resume, sections, updatedAt: new Date().toISOString() } : resume,
            ),
            selectedSectionId: sections[0]?.id ?? null,
          })),

        setZoom: (value) => set({ zoom: Math.max(50, Math.min(150, value)) }),
        selectSection: (id) => set({ selectedSectionId: id }),

        undo: () =>
          set((state) => {
            if (!state.history.length) return state
            const prev = state.history[state.history.length - 1]
            return {
              history: state.history.slice(0, -1),
              future: [...state.future, JSON.parse(JSON.stringify(activeResume(state))) as ResumeDocument],
              resumes: state.resumes.map((resume) => (resume.id === state.activeResumeId ? prev : resume)),
            }
          }),

        redo: () =>
          set((state) => {
            if (!state.future.length) return state
            const next = state.future[state.future.length - 1]
            return {
              history: [...state.history, JSON.parse(JSON.stringify(activeResume(state))) as ResumeDocument],
              future: state.future.slice(0, -1),
              resumes: state.resumes.map((resume) => (resume.id === state.activeResumeId ? next : resume)),
            }
          }),

        setLatestAnalysis: (result) => set({ latestAnalysis: result }),
        setLatestMatch: (result) => set({ latestMatch: result }),
      }
    },
    {
      name: 'talentflow-platform-v3',
      partialize: (state) => ({
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
        zoom: state.zoom,
      }),
    },
  ),
)
