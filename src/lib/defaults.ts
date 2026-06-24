import type { ResumeDocument, ResumeSection } from '@/types/resume'

const createSection = (id: string, type: ResumeSection['type'], title: string, content: string): ResumeSection => ({
  id,
  type,
  title,
  content,
})

export const starterSections: ResumeSection[] = [
  createSection('personal', 'personal', 'Personal Information', 'Name\nEmail\nPhone\nLocation\nLinkedIn'),
  createSection('summary', 'summary', 'Summary', 'Result-oriented professional with strong ownership and product focus.'),
  createSection('experience', 'experience', 'Experience', 'Role | Company | Dates\n- Delivered impact using measurable results.'),
  createSection('education', 'education', 'Education', 'Degree | University | Year'),
  createSection('skills', 'skills', 'Skills', 'TypeScript, React, Tailwind CSS, Communication, Problem Solving'),
]

export const createStarterResume = (): ResumeDocument => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'My Resume',
    template: 'Professional',
    createdAt: now,
    updatedAt: now,
    sections: starterSections,
    versions: [],
  }
}

export const templateCatalog = [
  'Professional',
  'Software Engineer',
  'Data Science',
  'AI Engineer',
  'Student',
  'Internship',
  'Minimal',
  'Executive',
  'Creative',
  'Modern',
]
