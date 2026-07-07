import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ChevronRight, Search, Loader2, AlertTriangle } from 'lucide-react';
import { entityService } from '../../services/api/entityService';

export function EntityList() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntities() {
      try {
        setLoading(true);
        const data = await entityService.getEntities();
        setEntities(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load entities');
      } finally {
        setLoading(false);
      }
    }
    loadEntities();
  }, []);

  const filteredEntities = entities.filter(e => 
    !searchTerm || 
    (e.value && e.value.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (e.type && e.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Entity Intelligence</h2>
          <p className="text-text-secondary">Search and analyze extracted entities across all cases.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-surface-raised flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-elevated/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input 
              placeholder="Search phone, UPI, account, domain..." 
              className="pl-9 bg-surface-base" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-text-muted w-full sm:w-auto text-right">
            Showing {filteredEntities.length} entities
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading entities...</p>
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
              <p className="text-status-critical text-sm">{error}</p>
            </div>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="p-12 text-center text-text-muted">No entities found.</div>
        ) : (
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-surface-base border-b border-surface-raised">
              <tr>
                <th className="px-6 py-4 font-semibold">Entity</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Risk</th>
                <th className="px-6 py-4 font-semibold">Cases</th>
                <th className="px-6 py-4 font-semibold">Cluster</th>
                <th className="px-6 py-4 font-semibold">Last Seen</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-raised">
              {filteredEntities.map((e) => {
                const riskPercent = e.risk_score > 1 ? e.risk_score : Math.round(e.risk_score * 100);
                return (
                <tr 
                  key={e.id} 
                  className="hover:bg-surface-raised/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/intelligence/entities/${e.id}`)}
                >
                  <td className="px-6 py-4 font-mono font-medium text-text-primary">
                    {e.masked_value || e.value}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-surface-raised text-text-primary rounded text-[10px] font-bold uppercase">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${riskPercent >= 90 ? 'bg-status-critical/10 text-status-critical border-status-critical/50' : riskPercent >= 70 ? 'bg-status-warning/10 text-status-warning border-status-warning/50' : 'bg-status-safe/10 text-status-safe border-status-safe/50'}`}>
                      {riskPercent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    -
                  </td>
                  <td className="px-6 py-4 text-brand-cyan font-mono text-xs">
                    {e.cluster_id ? `${e.cluster_id.substring(0, 8)}...` : '-'}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {e.last_seen ? new Date(e.last_seen).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-cyan transition-colors ml-auto" />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
}
