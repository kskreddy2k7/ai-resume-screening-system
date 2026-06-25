import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, ShieldAlert, Cpu, Award, Zap, Code, ChevronRight } from 'lucide-react';

export default function ShowcaseAnimation() {
  const [scene, setScene] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress (0 to 1) to scenes (1 to 7)
    if (latest < 0.15) {
      setScene(1);
    } else if (latest < 0.30) {
      setScene(2);
    } else if (latest < 0.45) {
      setScene(3);
    } else if (latest < 0.60) {
      setScene(4);
    } else if (latest < 0.75) {
      setScene(5);
    } else if (latest < 0.90) {
      setScene(6);
    } else {
      setScene(7);
    }
  });

  // Handle mouse movement for 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Count up value for match score animation (Scene 3)
  const [matchScore, setMatchScore] = useState(68);
  useEffect(() => {
    if (scene === 3) {
      setMatchScore(68);
      const scores = [68, 74, 82, 91];
      let i = 0;
      const interval = setInterval(() => {
        if (i < scores.length - 1) {
          i++;
          setMatchScore(scores[i]);
        } else {
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [scene]);

  // Parallax helper styling
  const getCardStyle = (depth: number, rotateOffset = 0) => {
    return {
      transform: `perspective(1000px) rotateX(${mousePos.y * 12}deg) rotateY(${mousePos.x * 12 + rotateOffset}deg) translateZ(${depth}px)`,
      transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#060606]"
    >
      {/* Background grid mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)]" />
      <div 
        className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" 
        style={{
          transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Floating glowing orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)`,
          transition: 'transform 0.6s ease-out',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0)`,
          transition: 'transform 0.6s ease-out',
        }}
      />

      {/* Main Container - Left & Right Columns wrapping around the center text */}
      <div className="container mx-auto px-4 h-full flex items-center justify-between relative max-w-7xl">
        
        {/* ================= LEFT SIDE ANIMATED PANEL ================= */}
        <div className="w-[30%] h-[70%] flex flex-col justify-center items-start relative z-10">
          <AnimatePresence mode="wait">
            
            {/* SCENE 1 & 2: Resume Scanning */}
            {(scene === 1 || scene === 2) && (
              <motion.div
                key="scene1-2"
                initial={{ opacity: 0, x: -80, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                exit={{ opacity: 0, x: -80, rotate: -12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4.5"
                style={getCardStyle(20, -4)}
              >
                {/* Laser scan line for Scene 2 */}
                {scene === 2 && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_#4ade80] z-20 pointer-events-none"
                  />
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-white/70">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="h-3 w-28 bg-white/10 rounded-md mb-1.5" />
                    <div className="h-2 w-20 bg-white/5 rounded-md" />
                  </div>
                </div>

                <div className="space-y-3 border-t border-white/5 pt-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="h-2.5 w-16 bg-white/10 rounded-md" />
                      <div className="h-2.5 w-10 bg-white/5 rounded-md" />
                    </div>
                    {/* Simulated skills highlight for Scene 2 */}
                    <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg text-[10px] text-muted-foreground/80 leading-relaxed font-mono relative">
                      <span className={scene === 2 ? "text-green-400 font-bold bg-green-500/10 px-1 rounded transition-colors" : ""}>React</span> Developer with experience in <span className={scene === 2 ? "text-green-400 font-bold bg-green-500/10 px-1 rounded transition-colors" : ""}>TypeScript</span> and microservices.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="h-2.5 w-16 bg-white/10 rounded-md" />
                      <div className="h-2.5 w-10 bg-white/5 rounded-md" />
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-md" />
                    <div className="h-2.5 w-5/6 bg-white/5 rounded-md" />
                  </div>
                </div>

                {/* Score Dial Reveal in Scene 2 */}
                {scene === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -right-3 -bottom-3 bg-[#111] border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                  >
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">ATS Score</span>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/5" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-amber-500" strokeDasharray="45, 100" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-xs font-black text-white">45</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SCENE 3: Job Description matching (left side stays placeholder resume) */}
            {scene === 3 && (
              <motion.div
                key="scene3-resume"
                initial={{ opacity: 0, x: -80, rotate: -6 }}
                animate={{ opacity: 0.8, x: 0, rotate: -2 }}
                exit={{ opacity: 0, x: -80, rotate: -10 }}
                className="w-76 bg-white/[0.01] backdrop-blur-lg border border-white/5 shadow-xl rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4"
                style={getCardStyle(10)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.02] flex items-center justify-center text-white/50">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-2.5 w-24 bg-white/10 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-px bg-white/5 w-full mt-2" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-2/3 bg-white/5 rounded" />
                </div>
              </motion.div>
            )}

            {/* SCENE 4: Missing Skills highlight */}
            {scene === 4 && (
              <motion.div
                key="scene4"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.6 }}
                className="w-80 bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 relative flex flex-col gap-4"
                style={getCardStyle(20)}
              >
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Missing Keywords Detected</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 my-1">
                  {["Docker", "AWS", "TensorFlow", "Kubernetes"].map((skill, index) => (
                    <motion.span 
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                      className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs leading-relaxed text-muted-foreground flex gap-2">
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p>AI suggests adding <span className="text-white font-semibold">Docker</span> and <span className="text-white font-semibold">AWS</span> deployments to your experience bullet points.</p>
                </div>
              </motion.div>
            )}

            {/* SCENE 5: Morphing / Rewriting bullet points */}
            {scene === 5 && (
              <motion.div
                key="scene5"
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.8 }}
                className="w-84 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-5 relative flex flex-col gap-4"
                style={getCardStyle(30)}
              >
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-wider">AI Optimizer</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">XYZ Formula</span>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Before (Weak)</span>
                    <div className="p-3 bg-red-500/[0.02] border border-red-500/10 rounded-xl text-xs text-muted-foreground leading-relaxed">
                      "I worked on microservices and deployment tasks for our API."
                    </div>
                  </div>

                  <div className="flex justify-center my-0.5">
                    <motion.div 
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-muted-foreground"
                    >
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">After (Recruiter-Ready)</span>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="p-3 bg-green-500/[0.02] border border-green-500/20 rounded-xl text-xs text-white leading-relaxed font-medium shadow-md shadow-green-500/5"
                    >
                      "Spearheaded microservices migration using <span className="text-green-400 font-semibold">Docker</span>, reducing deployment latency by <span className="text-green-400 font-semibold">35%</span> and cloud costs by $20K."
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 6 & 7: Reveal Template */}
            {(scene === 6 || scene === 7) && (
              <motion.div
                key="scene6"
                initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9, rotate: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 bg-white border border-gray-200 shadow-2xl rounded-xl p-5 relative overflow-hidden flex flex-col gap-4 text-black text-left"
                style={getCardStyle(25, -2)}
              >
                {/* Visual Accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600" />
                
                <div className="text-center pt-2">
                  <h3 className="text-base font-extrabold tracking-wide uppercase">Alexander Wright</h3>
                  <div className="flex justify-center gap-1.5 text-[9px] text-gray-500 font-semibold mt-1">
                    <span>alexander@example.com</span>
                    <span>|</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full" />

                <div className="space-y-3 text-[10px]">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-blue-600 mb-1">Experience</h4>
                    <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                      <span>TechFlow Solutions</span>
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium italic mb-1.5">
                      <span>Senior Product Manager</span>
                      <span>Jan 2021 - Present</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      • Spearheaded the launch of a new AI analytics dashboard, increasing user engagement by 40%.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-blue-600 mb-1">Education</h4>
                    <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                      <span>UC Berkeley</span>
                      <span>B.S. Computer Science</span>
                    </div>
                  </div>
                </div>

                {/* Score Dial Upgrade */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -right-2 -bottom-2 bg-green-500 text-white p-2.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-green-400"
                >
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">ATS Score: 95</span>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* CENTER GAP FOR HEADLINE (Centered text stays 100% readable) */}
        <div className="w-[35%] h-full pointer-events-none" />

        {/* ================= RIGHT SIDE ANIMATED PANEL ================= */}
        <div className="w-[30%] h-[70%] flex flex-col justify-center items-end relative z-10">
          <AnimatePresence mode="wait">
            
            {/* SCENE 1: Background Decoration */}
            {scene === 1 && (
              <motion.div
                key="scene1-decor"
                initial={{ opacity: 0, x: 80, rotate: 8 }}
                animate={{ opacity: 0.4, x: 0, rotate: 4 }}
                exit={{ opacity: 0, x: 80, rotate: 12 }}
                className="w-76 h-64 bg-white/[0.01] border border-white/5 rounded-2xl"
                style={getCardStyle(5)}
              />
            )}

            {/* SCENE 2: Scanning (Laser sweeps, right side is inactive/decor) */}
            {scene === 2 && (
              <motion.div
                key="scene2-decor"
                initial={{ opacity: 0, x: 80, rotate: 6 }}
                animate={{ opacity: 0.4, x: 0, rotate: 3 }}
                exit={{ opacity: 0, x: 80, rotate: 10 }}
                className="w-76 h-64 bg-white/[0.01] border border-white/5 rounded-2xl"
                style={getCardStyle(5)}
              />
            )}

            {/* SCENE 3: Job Description slides in, matching score animates */}
            {scene === 3 && (
              <motion.div
                key="scene3"
                initial={{ opacity: 0, x: 80, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 3 }}
                exit={{ opacity: 0, x: 80, rotate: 10 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 flex flex-col gap-4"
                style={getCardStyle(20, 3)}
              >
                <div className="flex items-center gap-2.5 text-blue-400 border-b border-white/5 pb-3">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Target Job Match</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/80 font-semibold">Software Engineer</span>
                    <span className="text-muted-foreground">OpenAI</span>
                  </div>
                  <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] text-muted-foreground/80 leading-relaxed font-mono">
                    Must have experience with React, Docker deployments, AWS pipelines, and scalable APIs.
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                  <span className="text-xs text-muted-foreground font-semibold">Matching Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-display font-black text-white">{matchScore}%</span>
                    <motion.div 
                      key={matchScore} 
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-2 h-2 rounded-full bg-blue-500" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 4: Suggestions Card */}
            {scene === 4 && (
              <motion.div
                key="scene4-suggest"
                initial={{ opacity: 0, x: 80, rotate: 4 }}
                animate={{ opacity: 1, x: 0, rotate: 2 }}
                exit={{ opacity: 0, x: 80, rotate: 8 }}
                className="w-80 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 flex flex-col gap-4"
                style={getCardStyle(15)}
              >
                <div className="flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Improvement Roadmap</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5">1</div>
                    <p>Change "worked on" verbs to strong action verbs (e.g. <span className="text-white font-medium">Spearheaded</span>, <span className="text-white font-medium">Engineered</span>).</p>
                  </div>
                  
                  <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5">2</div>
                    <p>Mention <span className="text-white font-medium">Docker</span> container configurations and <span className="text-white font-medium">AWS</span> deployments to matching roles.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 5: Transformation Score update (right side is just decor) */}
            {scene === 5 && (
              <motion.div
                key="scene5-decor"
                initial={{ opacity: 0, x: 80, rotate: 6 }}
                animate={{ opacity: 0.5, x: 0, rotate: 3 }}
                exit={{ opacity: 0, x: 80, rotate: 10 }}
                className="w-76 h-64 bg-white/[0.01] border border-white/5 rounded-2xl"
                style={getCardStyle(5)}
              />
            )}

            {/* SCENE 6: Recruiter verification checklist */}
            {scene === 6 && (
              <motion.div
                key="scene6-check"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                className="w-80 bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 flex flex-col gap-4"
                style={getCardStyle(15)}
              >
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recruiter Assessment</div>
                
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-xs text-white/90">Contact info matches ATS criteria</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-xs text-white/90">Quantifiable metrics presented (3 XYZs)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-xs text-white/90">Structure perfectly single-page optimized</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 7: Career Dashboard / Complete Metrics Showcase */}
            {scene === 7 && (
              <motion.div
                key="scene7"
                initial={{ opacity: 0, x: 80, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 3 }}
                exit={{ opacity: 0, x: 80, rotate: 10 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-84 bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5 flex flex-col gap-4"
                style={getCardStyle(30, 3)}
              >
                <div className="flex items-center gap-2.5 text-green-400 border-b border-white/5 pb-3">
                  <Code className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Career Readiness Dashboard</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold mb-1">
                      <span>ATS SCORE</span>
                      <span className="text-white">95%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 1 }} className="h-full bg-green-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold mb-1">
                      <span>JOB MATCH</span>
                      <span className="text-white">91%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "91%" }} transition={{ duration: 1 }} className="h-full bg-blue-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold mb-1">
                      <span>RESUME HEALTH</span>
                      <span className="text-white">EXCELLENT</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Visual Timeline Indicators at the bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div 
            key={num}
            className={`w-2 h-2 rounded-full transition-all ${
              scene === num 
                ? 'bg-white scale-125 shadow-[0_0_8px_#ffffff]' 
                : 'bg-white/20'
            }`}
            title={`Scene ${num}`}
          />
        ))}
      </div>
    </div>
  );
}
