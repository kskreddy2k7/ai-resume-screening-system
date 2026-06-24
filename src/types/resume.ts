export type SectionType =
  | 'personal'
  | 'summary'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certificates'
  | 'achievements'
  | 'languages'
  | 'custom'

export interface ResumeSection {
  id: string
  type: SectionType
  title: string
  content: string
}

export interface ResumeVersion {
  id: string
  name: string
  createdAt: string
  sections: ResumeSection[]
}

export interface ResumeDocument {
  id: string
  name: string
  template: string
  createdAt: string
  updatedAt: string
  sections: ResumeSection[]
  versions: ResumeVersion[]
}

export interface AnalysisResult {
  atsScore: number
  readability: number
  grammarIssues: string[]
  formattingIssues: string[]
  missingSkills: string[]
  weakVerbs: string[]
  strengths: string[]
  weaknesses: string[]
  suggestions: Array<{ target: string; text: string }>
}

export interface JobMatchResult {
  score: number
  missingKeywords: string[]
  missingSkills: string[]
  keywordDensity: number
  recommendations: string[]
}
