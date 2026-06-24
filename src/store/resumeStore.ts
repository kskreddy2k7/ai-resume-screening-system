import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

export interface LayoutConfig {
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  lineSpacing: number;
  margins: number;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: { id: string; name: string; issuer: string; date: string }[];
  achievements: { id: string; name: string; date: string; description: string }[];
  languages: { id: string; name: string; proficiency: string }[];
  sectionOrder: string[];
  layout: LayoutConfig;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Alexander Wright',
    email: 'alexander@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexanderw',
    website: 'alexanderwright.dev',
  },
  summary: 'Data-driven Product Manager with 5+ years of experience launching B2B SaaS products that drive revenue growth and improve user retention. Adept at cross-functional leadership and agile methodologies.',
  experience: [
    {
      id: uuidv4(),
      company: 'TechFlow Solutions',
      role: 'Senior Product Manager',
      startDate: 'Jan 2021',
      endDate: 'Present',
      location: 'San Francisco, CA',
      description: '• Spearheaded the launch of a new AI analytics dashboard, increasing user engagement by 40%.\n• Managed a cross-functional team of 15 engineers and designers.\n• Reduced churn rate by 15% through targeted feature improvements.',
    },
    {
      id: uuidv4(),
      company: 'InnovateX',
      role: 'Product Manager',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      location: 'New York, NY',
      description: '• Defined product roadmap for enterprise workflow tools.\n• Increased enterprise MRR by $500k within the first year of release.\n• Conducted over 100 customer interviews to validate product-market fit.',
    }
  ],
  education: [
    {
      id: uuidv4(),
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      startDate: 'Sep 2014',
      endDate: 'May 2018',
      location: 'Berkeley, CA',
      description: '• Graduated Magna Cum Laude.\n• President of the Product Management Club.',
    }
  ],
  projects: [],
  skills: [
    { id: uuidv4(), name: 'Product Strategy', category: 'Core' },
    { id: uuidv4(), name: 'Agile/Scrum', category: 'Core' },
    { id: uuidv4(), name: 'Data Analysis (SQL, Python)', category: 'Technical' },
    { id: uuidv4(), name: 'User Research', category: 'Core' },
  ],
  certifications: [],
  achievements: [],
  languages: [],
  sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages'],
  layout: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    primaryColor: '#0a0a0a',
    lineSpacing: 1.5,
    margins: 20
  }
};

interface ResumeState {
  data: ResumeData;
  history: ResumeData[];
  historyIndex: number;
  templateId: string;
  zoom: number;
  viewMode: 'canvas' | 'raw';
  rawText: string;
  setTemplateId: (id: string) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: 'canvas' | 'raw') => void;
  setRawText: (text: string) => void;
  updateData: (updater: (draft: ResumeData) => void) => void;
  undo: () => void;
  redo: () => void;
  loadResume: (data: Partial<ResumeData>) => void;
}

// Helper to deep clone to avoid reference issues in history
const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: cloneDeep(defaultResumeData),
      history: [cloneDeep(defaultResumeData)],
      historyIndex: 0,
      templateId: 'modern',
      zoom: 1,
      viewMode: 'canvas',
      rawText: '',
      
      setTemplateId: (id) => set({ templateId: id }),
      setZoom: (zoom) => set({ zoom }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setRawText: (text) => set({ rawText: text }),
      
      updateData: (updater) => {
        set((state) => {
          const newData = cloneDeep(state.data);
          updater(newData);
          
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(cloneDeep(newData));
          
          // Keep last 20 states
          if (newHistory.length > 20) {
            newHistory.shift();
          }
          
          return {
            data: newData,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },
      
      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              data: cloneDeep(state.history[newIndex]),
              historyIndex: newIndex,
            };
          }
          return state;
        });
      },
      
      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              data: cloneDeep(state.history[newIndex]),
              historyIndex: newIndex,
            };
          }
          return state;
        });
      },

      loadResume: (importedData) => {
        set((state) => {
          const newData = cloneDeep(defaultResumeData);
          if (importedData.personalInfo) {
            newData.personalInfo = { ...newData.personalInfo, ...importedData.personalInfo };
          }
          if (importedData.summary !== undefined) newData.summary = importedData.summary;
          if (importedData.experience) newData.experience = importedData.experience;
          if (importedData.education) newData.education = importedData.education;
          if (importedData.projects) newData.projects = importedData.projects;
          if (importedData.skills) newData.skills = importedData.skills;
          
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(cloneDeep(newData));
          return {
            data: newData,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      }
    }),
    {
      name: 'talentflow-resume-storage',
      // We only want to persist the current data, templateId, and zoom.
      // History could be too large and cause quota issues in localStorage.
      partialize: (state) => ({ 
        data: state.data, 
        templateId: state.templateId,
        zoom: state.zoom,
        viewMode: state.viewMode,
        rawText: state.rawText
      }),
    }
  )
);
