import { Shield, Activity, Network, LayoutDashboard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { motion } from 'framer-motion';

const modules = [
  {
    title: 'KAVACH Shield',
    description: 'Citizen-facing fraud analysis and intervention. Simple, secure, and immediate.',
    icon: Shield,
    color: 'text-blue-400',
    visual: (
      <div className="mt-4 p-3 bg-surface-base rounded border border-surface-raised space-y-2">
        <div className="h-2 w-3/4 bg-surface-raised rounded"></div>
        <div className="h-2 w-1/2 bg-surface-raised rounded"></div>
        <div className="mt-2 h-8 w-full bg-status-warning/20 border border-status-warning/50 rounded flex items-center px-2">
          <div className="h-2 w-2 rounded-full bg-status-warning mr-2"></div>
          <div className="h-2 w-1/3 bg-status-warning/80 rounded"></div>
        </div>
      </div>
    )
  },
  {
    title: 'Live Threat Analysis',
    description: 'Progressive analysis of suspicious conversations as they happen.',
    icon: Activity,
    color: 'text-status-critical',
    visual: (
      <div className="mt-4 p-3 bg-surface-base rounded border border-surface-raised flex items-end gap-1 h-20">
        {[40, 55, 30, 70, 85, 95].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-status-critical/20 to-status-critical/80 rounded-t" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    )
  },
  {
    title: 'Fraud Network Intelligence',
    description: 'Connect cases, phone numbers, payment endpoints, and digital infrastructure.',
    icon: Network,
    color: 'text-brand-cyan',
    visual: (
      <div className="mt-4 p-3 bg-surface-base rounded border border-surface-raised h-20 relative overflow-hidden flex items-center justify-center">
        <Network className="w-12 h-12 text-brand-cyan/40" />
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-brand-cyan"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-brand-blue"></div>
        <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-status-warning"></div>
        {/* Fake lines */}
        <div className="absolute top-3 left-3 w-16 h-px bg-surface-raised rotate-45 origin-top-left"></div>
      </div>
    )
  },
  {
    title: 'Investigator Command Centre',
    description: 'Case intelligence, alerts, geospatial patterns, and evidence analysis.',
    icon: LayoutDashboard,
    color: 'text-purple-400',
    visual: (
      <div className="mt-4 p-3 bg-surface-base rounded border border-surface-raised h-20 grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-surface-raised/50 rounded"></div>
        <div className="col-span-1 bg-surface-raised/50 rounded"></div>
        <div className="col-span-1 bg-surface-raised/50 rounded"></div>
        <div className="col-span-2 bg-surface-raised/50 rounded"></div>
      </div>
    )
  }
];

export function PlatformModules() {
  return (
    <section className="py-24 bg-surface-base border-b border-surface-raised">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Platform Modules</h2>
          <p className="text-text-secondary">
            A comprehensive suite of tools for citizens and investigators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-brand-cyan/50 transition-colors cursor-default">
                  <CardHeader>
                    <Icon className={`w-8 h-8 mb-2 ${module.color}`} />
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary h-16">{module.description}</p>
                    {module.visual}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
