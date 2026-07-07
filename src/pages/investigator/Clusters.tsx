import { useEffect, useState } from 'react';
import { Network, ArrowRight, Loader2, AlertTriangle, Users, Layers, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { clusterService } from '../../services/api/clusterService';

export function Clusters() {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClusters() {
      try {
        setLoading(true);
        const data = await clusterService.getClusters();
        setClusters(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load clusters');
      } finally {
        setLoading(false);
      }
    }
    loadClusters();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="text-lg">Analyzing network patterns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-4 max-w-3xl mx-auto">
        <AlertTriangle className="w-6 h-6 text-status-critical shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-status-critical mb-1">Failed to Load Clusters</h3>
          <p className="text-status-critical/80">{error}</p>
          <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Network className="w-8 h-8 text-primary" />
            Fraud Clusters
          </h2>
          <p className="text-text-secondary">Dynamically detected connected networks of fraudulent activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {clusters.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-surface-raised rounded-lg border-dashed">
            <p className="text-text-secondary text-lg">No fraud clusters detected currently.</p>
          </div>
        ) : (
          clusters.map((cluster) => (
            <Card key={cluster.id} className="hover:border-primary/50 transition-colors cursor-pointer group flex flex-col h-full" onClick={() => navigate(`/intelligence/clusters/${cluster.id}`)}>
              <CardHeader className="pb-2 border-b border-surface-raised">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-5 h-5 ${cluster.risk_score > 70 ? 'text-status-critical' : cluster.risk_score > 40 ? 'text-status-warning' : 'text-status-safe'}`} />
                    <CardTitle className="text-lg font-mono text-text truncate max-w-[200px]" title={cluster.id}>
                      {cluster.id.split('-')[0].toUpperCase()}
                    </CardTitle>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${cluster.risk_score > 70 ? 'bg-status-critical/20 text-status-critical' : cluster.risk_score > 40 ? 'bg-status-warning/20 text-status-warning' : 'bg-status-safe/20 text-status-safe'}`}>
                    SCORE: {Math.round(cluster.risk_score)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-raised/30 p-3 rounded-lg border border-surface-raised">
                      <div className="text-text-secondary text-xs font-semibold mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> CONNECTED CASES</div>
                      <div className="text-2xl font-bold">{cluster.case_count}</div>
                    </div>
                    <div className="bg-surface-raised/30 p-3 rounded-lg border border-surface-raised">
                      <div className="text-text-secondary text-xs font-semibold mb-1 flex items-center gap-1"><Layers className="w-3 h-3"/> SHARED ENTITIES</div>
                      <div className="text-2xl font-bold">{cluster.entity_count}</div>
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary flex items-center justify-between mt-4">
                    <span>Detected: {new Date(cluster.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
