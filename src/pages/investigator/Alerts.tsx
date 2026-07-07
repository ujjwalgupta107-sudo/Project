import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { alertService } from '../../services/api/alertService';
import { useNavigate } from 'react-router-dom';

export function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const data = await alertService.getAlerts();
        setAlerts(data.items || data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Alert Centre</h2>
          <p className="text-text-secondary">Automated intelligence notifications and pattern detections.</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading alerts...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
            <p className="text-status-critical text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="text-center py-12 border border-surface-raised rounded-lg border-dashed text-text-secondary">
            No active alerts.
          </div>
        )}

        {!loading && !error && alerts.map((alert) => (
          <Card key={alert.id} className={`transition-colors ${alert.status !== 'READ' ? 'border-l-4 border-l-status-critical bg-surface-elevated/80' : 'opacity-80'}`}>
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical' : alert.severity === 'HIGH' ? 'bg-status-warning/10 text-status-warning' : 'bg-status-info/10 text-status-info'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${alert.severity === 'CRITICAL' ? 'bg-status-critical/20 text-status-critical' : alert.severity === 'HIGH' ? 'bg-status-warning/20 text-status-warning' : 'bg-status-info/20 text-status-info'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-text-muted">{new Date(alert.created_at || Date.now()).toLocaleString()}</span>
                  </div>
                  <h4 className={`font-semibold text-base ${alert.status !== 'READ' ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {alert.title || alert.alert_type}
                  </h4>
                  <p className="text-sm text-text-muted mt-1">
                    Related Case/Entity ID: <span className="text-brand-cyan">{alert.case_id || alert.entity_id || 'System'}</span>
                  </p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto flex sm:justify-end gap-2 mt-2 sm:mt-0">
                <Button 
                  onClick={() => alert.case_id && navigate(`/intelligence/cases/${alert.case_id}`)}
                  variant="ghost" size="sm" className="flex items-center gap-2 border border-surface-raised"
                >
                   Investigate
                </Button>
                {alert.status !== 'READ' && (
                  <Button variant="ghost" size="sm" className="text-status-safe hover:text-status-safe hover:bg-status-safe/10">
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
