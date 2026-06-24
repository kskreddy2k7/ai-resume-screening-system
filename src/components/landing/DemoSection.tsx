import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DemoSection() {
  return (
    <section id="features" className="py-32 relative bg-secondary/30 border-t border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Interactive Intelligence</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Drag in your existing resume and watch the engine dissect it line by line.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center bg-background p-8 rounded-3xl border border-border/50 shadow-2xl">
          {/* Mock Drag & Drop Zone */}
          <div className="w-full lg:w-1/2 h-96 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center bg-card relative group cursor-pointer hover:border-primary/50 transition-colors">
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
            <p className="text-lg font-medium">Drop your PDF here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
            
            {/* Mock scanning animation overlay */}
            <motion.div 
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-primary/50 shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10"
            />
          </div>

          {/* Mock Real-time Analysis */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500 font-bold">92</span>
                </div>
                <div>
                  <h4 className="font-semibold">ATS Compatibility Score</h4>
                  <p className="text-sm text-muted-foreground">Looking good, but can be improved.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Formatting verified', icon: CheckCircle2, color: 'text-green-500' },
                { label: 'Action verbs detected', icon: CheckCircle2, color: 'text-green-500' },
                { label: 'Missing key metrics in Experience', icon: AlertCircle, color: 'text-yellow-500' },
                { label: 'Weak summary wording', icon: AlertCircle, color: 'text-red-500' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
