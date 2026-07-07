import { MessageSquareWarning, BrainCircuit, ShieldAlert, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: MessageSquareWarning,
    title: '1. Analyze',
    description: 'Suspicious text, screenshot, or audio enters KAVACH.',
    color: 'text-blue-400',
  },
  {
    icon: BrainCircuit,
    title: '2. Detect',
    description: 'AI evaluates scam patterns, behavioral signals, and suspicious entities.',
    color: 'text-purple-400',
  },
  {
    icon: ShieldAlert,
    title: '3. Intervene',
    description: 'The citizen receives an understandable warning and immediate recommended actions.',
    color: 'text-status-warning',
  },
  {
    icon: Network,
    title: '4. Connect',
    description: 'Reported evidence is linked with historical cases to reveal wider fraud networks.',
    color: 'text-brand-cyan',
  }
];

export function HowKavachWorks() {
  return (
    <section className="py-24 bg-surface-elevated border-b border-surface-raised">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">How KAVACH Works</h2>
          <p className="text-text-secondary">
            A seamless pipeline from initial suspicion to network-wide intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-surface-raised z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-24 h-24 rounded-full bg-surface-base border border-surface-raised flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-105 ${step.color}`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
