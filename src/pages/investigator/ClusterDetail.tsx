import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft, ArrowRight, Loader2, AlertTriangle, Users, Layers, ShieldAlert, Link as LinkIcon, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { clusterService } from '../../services/api/clusterService';

export function ClusterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const result = await clusterService.getClusterDetail(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load cluster details');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="text-lg">Analyzing cluster connections...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-4 max-w-3xl mx-auto">
        <AlertTriangle className="w-6 h-6 text-status-critical shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-status-critical mb-1">Failed to Load Cluster</h3>
          <p className="text-status-critical/80">{error || 'Cluster not found'}</p>
          <Button onClick={() => navigate('/intelligence/clusters')} variant="secondary" className="mt-4">Back to Clusters</Button>
        </div>
      </div>
    );
  }

  const { cluster, cases, entities, explanation } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="secondary" onClick={() => navigate('/intelligence/clusters')} className="px-3">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="w-6 h-6 text-primary" />
            Cluster {cluster.id.split('-')[0].toUpperCase()}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader className="border-b border-surface-raised bg-surface-raised/10">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-status-warning" />
              Intelligence Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg text-text leading-relaxed font-medium mb-6 bg-surface-raised/30 p-4 rounded-lg border border-surface-raised/50">
              {explanation}
            </p>
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-surface-raised p-4 rounded-lg text-center">
                  <div className="text-text-secondary text-sm font-semibold mb-1">RISK SCORE</div>
                  <div className={`text-3xl font-bold ${cluster.risk_score > 70 ? 'text-status-critical' : cluster.risk_score > 40 ? 'text-status-warning' : 'text-status-safe'}`}>
                    {Math.round(cluster.risk_score)}
                  </div>
               </div>
               <div className="bg-surface-raised p-4 rounded-lg text-center">
                  <div className="text-text-secondary text-sm font-semibold mb-1">CASES</div>
                  <div className="text-3xl font-bold text-text">{cluster.case_count}</div>
               </div>
               <div className="bg-surface-raised p-4 rounded-lg text-center">
                  <div className="text-text-secondary text-sm font-semibold mb-1">ENTITIES</div>
                  <div className="text-3xl font-bold text-text">{cluster.entity_count}</div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="border-b border-surface-raised">
            <CardTitle className="text-md flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Shared Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-surface-raised max-h-[300px] overflow-y-auto">
              {entities.map((ent: any) => (
                <div key={ent.id} className="p-4 hover:bg-surface-raised/30 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm font-semibold text-text">{ent.value}</div>
                    <div className="text-xs text-text-secondary mt-1">{ent.type.replace('_', ' ')}</div>
                  </div>
                  <LinkIcon className="w-4 h-4 text-text-secondary/50" />
                </div>
              ))}
              {entities.length === 0 && (
                <div className="p-6 text-center text-text-secondary">No specific entities available.</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="border-b border-surface-raised">
            <CardTitle className="text-md flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Connected Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-surface-raised">
                {cases.map((c: any) => (
                  <div key={c.id} className="p-4 hover:bg-surface-raised/30 transition-colors flex items-center justify-between cursor-pointer" onClick={() => navigate(`/intelligence/cases/${c.id}`)}>
                    <div className="flex items-center gap-4">
                       <span className={`text-xs font-mono px-2 py-1 rounded border ${c.risk_level === 'CRITICAL' || c.risk_level === 'HIGH' ? 'border-status-critical/50 text-status-critical bg-status-critical/5' : 'border-status-safe/50 text-status-safe bg-status-safe/5'}`}>
                        {c.risk_level}
                      </span>
                      <div>
                        <div className="font-semibold text-text text-sm">{c.scam_type.replace('_', ' ')}</div>
                        <div className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {c.city}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary/50" />
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
