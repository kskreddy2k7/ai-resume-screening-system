import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

import HeroSection from '../components/landing/HeroSection';
import StorySection from '../components/landing/StorySection';
import DemoSection from '../components/landing/DemoSection';
import EditorPreviewSection from '../components/landing/EditorPreviewSection';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background text-foreground min-h-screen relative overflow-hidden bg-noise"
    >
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white select-none">
        <div className="font-display font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          TALENTFLOW <span className="opacity-50">X</span>
        </div>
        <div className="flex gap-8 items-center text-sm font-medium tracking-wide">
          <button onClick={() => scrollToSection('philosophy')} className="hover:opacity-70 transition-opacity cursor-pointer">Philosophy</button>
          <button onClick={() => scrollToSection('features')} className="hover:opacity-70 transition-opacity cursor-pointer">Features</button>
          <button 
            onClick={() => navigate('/templates')}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Enter Workspace
          </button>
        </div>
      </nav>

      {/* Landing Page Content */}
      <HeroSection />
      <StorySection />
      <DemoSection />
      <EditorPreviewSection />
    </motion.div>
  );
}
