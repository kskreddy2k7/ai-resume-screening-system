import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

export default function CopilotSection() {
  return (
    <section className="py-32 relative bg-secondary/10 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Meet Your AI Copilot</h2>
            <p className="text-xl text-muted-foreground font-light">
              Chat naturally to generate cover letters, optimize keywords, or rewrite your experience to match a specific job description.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Improve my summary", "Match this job", "Make it sound more executive"].map((prompt, i) => (
                <div key={i} className="px-4 py-2 rounded-full border border-border/50 text-sm hover:bg-secondary transition-colors cursor-pointer">
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-card rounded-3xl border border-border/50 shadow-2xl p-6 h-[400px] flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold">Copilot</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="self-end bg-primary/10 text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]"
                >
                  <p className="text-sm">Can you make my last role sound more impactful?</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="self-start bg-secondary/50 px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%]"
                >
                  <p className="text-sm text-muted-foreground mb-2">I rewrote your Senior Engineer experience to focus on business impact and leadership. Here's a suggestion:</p>
                  <div className="bg-background border border-border/50 rounded-lg p-3 text-xs text-foreground/80 font-mono">
                    "Spearheaded the migration to a microservices architecture, reducing deployment times by 40% and saving $120K annually in cloud infrastructure costs."
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 relative">
                <input 
                  type="text" 
                  placeholder="Ask Copilot..." 
                  className="w-full bg-secondary/30 border border-border/50 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  disabled
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
