import { Shield, Brain, Network } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Platform() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">The KAVACH AI Platform</h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          An integrated ecosystem designed to bridge the gap between citizen reporting and law enforcement intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <Card className="bg-surface-elevated border-surface-raised">
          <CardContent className="p-8">
            <Shield className="w-12 h-12 text-brand-cyan mb-6" />
            <h3 className="text-2xl font-bold mb-4">Citizen Shield</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              A public-facing portal where citizens can upload suspicious messages, audio recordings, or emails. The Shield uses real-time AI to analyze the threat, extract malicious entities, and provide immediate safety recommendations.
            </p>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-center gap-2">• Real-time threat analysis</li>
              <li className="flex items-center gap-2">• Automated entity extraction</li>
              <li className="flex items-center gap-2">• Immediate intervention warnings</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-surface-elevated border-surface-raised">
          <CardContent className="p-8">
            <Network className="w-12 h-12 text-brand-blue mb-6" />
            <h3 className="text-2xl font-bold mb-4">Investigator Command Centre</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              A secure intelligence dashboard for law enforcement. It aggregates reports, identifies emerging fraud clusters, and visualizes complex criminal networks using graph technology.
            </p>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-center gap-2">• Geospatial hotspot mapping</li>
              <li className="flex items-center gap-2">• Cross-case entity correlation</li>
              <li className="flex items-center gap-2">• AI-assisted case summarization</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center bg-surface-elevated border border-surface-raised rounded-2xl p-12">
        <Brain className="w-16 h-16 text-brand-cyan mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
        <p className="text-text-secondary max-w-2xl mx-auto mb-8">
          KAVACH AI utilizes state-of-the-art Large Language Models (LLMs) and Natural Language Processing (NLP) to detect sophisticated social engineering tactics, such as authority impersonation and forced isolation, before the victim loses money.
        </p>
        <Button size="lg">Explore the Tech Stack</Button>
      </div>
    </div>
  );
}
