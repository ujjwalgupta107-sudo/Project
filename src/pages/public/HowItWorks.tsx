import { FileText, Search, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: '1. Citizen Receives Suspicious Contact',
      desc: 'A citizen receives a suspicious WhatsApp message, SMS, or phone call claiming to be from a bank, police, or customs.'
    },
    {
      icon: Search,
      title: '2. Submission to KAVACH Shield',
      desc: 'Instead of engaging with the scammer, the citizen uploads the text or audio to the KAVACH Shield portal.'
    },
    {
      icon: ShieldAlert,
      title: '3. Real-Time AI Analysis',
      desc: 'Our AI instantly analyzes the content, detects social engineering tactics, and extracts entities (phone numbers, UPI IDs).'
    },
    {
      icon: CheckCircle,
      title: '4. Immediate Intervention & Reporting',
      desc: 'The citizen is warned of the critical risk. Simultaneously, the structured intelligence is routed to the Investigator Command Centre for network correlation.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          From the moment of initial contact to the disruption of the fraud network.
        </p>
      </div>

      <div className="space-y-12 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-surface-raised -translate-x-1/2 z-0"></div>

        {steps.map((step, index) => (
          <div key={index} className={`relative z-10 flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 w-full">
              <Card className="bg-surface-elevated border-surface-raised hover:border-brand-cyan/50 transition-colors">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            </div>
            <div className="shrink-0 w-16 h-16 rounded-full bg-surface-base border-4 border-brand-cyan flex items-center justify-center text-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <step.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 hidden md:block"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
