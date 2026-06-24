import { Type, Image, Layout, Columns, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toolbar() {
  const { selectedBlockId } = useEditorStore();

  return (
    <>
      {/* Global Toolbar (Left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-2 z-50 shadow-2xl">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group relative">
          <Type className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Text</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group relative">
          <Layout className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Section</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group relative">
          <Columns className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Columns</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group relative">
          <Image className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Media</span>
        </button>
      </div>

      {/* Contextual Toolbar (Top) - Appears when a block is selected */}
      <AnimatePresence>
        {selectedBlockId && (
          <motion.div 
            initial={{ y: -50, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: -50, opacity: 0, x: '-50%' }}
            className="absolute top-6 left-1/2 flex items-center gap-1 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg p-1.5 z-50 shadow-2xl"
          >
            <div className="flex items-center px-2 border-r border-border/50">
              <span className="text-xs font-medium mr-2">Inter</span>
              <span className="text-xs text-muted-foreground">14</span>
            </div>
            <div className="flex items-center px-1 border-r border-border/50">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary"><Bold className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary"><Italic className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center px-1">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary"><AlignLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary"><AlignCenter className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary"><AlignRight className="w-4 h-4" /></button>
            </div>
            <div className="ml-2 w-6 h-6 rounded-full bg-black border border-border/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
