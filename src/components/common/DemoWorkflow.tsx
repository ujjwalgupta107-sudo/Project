import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, X, ChevronRight, Check } from 'lucide-react';

const demoSteps = [
  { path: '/', title: 'Welcome to Kavach AI', content: 'This is the public landing page. Citizens can learn about fraud and access the protection shield from here.', target: '/shield' },
  { path: '/shield', title: 'Citizen Shield', content: 'Citizens can input suspicious messages or audio here. The AI will analyze it in real-time. Try clicking "Use sample message" and then "Analyze".', target: '/shield/result/mock-digital-arrest-1' },
  { path: '/shield/result/mock-digital-arrest-1', title: 'Analysis Result', content: 'The AI extracts entities (phone, UPI) and flags the risk. This report is then securely routed to the Investigator Command Centre.', target: '/intelligence' },
  { path: '/intelligence', title: 'Command Centre Dashboard', content: 'Investigators see a bird\'s eye view of all active threats and can immediately spot emerging clusters.', target: '/intelligence/cases/KAV-2026-0101' },
  { path: '/intelligence/cases/KAV-2026-0101', title: 'Case Investigation', content: 'The investigator reviews the specific case details, evidence, and AI summary. Notice the Cluster ID tag.', target: '/intelligence/network' },
  { path: '/intelligence/network', title: 'Fraud Network Graph', content: 'The graph reveals how this case connects to others through shared phones or UPI IDs, uncovering the larger syndicate.', target: '/' }
];

export function DemoWorkflow() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const location = useLocation();
  const navigate = useNavigate();

  // Allow starting demo via a global window flag or keyboard shortcut if needed,
  // but for now, we'll just show a floating "Start Demo" button if not in demo mode.

  useEffect(() => {
    // If demo is active, find which step we are on based on path
    if (currentStepIndex >= 0) {
      const step = demoSteps.find(s => s.path === location.pathname);
      if (step) {
         setCurrentStepIndex(demoSteps.indexOf(step));
      }
    }
  }, [location.pathname, currentStepIndex]);

  const startDemo = () => {
    setIsVisible(true);
    setCurrentStepIndex(0);
    navigate('/');
  };

  const endDemo = () => {
    setIsVisible(false);
    setCurrentStepIndex(-1);
  };

  const nextStep = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      const next = demoSteps[currentStepIndex + 1];
      navigate(next.path);
    } else {
      endDemo();
    }
  };

  if (!isVisible && currentStepIndex === -1) {
    return (
      <button 
        onClick={startDemo}
        className="fixed bottom-4 right-4 z-[9999] bg-brand-cyan text-[#0F172A] px-4 py-2 rounded-full font-bold shadow-lg shadow-brand-cyan/20 hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2 group"
      >
        <Play className="w-4 h-4" />
        <span className="group-hover:inline">Interactive Demo</span>
      </button>
    );
  }

  const step = demoSteps[currentStepIndex] || demoSteps[0];
  const isLast = currentStepIndex === demoSteps.length - 1;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-80 animate-in slide-in-from-bottom-5">
      <Card className="border-brand-cyan/50 shadow-xl shadow-brand-cyan/10 bg-surface-elevated/95 backdrop-blur">
        <div className="p-3 border-b border-surface-raised flex justify-between items-center bg-brand-cyan/5">
          <div className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
            Guided Tour ({currentStepIndex + 1}/{demoSteps.length})
          </div>
          <button onClick={endDemo} className="text-text-muted hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-text-primary">{step.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{step.content}</p>
          <div className="pt-2 flex justify-end">
            <Button size="sm" onClick={nextStep} className="flex items-center gap-1">
              {isLast ? 'Finish Tour' : 'Next Step'}
              {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
