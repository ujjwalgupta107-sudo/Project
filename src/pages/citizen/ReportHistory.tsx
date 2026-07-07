import { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../../services/api/caseService';

export function ReportHistory() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const data = await caseService.getMyCases();
        setReports(data.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load report history');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Report History</h2>
          <p className="text-text-secondary">Track your previous analysis and reported incidents.</p>
        </div>
        <Button onClick={() => navigate('/shield')}>New Analysis</Button>
      </div>

      <div className="space-y-4 mt-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading your history...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
            <p className="text-status-critical text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-12 border border-surface-raised rounded-lg border-dashed">
            <p className="text-text-secondary mb-4">You haven't submitted any reports yet.</p>
            <Button onClick={() => navigate('/shield')} variant="secondary">Submit a Report</Button>
          </div>
        )}

        {!loading && !error && reports.map((report) => (
          <Card key={report.id} className="hover:border-surface-raised/80 transition-colors cursor-pointer" onClick={() => navigate(`/shield/result/${report.id}`)}>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${report.risk_level === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical' : 'bg-status-safe/10 text-status-safe'}`}>
                  {report.risk_level === 'CRITICAL' ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="font-bold text-lg">{report.scam_type.replace('_', ' ')}</div>
                  <div className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-1 w-full sm:w-auto mt-2 sm:mt-0">
                <span className={`text-xs font-mono px-2 py-1 rounded border ${report.risk_level === 'CRITICAL' || report.risk_level === 'HIGH' ? 'border-status-critical/50 text-status-critical bg-status-critical/5' : 'border-status-safe/50 text-status-safe bg-status-safe/5'}`}>
                  {report.risk_level} RISK
                </span>
                <span className="text-sm text-text-muted">{report.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
