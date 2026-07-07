import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

export function EntityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors w-max" onClick={() => navigate('/intelligence/entities')}>
        <ChevronLeft className="w-4 h-4" /> Back to Entities
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-raised pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 bg-surface-raised text-text-primary rounded text-xs font-bold uppercase">
              PHONE
            </span>
            <h1 className="text-3xl font-bold font-mono">+91 •••• 3210</h1>
          </div>
          <p className="text-text-secondary">Entity ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="danger">Block / Flag</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-semibold mb-4">AI Intelligence Summary</h3>
               <p className="text-text-secondary leading-relaxed">
                 This phone number is highly active in <span className="text-text-primary font-medium">Cluster FC-019</span>, primarily associated with Digital Arrest and Courier scams. It shares infrastructure with domain <span className="text-text-primary font-medium">secure-verification.net</span>. High probability of being a burner number used by a mid-level coordinator in the Delhi region.
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-semibold mb-4">Associated Scam Types</h3>
               <div className="flex gap-2">
                  <span className="bg-surface-base border border-surface-raised px-3 py-1.5 rounded text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-status-warning" /> Digital Arrest
                  </span>
                  <span className="bg-surface-base border border-surface-raised px-3 py-1.5 rounded text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-status-warning" /> Courier Fraud
                  </span>
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-semibold mb-4">Related Cases</h3>
               <div className="space-y-2">
                 {['KAV-2026-0101', 'KAV-2026-0114', 'KAV-2026-0150'].map(c => (
                   <div key={c} className="flex justify-between items-center p-3 bg-surface-base border border-surface-raised rounded hover:border-brand-cyan/50 cursor-pointer transition-colors" onClick={() => navigate(`/intelligence/cases/${c}`)}>
                      <span className="font-mono text-sm">{c}</span>
                      <span className="text-xs text-text-secondary">View Case ➔</span>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4 text-text-secondary uppercase">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Risk Score</div>
                  <div className="text-2xl font-bold font-mono text-status-critical">85%</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Total Cases</div>
                  <div className="text-xl font-bold font-mono">3</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">First Seen</div>
                  <div className="text-sm font-medium">2026-07-01</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Last Seen</div>
                  <div className="text-sm font-medium">2026-07-05</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
