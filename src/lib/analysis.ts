import type { AnalysisResult, JobMatchResult, ResumeDocument } from '@/types/resume'

const requiredSkills = ['react', 'typescript', 'python', 'aws', 'docker', 'sql', 'leadership']
const weakVerbs = ['worked', 'helped', 'did', 'made']

const uniqueWords = (text: string): string[] =>
  Array.from(new Set(text.toLowerCase().match(/[a-z0-9+#.]{3,}/g) ?? []))

export const analyzeResume = (resume: ResumeDocument): AnalysisResult => {
  const text = resume.sections.map((s) => `${s.title} ${s.content}`).join(' ')
  const words = uniqueWords(text)
  const missingSkills = requiredSkills.filter((skill) => !words.includes(skill))
  const weakFound = weakVerbs.filter((verb) => text.toLowerCase().includes(`${verb} `))
  const lineCount = text.split('\n').length

  const atsScore = Math.max(45, Math.min(98, 100 - missingSkills.length * 7 - weakFound.length * 4))
  const readability = Math.max(40, Math.min(97, 65 + Math.round((text.length / Math.max(lineCount, 1)) / 5)))

  return {
    atsScore,
    readability,
    grammarIssues: text.length < 200 ? ['Summary is too short for strong recruiter context.'] : [],
    formattingIssues: lineCount < 8 ? ['Add clearer section spacing and bullet hierarchy.'] : [],
    missingSkills,
    weakVerbs: weakFound,
    strengths: [
      'Clear section structure',
      'Template consistency',
      'ATS-friendly plain text emphasis',
    ],
    weaknesses: [
      ...(missingSkills.length ? ['Skill coverage gap for target roles'] : []),
      ...(weakFound.length ? ['Weak action verb usage in bullets'] : []),
    ],
    suggestions: [
      { target: 'Summary', text: 'Add quantified achievements and domain expertise in the first 2 lines.' },
      { target: 'Experience', text: 'Replace weak verbs with impact verbs like Led, Architected, Optimized.' },
      { target: 'Skills', text: `Include missing skills: ${missingSkills.slice(0, 4).join(', ') || 'N/A'}` },
    ],
  }
}

export const matchResumeToJob = (resume: ResumeDocument, jobDescription: string): JobMatchResult => {
  const resumeWords = uniqueWords(resume.sections.map((s) => s.content).join(' '))
  const jdWords = uniqueWords(jobDescription)
  const jdSet = new Set(jdWords)
  const overlap = resumeWords.filter((w) => jdSet.has(w))
  const density = jdWords.length ? Math.round((overlap.length / jdWords.length) * 100) : 0
  const score = Math.min(98, Math.max(20, density + 25))
  const missingKeywords = jdWords.filter((w) => !resumeWords.includes(w)).slice(0, 12)
  const missingSkills = requiredSkills.filter((skill) => jdSet.has(skill) && !resumeWords.includes(skill))

  return {
    score,
    missingKeywords,
    missingSkills,
    keywordDensity: density,
    recommendations: [
      'Prioritize top missing keywords in Summary and Experience sections.',
      'Mirror JD terminology while keeping truthful experience claims.',
      'Increase role-specific tool mentions in Projects and Skills.',
    ],
  }
}

export const applySuggestionToResume = (resume: ResumeDocument, target: string, suggestion: string): ResumeDocument => {
  const updatedSections = resume.sections.map((section) =>
    section.title.toLowerCase().includes(target.toLowerCase())
      ? { ...section, content: `${section.content}\n• ${suggestion}` }
      : section,
  )

  return {
    ...resume,
    sections: updatedSections,
    updatedAt: new Date().toISOString(),
  }
}
