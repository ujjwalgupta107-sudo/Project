import { AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export function FraudAwareness() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Fraud Intelligence & Awareness</h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Stay informed about the latest cyber fraud tactics and protect yourself against emerging threats.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-6">
             <AlertTriangle className="w-10 h-10 text-status-critical mb-4" />
             <h3 className="text-xl font-bold mb-2">Digital Arrest</h3>
             <p className="text-text-secondary text-sm">Scammers pose as CBI or Customs officers, claiming a parcel in your name contains contraband. They force you to stay on a video call until you pay a "verification fee".</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
             <TrendingUp className="w-10 h-10 text-status-warning mb-4" />
             <h3 className="text-xl font-bold mb-2">Investment Fraud</h3>
             <p className="text-text-secondary text-sm">Victims are lured into fake trading groups promising unrealistic returns. Initial small profits are given to build trust before a massive final deposit is stolen.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
             <Users className="w-10 h-10 text-brand-cyan mb-4" />
             <h3 className="text-xl font-bold mb-2">OTP & Phishing</h3>
             <p className="text-text-secondary text-sm">Fraudsters impersonate bank officials or delivery services asking you to install screen-sharing apps (like AnyDesk) or share OTPs to steal credentials.</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-surface-elevated border border-surface-raised rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6">Live Intelligence Feed</h2>
        <div className="space-y-4">
          <div className="p-4 border border-surface-raised rounded bg-surface-base flex items-center justify-between">
             <div>
               <span className="text-xs font-bold text-status-critical bg-status-critical/10 px-2 py-1 rounded">CRITICAL ALERT</span>
               <h4 className="font-semibold mt-2">Spike in FedEx Customs Scams in Tier-1 Cities</h4>
             </div>
             <span className="text-sm text-text-muted">2 hours ago</span>
          </div>
          <div className="p-4 border border-surface-raised rounded bg-surface-base flex items-center justify-between">
             <div>
               <span className="text-xs font-bold text-status-warning bg-status-warning/10 px-2 py-1 rounded">WARNING</span>
               <h4 className="font-semibold mt-2">New APK Malware circulating via WhatsApp</h4>
             </div>
             <span className="text-sm text-text-muted">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
