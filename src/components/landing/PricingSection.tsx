import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingSection() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for drafting your initial resume.',
      features: [
        '1 ATS-compliant template',
        'Standard ATS Readiness Scan',
        'Offline AI Prompts Copying',
        'Download in DOCX Format',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      description: 'Best for active job hunters applying to top MNCs.',
      features: [
        'All Premium Resume Templates',
        'Full ATS Score Diagnostic & Alerts',
        'Advanced Copilot AI Prompts',
        'Download in Premium PDF & DOCX',
        'Priority Local File Parsing',
      ],
      cta: 'Go Pro',
      popular: true,
    },
    {
      name: 'Elite',
      price: '$24',
      period: '/month',
      description: 'For candidates aiming for leadership and executive roles.',
      features: [
        'Everything in Pro plan',
        '1-on-1 AI Resume Consultation',
        'Custom Sections Builder',
        'Exclusive Executive Suite Layout',
        'Unlimited Job Matching Scans',
      ],
      cta: 'Upgrade to Elite',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 relative bg-[#090909] border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-4 text-white tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Choose the plan that fits your career goals. Land your dream job at top-tier companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 relative bg-[#0e0e0e] ${
                tier.popular 
                  ? 'border-primary shadow-2xl shadow-primary/10 md:-translate-y-4 scale-[1.03]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md border border-white/10 select-none">
                  <Sparkles className="w-3 h-3 fill-black" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed min-h-[32px]">{tier.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-display font-black text-white">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground text-sm ml-1">{tier.period}</span>}
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/templates')}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${
                  tier.popular
                    ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5'
                    : 'bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06]'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
