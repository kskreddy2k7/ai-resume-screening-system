import { type ResumeData } from '../store/resumeStore';
import { type AtsAnalysis, type JobMatchData } from '../store/aiStore';

import { parseResumeTextStatic } from './heuristics';

export async function parseResumeText(text: string): Promise<Partial<ResumeData>> {
  return parseResumeTextStatic(text);
}

export async function analyzeAts(resume: ResumeData): Promise<AtsAnalysis> {
  const jsonStr = JSON.stringify(resume).toLowerCase();
  
  const actionVerbs = [
    'managed', 'led', 'developed', 'created', 'designed', 'improved', 'increased', 'reduced', 
    'optimized', 'launched', 'delivered', 'built', 'spearheaded', 'resolved', 'analyzed', 
    'collaborated', 'implemented', 'orchestrated', 'executed', 'formulated', 'pioneered',
    'revamped', 'streamlined', 'maximized', 'mentored', 'facilitated', 'negotiated', 'directed',
    'engineered', 'integrated', 'accelerated', 'transformed', 'generated', 'modernized'
  ];
  const weakVerbs = ['helped', 'worked', 'responsible', 'assisted', 'participated', 'handled', 'duties'];
  
  let verbCount = 0;
  let weakVerbCount = 0;
  let foundWeakVerbs: string[] = [];
  let issues: string[] = [];

  actionVerbs.forEach(verb => {
    if (jsonStr.includes(verb)) verbCount++;
  });

  weakVerbs.forEach(verb => {
    if (jsonStr.includes(verb)) {
      weakVerbCount++;
      foundWeakVerbs.push(verb);
    }
  });

  // Calculate total approximate words
  const totalWords = jsonStr.split(/\s+/).length;

  if (verbCount < 5) issues.push("Consider using more strong action verbs (e.g., Developed, Spearheaded, Engineered).");
  if (weakVerbCount > 0) issues.push(`Found weak verbs like '${foundWeakVerbs[0]}'. Use stronger alternatives.`);
  if (!resume.personalInfo.email) issues.push("Missing email address.");
  if (!resume.personalInfo.phone) issues.push("Missing phone number.");
  if (!resume.personalInfo.linkedin) issues.push("Consider adding a LinkedIn profile link.");
  if (!resume.summary || resume.summary.length < 50) issues.push("Professional summary is too short or missing.");
  if (resume.experience.length === 0) issues.push("No experience section found.");
  if (totalWords < 150) issues.push("Resume is very brief. Consider adding more details to your experience.");

  // Check for quantifiable numbers in experience
  let hasNumbers = false;
  resume.experience.forEach(exp => {
    if (/\d+/.test(exp.description)) hasNumbers = true;
  });
  if (!hasNumbers && resume.experience.length > 0) {
    issues.push("Your experience lacks quantifiable metrics. Try adding numbers (e.g., 'increased sales by 20%').");
  }

  // Heuristic scoring logic
  let impactScore = 40;
  impactScore += Math.min(30, verbCount * 4); // Up to 30 points for action verbs
  impactScore -= (weakVerbCount * 5); // Penalty for weak verbs
  if (hasNumbers) impactScore += 20; // Big bonus for numbers
  if (totalWords > 200) impactScore += 10;
  
  impactScore = Math.max(0, Math.min(100, impactScore));

  let formatScore = 100 - (issues.length * 10);
  let grammarScore = 90; // Statically hard to verify
  let readabilityScore = totalWords > 400 ? 80 : 95; 

  return {
    impactScore,
    atsMatch: Math.min(100, Math.floor((impactScore + formatScore) / 2)),
    grammarScore,
    readabilityScore,
    keywordScore: Math.min(100, verbCount * 8),
    formattingScore: formatScore,
    missingKeywords: ['Leadership', 'Analytics', 'Project Management'].filter(k => !jsonStr.includes(k.toLowerCase())),
    weakVerbs: foundWeakVerbs,
    issues: issues.length > 0 ? issues : ["Resume looks solid from a static formatting perspective!"]
  };
}

export async function matchJobDescription(resume: ResumeData, jd: string): Promise<JobMatchData> {
  const jdLower = jd.toLowerCase();
  const resumeLower = JSON.stringify(resume).toLowerCase();

  const commonTechSkills = [
    'react', 'node', 'python', 'java', 'sql', 'aws', 'docker', 'kubernetes', 
    'typescript', 'javascript', 'c++', 'go', 'azure', 'gcp', 'agile', 'scrum', 
    'machine learning', 'ai', 'data analysis', 'figma', 'ui/ux', 'seo'
  ];
  
  let matchCount = 0;
  let missingSkills: string[] = [];

  commonTechSkills.forEach(skill => {
    if (jdLower.includes(skill)) {
      if (resumeLower.includes(skill)) {
        matchCount++;
      } else {
        missingSkills.push(skill);
      }
    }
  });

  let matchScore = 50;
  if (missingSkills.length === 0 && matchCount > 0) matchScore = 95;
  else if (matchCount > 0) matchScore = Math.min(100, 50 + (matchCount * 10));

  return {
    matchScore,
    missingSkills,
    experienceGaps: ["Review your years of experience against the JD requirements."],
    suggestions: [
      "Ensure you explicitly list required skills exactly as written in the JD.",
      "Tailor your bullet points to the responsibilities mentioned."
    ]
  };
}

export async function rewriteText(text: string, _instructions: string): Promise<string> {
  // Static fallback since we removed the AI API
  return `[AI REMOVED] Please edit manually: ${text}`;
}

export async function generateRoadmap(_resume: ResumeData, _targetRole: string): Promise<any> {
  return null; // Deprecated
}

export async function chatWithCopilot(_userMessage: string, _chatHistory: any[]): Promise<string> {
  return "AI features have been removed to eliminate API key requirements."; // Deprecated
}
