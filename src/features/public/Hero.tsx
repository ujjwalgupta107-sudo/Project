import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Activity, AlertTriangle, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/20 via-surface-base to-surface-base"></div>
      
      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Detect fraud before the <span className="text-brand-cyan">damage is done.</span>
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            KAVACH AI analyzes suspicious interactions, protects citizens with real-time risk intelligence, and connects isolated fraud reports into actionable criminal-network insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shield">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Open KAVACH Shield
              </Button>
            </Link>
            <Link to="/intelligence">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                Explore Intelligence Platform
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative lg:ml-auto w-full max-w-lg"
        >
          {/* Main Card */}
          <Card className="relative z-20 border-surface-raised bg-surface-elevated/90 backdrop-blur shadow-2xl">
            <CardHeader className="border-b border-surface-raised pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-mono text-text-muted flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-cyan" />
                  LIVE THREAT ANALYSIS
                </CardTitle>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-critical opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-critical"></span>
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-muted mb-1">Risk Score</div>
                  <div className="text-4xl font-bold text-status-critical font-mono">94%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-muted mb-1">Pattern Detected</div>
                  <div className="text-lg font-medium text-text-primary">Digital Arrest</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-muted mb-3">Active Signals:</div>
                <ul className="space-y-2">
                  {['Authority impersonation', 'Isolation tactic', 'Financial demand'].map((signal, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-primary bg-surface-base p-2 rounded border border-surface-raised">
                      <AlertTriangle className="h-4 w-4 text-status-warning" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-surface-raised">
                <div className="text-sm text-text-muted mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Connected Intelligence:
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-base p-2 rounded">
                    <div className="text-lg font-bold text-brand-cyan font-mono">12</div>
                    <div className="text-xs text-text-muted">Complaints</div>
                  </div>
                  <div className="bg-surface-base p-2 rounded">
                    <div className="text-lg font-bold text-brand-cyan font-mono">3</div>
                    <div className="text-xs text-text-muted">Phones</div>
                  </div>
                  <div className="bg-surface-base p-2 rounded">
                    <div className="text-lg font-bold text-brand-cyan font-mono">2</div>
                    <div className="text-xs text-text-muted">Endpoints</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decorative elements behind the card */}
          <div className="absolute -top-10 -right-10 z-10 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 z-10 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
}
