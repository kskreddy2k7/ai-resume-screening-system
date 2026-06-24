import { useState } from 'react';
import { Sparkles, FileSearch, Target, ExternalLink, Copy, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiStore } from '../../store/aiStore';
import { useResumeStore } from '../../store/resumeStore';
import { analyzeAts, matchJobDescription } from '../../lib/ai';
import { exportResumeToPdf } from '../../lib/export';

export default function AIAssistant() {
  const {
    analysis, setAnalysis,
    jobMatch, setJobMatch,
    jobDescription, setJobDescription,
    isAnalyzing, setIsAnalyzing
  } = useAiStore();

  const resumeData = useResumeStore((state: any) => state.data);
  const [activeTab, setActiveTab] = useState<'ats' | 'match' | 'ai' | 'export'>('ats');
  const [copied, setCopied] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeAts(resumeData);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
      alert('Analysis failed.');
    }
    setIsAnalyzing(false);
  };

  const handleMatch = async () => {
    if (!jobDescription) { alert('Please enter a Job Description'); return; }
    setIsAnalyzing(true);
    try {
      const res = await matchJobDescription(resumeData, jobDescription);
      setJobMatch(res);
    } catch (e) {
      console.error(e);
      alert('Job matching failed.');
    }
    setIsAnalyzing(false);
  };

  const copyPrompt = (type: string) => {
    let prompt = '';
    const resumeText = JSON.stringify(resumeData, null, 2);

    if (type === 'summary') {
      prompt = `Act as an expert resume writer. Here is my resume data:\n\n${resumeText}\n\nPlease write 3 options for a powerful, ATS-friendly professional summary (max 3 sentences each) that highlights my key achievements and skills.`;
    } else if (type === 'bullets') {
      prompt = `Act as an expert resume writer. Here is my resume data:\n\n${resumeText}\n\nPlease rewrite my experience bullet points to follow the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]). Make them highly quantified and action-oriented.`;
    } else if (type === 'project') {
      prompt = `Act as a senior technical recruiter. Here is my resume data:\n\n${resumeText}\n\nI need to add a new project to my resume. Ask me 3 quick questions about the project, and then generate 3 professional, ATS-optimized bullet points describing its impact and the tech stack used.`;
    }

    navigator.clipboard.writeText(prompt);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <aside className="w-80 flex flex-col border-l border-border/50 bg-[#060606] relative shrink-0 overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-border/30 flex items-center px-6 gap-2 text-white/90 font-display font-bold text-sm tracking-tight shrink-0 select-none">
        <Sparkles className="w-4 h-4 text-primary" /> Intelligence Engine
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/30 text-[10px] font-bold text-muted-foreground shrink-0 uppercase tracking-wider overflow-x-auto custom-scrollbar select-none bg-white/[0.01]">
        {(['ats', 'match', 'ai', 'export'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 border-b-2 transition-all text-center relative ${activeTab === tab
                ? 'border-white text-white font-extrabold'
                : 'border-transparent text-muted-foreground/60 hover:text-white/80'
              }`}
          >
            {tab === 'ats' ? 'ATS Scan' : tab === 'match' ? 'Job Match' : tab === 'ai' ? 'AI Assistant' : 'Export'}
          </button>
        ))}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-5 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'ats' && (
            <motion.div
              key="ats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!analysis ? (
                <div className="text-center py-16 space-y-5">
                  <div className="w-14 h-14 bg-white/[0.02] text-white border border-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <FileSearch className="w-6 h-6 text-white/70" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Run ATS Readiness Scan</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed px-2">Analyze formatting, action verbs, keyword frequencies, and quantified metrics.</p>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 border border-white/10"
                  >
                    {isAnalyzing ? 'Scanning Content...' : 'Start ATS Scan'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 gap-3.5 select-none">
                    {/* Impact Dial */}
                    <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative group hover:border-white/10 transition-colors">
                      <div className="relative w-18 h-18 flex items-center justify-center mb-2.5">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-white/[0.04]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path
                            className="stroke-[url(#impactGrad)]"
                            strokeDasharray={`${analysis.impactScore}, 100`}
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <defs>
                            <linearGradient id="impactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-base font-display font-black text-white">{analysis.impactScore}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Impact Score</p>
                    </div>

                    {/* Formatting Dial */}
                    <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative group hover:border-white/10 transition-colors">
                      <div className="relative w-18 h-18 flex items-center justify-center mb-2.5">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-white/[0.04]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path
                            className="stroke-[url(#formatGrad)]"
                            strokeDasharray={`${analysis.atsMatch}, 100`}
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <defs>
                            <linearGradient id="formatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-base font-display font-black text-white">{analysis.atsMatch}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Formatting</p>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">Recommendations</h3>
                    <div className="space-y-2">
                      {analysis.issues.map((issue, i) => (
                        <div key={i} className="p-3 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl border border-white/5 text-xs flex gap-3 items-start transition-all">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{issue}</p>
                        </div>
                      ))}
                      {analysis.issues.length === 0 && (
                        <div className="p-4 bg-green-500/[0.02] border border-green-500/10 rounded-xl text-center">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
                          <p className="text-xs text-green-500 font-semibold">Perfect! No ATS formatting issues detected.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    {isAnalyzing ? 'Re-analyzing...' : 'Re-run Scan'}
                  </button>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Target Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements or role details here..."
                  className="w-full h-44 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 resize-none transition-colors leading-relaxed"
                />
                <button
                  onClick={handleMatch}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 border border-white/10"
                >
                  <Target className="w-4 h-4" /> {isAnalyzing ? 'Matching Resume...' : 'Analyze Match Score'}
                </button>
              </div>

              {jobMatch && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Match Grade</h3>
                    <span className={`text-xl font-display font-black ${jobMatch.matchScore > 80 ? 'text-green-400' : 'text-amber-400'}`}>{jobMatch.matchScore}%</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Missing Keywords & Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatch.missingSkills.map((skill, i) => (
                        <span key={i} className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg uppercase tracking-wide">{skill}</span>
                      ))}
                      {jobMatch.missingSkills.length === 0 && (
                        <div className="text-xs text-green-400 font-semibold flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-4 h-4" /> All key terms successfully matched!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>Enhance your resume using external LLMs. Click any card below to copy a customized prompt with your resume data, then paste it directly into ChatGPT or Claude.</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => copyPrompt('summary')}
                  className="w-full py-3 px-4 bg-white/[0.02] border border-white/5 text-white/90 rounded-xl text-xs font-bold hover:bg-white/[0.04] hover:border-white/10 transition-all flex items-center justify-between text-left"
                >
                  <span>Improve Summary</span>
                  {copied === 'summary' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground/50" />}
                </button>

                <button
                  onClick={() => copyPrompt('bullets')}
                  className="w-full py-3 px-4 bg-white/[0.02] border border-white/5 text-white/90 rounded-xl text-xs font-bold hover:bg-white/[0.04] hover:border-white/10 transition-all flex items-center justify-between text-left"
                >
                  <span>XYZ Formula Bullets</span>
                  {copied === 'bullets' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground/50" />}
                </button>

                <button
                  onClick={() => copyPrompt('project')}
                  className="w-full py-3 px-4 bg-white/[0.02] border border-white/5 text-white/90 rounded-xl text-xs font-bold hover:bg-white/[0.04] hover:border-white/10 transition-all flex items-center justify-between text-left"
                >
                  <span>Add Project Bullets</span>
                  {copied === 'project' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground/50" />}
                </button>

                <div className="h-px bg-white/5 my-4" />

                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold text-center select-none">Quick Open LLM Links</div>

                <div className="grid grid-cols-2 gap-2">
                  <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="w-full py-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-white/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" /> ChatGPT
                  </a>
                  <a href="https://claude.ai/" target="_blank" rel="noreferrer" className="w-full py-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-white/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" /> Claude
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-white/[0.02] text-white border border-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Download className="w-6 h-6 text-white/70" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Download Ready</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">Download your pixel-perfect, recruiter-approved resume in your preferred format.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => exportResumeToPdf()}
                  className="w-full py-3 bg-white text-black hover:bg-white/95 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 border border-white/10"
                >
                  <Download className="w-4 h-4" /> Download PDF (ATS Friendly)
                </button>
                <button
                  onClick={() => import('../../lib/export').then(m => m.exportResumeToDocx())}
                  className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download Word (DOCX)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
