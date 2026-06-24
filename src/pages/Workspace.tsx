import { motion } from 'framer-motion';
import SidebarEditor from '../components/workspace/SidebarEditor';
import AIAssistant from '../components/workspace/AIAssistant';
import A4Canvas from '../components/editor/A4Canvas';
import { useResumeStore } from '../store/resumeStore';
import { exportResumeToPdf } from '../lib/export';
import { Undo, Redo, Download, UploadCloud, LayoutTemplate, Palette, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { extractTextFromFile } from '../lib/extractor';
import { parseResumeText } from '../lib/ai';

export default function Workspace() {
  const undo = useResumeStore(state => state.undo);
  const redo = useResumeStore(state => state.redo);
  const zoom = useResumeStore(state => state.zoom);
  const setZoom = useResumeStore(state => state.setZoom);
  const loadResume = useResumeStore(state => state.loadResume);
  const templateId = useResumeStore(state => state.templateId);
  const setTemplateId = useResumeStore(state => state.setTemplateId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        throw new Error("No text could be extracted.");
      }
      const extractedData = await parseResumeText(text);
      loadResume(extractedData);
    } catch (error: any) {
      console.error(error);
      alert(`Failed to extract resume: ${error.message || 'Unknown error'}`);
    }
  };

  const activeColor = useResumeStore((state: any) => state.data.layout?.primaryColor || '#0a0a0a');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-screen overflow-hidden bg-[#060606] text-foreground flex flex-col bg-noise"
    >
      {/* Top Toolbar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#0a0a0a]/90 backdrop-blur-md z-10 shrink-0 select-none">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-lg font-display font-extrabold text-base tracking-tight transition-transform hover:scale-102">
              TF
            </div>
            <span className="text-sm font-bold text-white tracking-wider font-display hidden sm:inline-block">TALENTFLOW</span>
          </div>

          <div className="h-6 w-px bg-white/5 hidden md:block" />

          <div className="hidden md:flex items-center gap-3">
            {/* Template Selector */}
            <div className="relative group">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="appearance-none bg-white/[0.02] border border-white/5 text-xs text-white/90 rounded-xl pl-9 pr-9 py-2 focus:outline-none focus:border-white/20 cursor-pointer hover:bg-white/[0.05] transition-all"
              >
                <option value="professional" className="bg-[#111] text-white">Corporate Standard</option>
                <option value="modern" className="bg-[#111] text-white">Modern Tech</option>
                <option value="executive" className="bg-[#111] text-white">Executive Suite</option>
                <option value="minimal" className="bg-[#111] text-white">Clean Minimal</option>
              </select>
              <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Color Swatch Selector */}
            <div className="relative flex items-center bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 hover:bg-white/[0.05] transition-all cursor-pointer">
              <Palette className="w-3.5 h-3.5 text-muted-foreground mr-2" />
              <span className="text-xs text-white/80 mr-2.5">Theme Color</span>
              <div
                className="w-4 h-4 rounded-full border border-white/10 relative overflow-hidden shrink-0 shadow-sm"
                style={{ backgroundColor: activeColor }}
              >
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => useResumeStore.getState().updateData((d: any) => { if (!d.layout) d.layout = {}; d.layout.primaryColor = e.target.value; })}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          {/* Undo/Redo */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5">
            <button
              onClick={undo}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-white transition-colors"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-white transition-colors"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-2 bg-white/[0.02] rounded-xl p-1 border border-white/5 text-[10px] font-bold text-muted-foreground/80">
            <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors">-</button>
            <span className="w-12 text-center text-xs tracking-wider text-white/70">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors">+</button>
          </div>

          <div className="h-6 w-px bg-white/5 hidden md:block" />

          {/* Import / File selector */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden md:flex px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.02] hover:bg-white/[0.05] text-muted-foreground hover:text-white border border-white/5 items-center gap-1.5 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Import
          </button>

          {/* Download actions */}
          <button
            onClick={() => import('../lib/export').then(m => m.exportResumeToDocx())}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/90 hover:bg-white/[0.08] flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> DOCX
          </button>
          <button
            onClick={() => exportResumeToPdf()}
            className="text-xs font-bold px-5 py-2 rounded-xl bg-white text-black hover:bg-white/95 flex items-center gap-1.5 transition-all shadow-lg shadow-white/5 border border-white/10"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Form Editor */}
        <SidebarEditor />

        {/* Center Panel: Live Preview */}
        <A4Canvas />

        {/* Right Panel: Intelligence */}
        <AIAssistant />
      </div>
    </motion.div>
  );
}
