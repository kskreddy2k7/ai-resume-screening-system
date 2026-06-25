import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  
  return (
    <section id="philosophy" ref={sectionRef} className="py-32 relative bg-transparent">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tight text-balance"
            >
              Why do 90% of resumes fail ATS?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground font-light leading-relaxed"
            >
              Because traditional builders format for humans, not machines. 
              Our engine understands the hidden metadata recruiters and algorithms look for.
            </motion.p>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-square rounded-full border border-border/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              <motion.div 
                style={{ rotate: scrollYProgress }}
                className="text-center"
              >
                <div className="text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                  90%
                </div>
                <div className="text-sm uppercase tracking-widest mt-2 text-muted-foreground">Failure Rate</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        style={{ x }}
        className="whitespace-nowrap mt-32 text-[15vw] font-display font-black text-border/20 leading-none select-none"
      >
        MACHINE READABLE HUMAN DESIGNED
      </motion.div>
    </section>
  );
}
