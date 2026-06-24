import { type ResumeData } from '../store/resumeStore';
import { type AtsAnalysis, type JobMatchData } from '../store/aiStore';

export function parseResumeTextStatic(text: string): Partial<ResumeData> {
  const data: Partial<ResumeData> = {
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: []
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return data;

  // Basic Contact Extractions
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  if (emailMatch) data.personalInfo!.email = emailMatch[0];

  const phoneMatch = text.match(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i);
  if (phoneMatch) data.personalInfo!.phone = phoneMatch[0];

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) data.personalInfo!.linkedin = linkedinMatch[0];

  // Try to find the name (usually the first non-contact line)
  data.personalInfo!.fullName = lines[0];

  let currentSection = 'summary';
  let currentBlock: string[] = [];
  
  const saveSection = () => {
    const blockText = currentBlock.join('\n');
    if (!blockText.trim()) return;

    if (currentSection === 'summary') {
      data.summary = blockText.substring(0, 800); // Limit summary size
    } else if (currentSection === 'experience') {
      const expLines = currentBlock.filter(l => l.trim().length > 0);
      data.experience!.push({
        id: Date.now().toString() + Math.random(),
        company: expLines[0] || '',
        role: expLines.length > 1 ? expLines[1] : '',
        startDate: '',
        endDate: '',
        location: '',
        description: expLines.slice(2).join('\n').substring(0, 1000) || blockText.substring(0, 1000)
      });
    } else if (currentSection === 'education') {
      const eduLines = currentBlock.filter(l => l.trim().length > 0);
      data.education!.push({
        id: Date.now().toString() + Math.random(),
        school: eduLines[0] || '',
        degree: eduLines.length > 1 ? eduLines[1] : '',
        startDate: '',
        endDate: '',
        location: '',
        description: eduLines.slice(2).join('\n').substring(0, 500) || blockText.substring(0, 500)
      });
    } else if (currentSection === 'projects') {
      if (!data.projects) data.projects = [];
      const projLines = currentBlock.filter(l => l.trim().length > 0);
      data.projects.push({
        id: Date.now().toString() + Math.random(),
        name: projLines[0] || '',
        link: '',
        description: projLines.slice(1).join('\n').substring(0, 1000) || blockText.substring(0, 1000)
      });
    } else if (currentSection === 'skills') {
      const splitSkills = blockText.split(/[,\n•|;]+/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
      splitSkills.forEach(s => data.skills!.push({ id: Date.now().toString() + Math.random(), name: s, category: 'Core' }));
    }
    currentBlock = [];
  };

  for (let i = 1; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase().replace(/[^a-z ]/g, '').trim();
    
    // Detect section headers using robust matching
    if (lineLower.includes('experience') || lineLower.includes('employment') || lineLower.includes('work history')) {
      if (lineLower.length < 30) { // Ensure it's actually a header and not a sentence
        saveSection();
        currentSection = 'experience';
        continue;
      }
    } else if (lineLower.includes('education') || lineLower.includes('academic')) {
      if (lineLower.length < 30) {
        saveSection();
        currentSection = 'education';
        continue;
      }
    } else if (lineLower.includes('project') || lineLower.includes('portfolio')) {
      if (lineLower.length < 30) {
        saveSection();
        currentSection = 'projects';
        continue;
      }
    } else if (lineLower.includes('skills') || lineLower.includes('competencies') || lineLower.includes('technologies')) {
      if (lineLower.length < 30) {
        saveSection();
        currentSection = 'skills';
        continue;
      }
    } else if (lineLower.includes('summary') || lineLower.includes('profile') || lineLower.includes('about')) {
      if (lineLower.length < 30) {
        saveSection();
        currentSection = 'summary';
        continue;
      }
    }

    currentBlock.push(lines[i]);
  }
  
  saveSection(); // Save the last section

  // If no sections were found, provide empty blocks so the user can edit them
  if (data.experience!.length === 0) {
    data.experience!.push({ id: '1', company: '', role: '', startDate: '', endDate: '', location: '', description: '' });
  }
  if (data.education!.length === 0) {
    data.education!.push({ id: '1', school: '', degree: '', startDate: '', endDate: '', location: '', description: '' });
  }
  if (data.skills!.length === 0) {
    data.skills!.push({ id: '1', name: '', category: 'Core' });
  }
  if (!data.projects || data.projects.length === 0) {
    data.projects = [{ id: '1', name: '', description: '', link: '' }];
  }

  return data;
}

export function analyzeAtsStatic(resume: ResumeData): AtsAnalysis {
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
  let issues = [];

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

export function matchJobDescriptionStatic(resume: ResumeData, jd: string): JobMatchData {
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
