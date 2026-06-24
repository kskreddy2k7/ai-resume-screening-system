import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Edit3 } from 'lucide-react';

export default function ExistingResumeCheck() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FileText className="w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Do you already have a resume?</h1>
          <p className="text-xl text-muted-foreground">
            We can import your existing resume to save you time, or you can start from scratch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/import')}
            className="flex flex-col items-center justify-center p-8 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Yes, I do</h2>
            <p className="text-muted-foreground text-center">
              Import from PDF or Word
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/builder')}
            className="flex flex-col items-center justify-center p-8 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
              <Edit3 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No, start fresh</h2>
            <p className="text-muted-foreground text-center">
              Create a new resume step-by-step
            </p>
          </motion.button>
        </div>
        
        <div className="mt-12 text-center">
          <button onClick={() => navigate('/templates')} className="text-muted-foreground hover:text-foreground underline">
            Back to Templates
          </button>
        </div>
      </div>
    </div>
  );
}
