import { LayoutTemplate, Move, Type } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditorPreviewSection() {
  return (
    <section className="py-32 relative bg-transparent">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Canva-Style Freedom</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Break free from rigid templates. An infinite canvas to design your career story.
          </p>
        </div>

        {/* Mock Editor Canvas UI */}
        <div className="w-full h-[600px] bg-[#0a0a0a]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl flex overflow-hidden">
          {/* Mock Toolbar */}
          <div className="w-16 border-r border-border/50 bg-secondary/20 flex flex-col items-center py-4 gap-6">
            <LayoutTemplate className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Type className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Move className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>

          {/* Mock Canvas Area */}
          <div className="flex-1 bg-noise bg-[#0a0a0a] relative p-12 overflow-hidden flex justify-center">
            {/* Mock Document Page */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-[400px] h-full bg-white shadow-2xl rounded-sm p-8 relative group"
            >
              {/* Mock Draggable Block */}
              <div className="absolute top-8 left-8 right-8 h-20 border-2 border-transparent group-hover:border-primary/50 group-hover:bg-primary/5 transition-all cursor-move border-dashed">
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
                <div className="w-1/2 h-4 bg-gray-100 rounded" />
                
                {/* Mock Resize Handles */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
