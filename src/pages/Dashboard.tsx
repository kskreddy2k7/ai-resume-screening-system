import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts'
import { 
  Target, Activity, Download, FileText, 
  Plus, Sparkles, History
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'
import axios from 'axios'

const mockPipelineData = [
  { name: 'Jan', applicants: 120, qualified: 45 },
  { name: 'Feb', applicants: 150, qualified: 62 },
  { name: 'Mar', applicants: 220, qualified: 98 },
  { name: 'Apr', applicants: 180, qualified: 85 },
  { name: 'May', applicants: 260, qualified: 140 },
  { name: 'Jun', applicants: 310, qualified: 185 },
]

const heatmapSkills = [
  { name: "React", score: 95, level: "High" },
  { name: "TypeScript", score: 90, level: "High" },
  { name: "Node.js", score: 85, level: "High" },
  { name: "Python", score: 75, level: "Medium" },
  { name: "SQL", score: 80, level: "Medium" },
  { name: "Docker", score: 65, level: "Medium" },
  { name: "AWS", score: 70, level: "Medium" },
  { name: "Kubernetes", score: 45, level: "Low" },
  { name: "Git", score: 90, level: "High" },
  { name: "CI/CD", score: 55, level: "Low" }
]

interface AuditHistoryItem {
  id: string
  filename: string
  timestamp: string
  atsScore: number
  matchScore: number
  role: string
}

export function Dashboard() {
  const { user } = useAuthStore()
  const [resumes, setResumes] = useState<any[]>([])
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([])
  const [latestAts, setLatestAts] = useState<number>(87)
  const [latestMatch, setLatestMatch] = useState<number>(92)

  useEffect(() => {
    // 1. Fetch resumes draft (fallback logic)
    if (user) {
      axios.get(`http://localhost:8000/api/resumes/${user.id}`)
        .then(res => setResumes(res.data))
        .catch(err => {
          console.warn("FastAPI MongoDB offline. Reading local storage draft fallback.", err)
          
          const draft = localStorage.getItem('resume_draft')
          if (draft) {
            try {
              const parsed = JSON.parse(draft)
              setResumes([{
                _id: "local-draft-id",
                created_at: new Date().toISOString(),
                data: parsed
              }])
            } catch (e) {
              console.error("Failed to parse local draft in dashboard", e)
            }
          } else {
            setResumes([{
              _id: "mock-draft-id",
              created_at: new Date().toISOString(),
              data: {
                personal: { name: "Alex Rivera", email: "alex.rivera@example.com" },
                skills: "React, Node, TypeScript, Python"
              }
            }])
          }
        })
    }

    // 2. Load audit history log
    try {
      const historyStr = localStorage.getItem('talentflow_audit_history')
      if (historyStr) {
        const historyList: AuditHistoryItem[] = JSON.parse(historyStr)
        setAuditHistory(historyList)
        
        const atsScan = historyList.find(h => h.atsScore > 0)
        if (atsScan) setLatestAts(atsScan.atsScore)
        
        const matchScan = historyList.find(h => h.matchScore > 0)
        if (matchScan) setLatestMatch(matchScan.matchScore)
      } else {
        const defaultHistory = [
          { id: '1', filename: 'resume_senior_dev.pdf', timestamp: new Date(Date.now() - 3600000).toISOString(), atsScore: 87, matchScore: 0, role: 'ATS General Audit' },
          { id: '2', filename: 'resume_senior_dev.pdf', timestamp: new Date(Date.now() - 7200000).toISOString(), atsScore: 0, matchScore: 92, role: 'Job Compatibility Match' }
        ]
        setAuditHistory(defaultHistory)
        localStorage.setItem('talentflow_audit_history', JSON.stringify(defaultHistory))
      }
    } catch (e) {
      console.error("Failed to parse audit history", e)
    }
  }, [user])

  const handleDownload = async (resumeId: string) => {
    if (resumeId === 'local-draft-id' || resumeId === 'mock-draft-id') {
      alert("Opening print dialog to export draft...");
      const draft = localStorage.getItem('resume_draft')
      let parsed = { personal: { name: "Alex Rivera", email: "alex.rivera@example.com" }, skills: "React, Node, TypeScript, Python" };
      if (draft) {
        try {
          parsed = JSON.parse(draft);
        } catch(e){}
      }
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Resume Export</title><style>body { font-family: Arial; padding: 40px; color: #111; }</style></head>
            <body>
              <h1 style="text-align:center;">${parsed.personal.name}</h1>
              <p style="text-align:center;">${parsed.personal.email}</p>
              <hr/>
              <h3>Skills</h3><p>${parsed.skills}</p>
              <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/api/resumes/${resumeId}/export/pdf`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'resume.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch(err) {
      console.error("Download failed", err)
      alert("Download failed. API connection issue.")
    }
  }

  const radarData = [
    { subject: 'Technical', score: latestAts, fullMark: 100 },
    { subject: 'Experience', score: Math.round(latestAts * 0.9), fullMark: 100 },
    { subject: 'Formatting', score: 85, fullMark: 100 },
    { subject: 'Keywords', score: latestMatch, fullMark: 100 },
    { subject: 'Impact Verbs', score: 78, fullMark: 100 },
  ]

  return (
    <DashboardLayout>
      <div className="container-premium py-8 space-y-8">
        
        {/* Welcome Block (Strict Hierarchy) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-6"
        >
          <div className="text-left space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Overview Dashboard</h1>
            <p className="text-[#475569] text-sm font-medium">Review parsed metrics, semantic matching indexes, and audit history logs.</p>
          </div>
          <Link to="/builder" className="btn-premium-primary shadow-none">
            <Plus className="w-5 h-5 mr-1.5 text-white" /> New Resume Draft
          </Link>
        </motion.div>

        {/* 4 KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'ATS Match Score', value: `${latestAts}%`, sub: 'Target suitability index', color: 'text-[#FF7A18]', ringColor: 'stroke-[#FF7A18]', offset: 113 - (113 * latestAts) / 100 },
            { title: 'Resume Strength', value: 'Excellent', sub: 'Action verbs & metrics optimal', color: 'text-[#FF9F43]', ringColor: 'stroke-[#FF9F43]', offset: 10 },
            { title: 'Job Match Score', value: `${latestMatch}%`, sub: 'Semantic similarity index', color: 'text-[#FFB84D]', ringColor: 'stroke-[#FFB84D]', offset: 113 - (113 * latestMatch) / 100 },
            { title: 'Profile Score', value: '95%', sub: 'Personal, education, skills complete', color: 'text-[#22C55E]', ringColor: 'stroke-[#22C55E]', offset: 5 },
          ].map((metric, i) => {
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-premium p-5 flex items-center justify-between group"
              >
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-[#475569] block font-bold uppercase tracking-wider">{metric.title}</span>
                  <span className={`text-2xl font-black block ${metric.color}`}>{metric.value}</span>
                  <span className="text-[10px] text-[#475569] font-medium block">{metric.sub}</span>
                </div>

                {/* Progress Ring */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" className="stroke-[#E2E8F0]" strokeWidth="2.5" fill="transparent" />
                    <circle cx="24" cy="24" r="18" className={metric.ringColor} strokeWidth="3" fill="transparent" strokeDasharray={113} strokeDashoffset={metric.offset} strokeLinecap="round" />
                  </svg>
                  <Sparkles className={`w-3.5 h-3.5 absolute ${metric.color} opacity-40`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Radar Chart: Vector Suitability */}
          <motion.div 
            className="lg:col-span-5 card-premium p-6 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="border-b border-[#E2E8F0] pb-4 bg-[#FAFAF8] -mx-6 -mt-6 p-6 rounded-t-3xl text-left">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#F97316]" />
                ATS Vector Dimensions
              </h3>
            </div>
            
            <div className="w-full h-[260px] flex items-center justify-center pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" fontSize={8} />
                  <Radar name="ATS Fit" dataKey="score" stroke="#F97316" fill="#FF7A18" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart: Candidates Pipeline */}
          <motion.div 
            className="lg:col-span-7 card-premium p-6 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="border-b border-[#E2E8F0] pb-4 bg-[#FAFAF8] -mx-6 -mt-6 p-6 rounded-t-3xl text-left">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF9F43]" />
                Hiring Pipeline Metrics
              </h3>
            </div>
            
            <div className="h-[240px] w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPipelineData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(15,23,42,0.015)' }} 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '11px', color: '#0F172A' }}
                  />
                  <Bar dataKey="applicants" fill="rgba(15,23,42,0.05)" name="Total Screened" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="qualified" fill="#F97316" name="Passed Gate" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* lower details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Skill Heatmap */}
          <motion.div
            className="lg:col-span-7 card-premium p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-b border-[#E2E8F0] pb-4 bg-[#FAFAF8] -mx-6 -mt-6 p-6 rounded-t-3xl mb-4">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                Keyword Match Heatmap
              </h3>
            </div>
            
            <p className="text-xs text-[#475569] mb-4 font-medium">Relative weight and detection accuracy of key resume elements.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {heatmapSkills.map(skill => (
                <div 
                  key={skill.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    skill.level === 'High' 
                      ? 'bg-[#FF7A18]/10 border-[#FF7A18]/25 text-[#F97316]' 
                      : skill.level === 'Medium'
                        ? 'bg-[#FF9F43]/10 border-[#FF9F43]/20 text-[#FF7A18]'
                        : 'bg-[#FAFAF8] border-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  <span className="text-[10px] font-bold block">{skill.name}</span>
                  <span className="text-[9px] opacity-75 mt-0.5 block">{skill.score}% Match</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Saved Documents */}
          <motion.div
            className="lg:col-span-5 card-premium p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="border-b border-[#E2E8F0] pb-4 bg-[#FAFAF8] -mx-6 -mt-6 p-6 rounded-t-3xl mb-4">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F97316]" />
                Saved Resume Drafts
              </h3>
            </div>
            
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-[#475569]">No resumes built yet.</p>
                  <Link to="/builder" className="text-xs text-[#F97316] hover:underline mt-1 inline-block font-semibold">Start building now</Link>
                </div>
              ) : resumes.map((resume) => (
                <div key={resume._id} className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-8 h-8 text-[#F97316] shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{resume.data?.personal?.name || 'My Resume'}'s Resume</p>
                      <p className="text-[9px] text-[#475569] mt-0.5 font-medium">Created: {new Date(resume.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(resume._id)} 
                    className="p-2.5 bg-[#FF7A18]/10 hover:bg-[#FF7A18]/20 text-[#F97316] rounded-lg transition-colors border border-[#FF7A18]/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Audit History Logs */}
        <motion.div
          className="card-premium p-6 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="border-b border-[#E2E8F0] pb-4 bg-[#FAFAF8] -mx-6 -mt-6 p-6 rounded-t-3xl mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#FF9F43]" />
              Recent Scans & Audits Feed
            </h3>
            <span className="text-[10px] text-[#475569] font-bold">DYNAMIC AUDIT LOGS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#475569]">
                  <th className="py-3 font-semibold uppercase tracking-wider">File Name</th>
                  <th className="py-3 font-semibold uppercase tracking-wider">Audit Type</th>
                  <th className="py-3 font-semibold uppercase tracking-wider">Timestamp</th>
                  <th className="py-3 font-semibold uppercase tracking-wider text-right">Result Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#475569]">
                {auditHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-[#475569] font-medium">No recent audits found.</td>
                  </tr>
                ) : auditHistory.map(audit => (
                  <tr key={audit.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-3.5 font-bold flex items-center gap-2 text-[#0F172A]">
                      <FileText className="w-4 h-4 text-[#F97316]" />
                      {audit.filename}
                    </td>
                    <td className="py-3.5 font-mono text-[#475569] font-semibold">{audit.role}</td>
                    <td className="py-3.5 text-[#475569] font-semibold">{new Date(audit.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 text-right font-bold text-[#F97316]">
                      {audit.atsScore > 0 ? (
                        <span className="text-[#FF7A18]">ATS: {audit.atsScore}%</span>
                      ) : (
                        <span>Match: {audit.matchScore}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  )
}
