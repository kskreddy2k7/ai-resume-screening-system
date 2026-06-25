import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResumeStore } from '../../store/resumeStore';

const TEMPLATES = [
  { id: 'professional', name: 'Corporate Standard', category: 'Corporate', atsScore: '99%', theme: '#000' },
  { id: 'modern', name: 'Modern Tech', category: 'Software Engineer', atsScore: '95%', theme: '#2563eb' },
  { id: 'executive', name: 'Executive Suite', category: 'Executive', atsScore: '98%', theme: '#0f172a' },
  { id: 'minimal', name: 'Clean Minimal', category: 'Professional', atsScore: '96%', theme: '#333' },
  { id: 'ai-engineer', name: 'Data & AI', category: 'AI Engineer', atsScore: '97%', theme: '#059669' },
  { id: 'creative', name: 'Design Portfolio', category: 'Creative', atsScore: '85%', theme: '#db2777' },
  { id: 'student', name: 'Graduation', category: 'Student', atsScore: '90%', theme: '#4f46e5' }
];

const CATEGORIES = ['All Templates', 'Corporate', 'Professional', 'Software Engineer', 'AI Engineer', 'Student', 'Executive', 'Minimal', 'Creative'];

const ResumeMockup = ({ id, theme }: { id: string, theme: string }) => {
  if (id === 'modern') {
    return (
      <div className="w-full h-full bg-white p-4 flex flex-col gap-2">
        <div className="h-8 w-full rounded" style={{ backgroundColor: theme, opacity: 0.8 }} />
        <div className="w-3/4 h-2 bg-gray-200 mt-2" />
        <div className="w-full h-1 bg-gray-100" />
        <div className="w-1/2 h-2 bg-gray-200 mt-2" />
        <div className="w-full h-1 bg-gray-100" />
        <div className="w-full h-1 bg-gray-100" />
        <div className="w-1/2 h-2 bg-gray-200 mt-2" />
        <div className="w-full h-1 bg-gray-100" />
        <div className="w-full h-1 bg-gray-100" />
      </div>
    );
  }
  if (id === 'creative') {
    return (
      <div className="w-full h-full bg-white flex">
        <div className="w-1/3 h-full p-2 flex flex-col gap-2" style={{ backgroundColor: theme, opacity: 0.1 }}>
          <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: theme, opacity: 0.5 }} />
          <div className="w-full h-1 bg-black/10 mt-2" />
          <div className="w-full h-1 bg-black/10" />
        </div>
        <div className="w-2/3 h-full p-3 flex flex-col gap-2">
          <div className="w-3/4 h-3 bg-gray-200" />
          <div className="w-full h-1.5 bg-gray-100 mt-2" />
          <div className="w-full h-1.5 bg-gray-100" />
          <div className="w-full h-1.5 bg-gray-100 mt-2" />
          <div className="w-full h-1.5 bg-gray-100" />
        </div>
      </div>
    );
  }
  if (id === 'executive') {
    return (
      <div className="w-full h-full bg-white p-4 flex flex-col gap-2 items-center text-center">
        <div className="w-1/2 h-3 bg-gray-800" />
        <div className="w-3/4 h-1 bg-gray-300" />
        <div className="w-full h-[1px] bg-gray-400 mt-2" />
        <div className="w-1/3 h-2 bg-gray-800 mt-2" />
        <div className="w-full h-1 bg-gray-200" />
        <div className="w-full h-1 bg-gray-200" />
        <div className="w-1/3 h-2 bg-gray-800 mt-2" />
        <div className="w-full h-1 bg-gray-200" />
        <div className="w-full h-1 bg-gray-200" />
      </div>
    );
  }
  if (id === 'ai-engineer') {
    return (
      <div className="w-full h-full bg-white p-3 flex flex-col gap-2 border-t-4" style={{ borderColor: theme }}>
        <div className="w-1/2 h-3 bg-gray-800" />
        <div className="flex gap-2 mt-2">
          <div className="w-2/3 flex flex-col gap-1.5">
            <div className="w-1/3 h-2" style={{ backgroundColor: theme, opacity: 0.8 }} />
            <div className="w-full h-1 bg-gray-200" />
            <div className="w-full h-1 bg-gray-200" />
            <div className="w-1/3 h-2 mt-2" style={{ backgroundColor: theme, opacity: 0.8 }} />
            <div className="w-full h-1 bg-gray-200" />
          </div>
          <div className="w-1/3 flex flex-col gap-1.5 border-l pl-2">
            <div className="w-1/2 h-2 bg-gray-400" />
            <div className="w-full h-1 bg-gray-200" />
            <div className="w-full h-1 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }
  // Default Professional / Minimal
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-1.5">
      <div className="w-1/2 h-3 bg-gray-800 mb-1" />
      <div className="w-1/4 h-2 bg-gray-800 mb-2" style={{ color: theme }} />
      <div className="w-full h-1 bg-gray-200" />
      <div className="w-full h-1 bg-gray-200" />
      <div className="w-1/3 h-2 bg-gray-800 mt-2" />
      <div className="w-full h-1 bg-gray-200" />
      <div className="w-full h-1 bg-gray-200" />
      <div className="w-1/3 h-2 bg-gray-800 mt-2" />
      <div className="w-full h-1 bg-gray-200" />
    </div>
  );
};

export default function TemplateGallery() {
  const navigate = useNavigate();
  const setTemplateId = useResumeStore(state => state.setTemplateId);

  const handleSelect = (id: string) => {
    setTemplateId(id);
    navigate('/start');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Choose Your Resume Template</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a professionally designed template to get started. All our templates are ATS-friendly and highly customizable.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <h3 className="font-semibold text-lg mb-4 text-white hidden lg:block">Categories</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar whitespace-nowrap">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-white transition-colors bg-white/[0.02] border border-white/5 lg:bg-transparent lg:border-none inline-block lg:w-full lg:text-left"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((template) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={template.id}
                className="group relative bg-[#111] border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-[1/1.4] relative bg-muted overflow-hidden p-6 flex items-center justify-center bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
                    <button
                      onClick={() => handleSelect(template.id)}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                      Use Template
                    </button>
                  </div>
                  {/* CSS UI Mockup */}
                  <div className="w-[85%] h-[95%] shadow-md opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm overflow-hidden">
                    <ResumeMockup id={template.id} theme={template.theme} />
                  </div>
                </div>
                <div className="p-5 bg-[#111]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{template.name}</h3>
                    <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/20 uppercase tracking-wider">
                      ATS: {template.atsScore}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{template.category}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Theme:</span>
                    <div className="w-4 h-4 rounded-full shadow-sm border border-white/10" style={{ backgroundColor: template.theme }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
