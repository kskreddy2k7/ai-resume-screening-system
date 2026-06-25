import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function DemoSection() {
  return (
    <section id="features" className="py-32 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Interactive Intelligence</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Watch the engine dissect a resume line by line — in real time.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center bg-[#0a0a0a]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
          {/* Demo Video */}
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-border/50 bg-black shadow-lg relative group">
            <video
              src="/demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover rounded-2xl"
            />
            {/* Play icon overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
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
