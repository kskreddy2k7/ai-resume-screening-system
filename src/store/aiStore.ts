import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AtsAnalysis {
  impactScore: number;
  atsMatch: number;
  grammarScore: number;
  readabilityScore: number;
  keywordScore: number;
  formattingScore: number;
  missingKeywords: string[];
  weakVerbs: string[];
  issues: string[];
}

export interface JobMatchData {
  matchScore: number;
  missingSkills: string[];
  experienceGaps: string[];
  suggestions: string[];
}

export interface RoadmapData {
  currentSkills: string[];
  missingSkills: string[];
  learningPath: string[];
  projectSuggestions: string[];
  certificationSuggestions: string[];
  interviewTopics: string[];
}

interface AiState {
  jobDescription: string;
  targetRole: string;
  chatHistory: ChatMessage[];
  analysis: AtsAnalysis | null;
  jobMatch: JobMatchData | null;
  roadmap: RoadmapData | null;
  isAnalyzing: boolean;
  
  setJobDescription: (jd: string) => void;
  setTargetRole: (role: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setAnalysis: (analysis: AtsAnalysis) => void;
  setJobMatch: (match: JobMatchData) => void;
  setRoadmap: (roadmap: RoadmapData) => void;
  setIsAnalyzing: (is: boolean) => void;
  clearChat: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  jobDescription: '',
  targetRole: '',
  chatHistory: [
    { id: 'initial', role: 'assistant', content: 'Hi! Let\'s build the perfect resume. Want me to review a project or improve a bullet point? Tell me about your role and what you achieved.' }
  ],
  analysis: null,
  jobMatch: null,
  roadmap: null,
  isAnalyzing: false,

  setJobDescription: (jd) => set({ jobDescription: jd }),
  setTargetRole: (role) => set({ targetRole: role }),
  addChatMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
  setAnalysis: (analysis) => set({ analysis }),
  setJobMatch: (match) => set({ jobMatch: match }),
  setRoadmap: (roadmap) => set({ roadmap }),
  setIsAnalyzing: (is) => set({ isAnalyzing: is }),
  clearChat: () => set({ chatHistory: [] }),
}));
