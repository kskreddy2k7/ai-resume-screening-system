import type { ResumeSection } from '@/types/resume'

const extractSection = (text: string, label: string): string => {
  const pattern = new RegExp(`${label}[:\\n\\r\\t ]+([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]{2,20}:|$)`, 'i')
  const match = text.match(pattern)
  return match?.[1]?.trim() ?? ''
}

export const parseImportedResume = async (file: File): Promise<ResumeSection[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  let rawText = await file.text()

  if (extension === 'pdf' || extension === 'docx') {
    rawText = rawText.replace(/[^\x20-\x7E\n]/g, ' ')
  }

  const summary = extractSection(rawText, 'summary') || extractSection(rawText, 'profile')
  const experience = extractSection(rawText, 'experience')
  const education = extractSection(rawText, 'education')
  const projects = extractSection(rawText, 'projects')
  const skills = extractSection(rawText, 'skills')
  const achievements = extractSection(rawText, 'achievements')

  const section = (id: string, type: ResumeSection['type'], title: string, content: string): ResumeSection => ({
    id,
    type,
    title,
    content: content || 'No data extracted yet. Edit this section manually.',
  })

  return [
    section('personal', 'personal', 'Personal Information', rawText.split('\n').slice(0, 6).join('\n') || 'Name\nEmail\nPhone'),
    section('summary', 'summary', 'Summary', summary),
    section('experience', 'experience', 'Experience', experience),
    section('education', 'education', 'Education', education),
    section('projects', 'projects', 'Projects', projects),
    section('skills', 'skills', 'Skills', skills),
    section('achievements', 'achievements', 'Achievements', achievements),
  ]
}
