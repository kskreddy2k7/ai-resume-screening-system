import { motion } from 'framer-motion';
import { useResumeStore } from '../../store/resumeStore';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

export default function A4Canvas() {
  const zoom = useResumeStore(state => state.zoom);
  const templateId = useResumeStore(state => state.templateId);

  const renderTemplate = () => {
    switch (templateId) {
      case 'professional': return <ProfessionalTemplate />;
      case 'modern': return <ModernTemplate />;
      case 'executive': return <ExecutiveTemplate />;
      case 'minimal': return <MinimalTemplate />;
      case 'ai-engineer': return <ModernTemplate />; // Fallback
      case 'creative': return <MinimalTemplate />; // Fallback
      case 'student': return <ProfessionalTemplate />; // Fallback
      default: return <ProfessionalTemplate />;
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-auto bg-[#0d0d0d] p-10 flex justify-center custom-scrollbar relative">
      <motion.div
        id="resume-export-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] origin-top select-text"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          transform: `scale(${zoom})`,
          marginBottom: `${(zoom - 1) * 297}mm`,
          marginRight: `${(zoom - 1) * 210}mm` // Correct horizontal scroll offset
        }}
      >
        <div id="resume-export-content" className="bg-white overflow-hidden w-full h-full" style={{ width: '210mm', minHeight: '297mm' }}>
          {renderTemplate()}
        </div>
      </motion.div>
    </div>
  );
}
