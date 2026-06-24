import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import ShowcaseAnimation from './ShowcaseAnimation';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const navigate = useNavigate();

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#060606] select-none">
      {/* Animated Showcase Scene (occupies background / z-0) */}
      <ShowcaseAnimation />

      {/* Subtle radial gradient mask behind text (z-5) to maintain perfect text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,6,6,0.85)_0%,rgba(6,6,6,0.45)_50%,rgba(6,6,6,0.85)_100%)] z-10 pointer-events-none" />

      {/* Foreground Hero Content (z-20) */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-balance text-white select-none">
            THE CAREER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
              OPERATING SYSTEM
            </span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed select-none"
        >
          Not just a resume builder. An intelligent workspace that scans, optimizes, and matches your professional identity for elite tech roles.
        </motion.p>

        <motion.div 
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <button 
            onClick={() => navigate('/templates')}
            className="px-8 py-4 bg-white text-black hover:bg-white/95 rounded-full font-bold text-sm transition-all shadow-lg shadow-white/5 cursor-pointer"
          >
            Start Building Free
          </button>
          
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="px-8 py-4 border border-white/10 hover:border-white/20 text-white rounded-full font-bold text-sm bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" /> Watch Demo
          </button>
        </motion.div>
      </motion.div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl aspect-video bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* HTML5 Video Player */}
              <video 
                src="/demo.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
