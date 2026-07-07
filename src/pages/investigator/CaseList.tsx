import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { caseService } from '../../services/api/caseService';

export function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const data = await caseService.getCases();
        setCases(data.items || data || []);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'bg-status-critical/10 text-status-critical border-status-critical/50';
      case 'HIGH': return 'bg-status-warning/10 text-status-warning border-status-warning/50';
      case 'MEDIUM': return 'bg-status-info/10 text-status-info border-status-info/50';
      default: return 'bg-status-safe/10 text-status-safe border-status-safe/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-status-critical/10 text-status-critical';
      case 'INVESTIGATING': return 'bg-status-warning/10 text-status-warning';
      case 'CLOSED': return 'bg-surface-raised/50 text-text-secondary';
      default: return 'bg-surface-raised/50 text-text-secondary';
    }
  };

  const filteredCases = cases.filter(c => 
    !searchTerm || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.report_location && c.report_location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Case Management</h2>
          <p className="text-text-secondary">View and manage reported fraud incidents.</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-surface-raised flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-elevated/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input 
              placeholder="Search Case ID, Phone, UPI..." 
              className="pl-9 bg-surface-base" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-text-muted w-full sm:w-auto text-right">
            Showing {filteredCases.length} cases
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading cases...</p>
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
              <p className="text-status-critical text-sm">{error}</p>
            </div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-12 text-center text-text-muted">No cases found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-secondary uppercase bg-surface-base border-b border-surface-raised">
                <tr>
                  <th className="px-6 py-4 font-semibold">Case ID</th>
                  <th className="px-6 py-4 font-semibold">Risk</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-raised">
                {filteredCases.map((c) => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-surface-raised/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/intelligence/cases/${c.id}`)}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-text-primary">
                      {c.id}
                      {c.cluster_id && <div className="text-[10px] text-brand-cyan mt-1">CLUSTER: {c.cluster_id}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getRiskColor(c.risk_level)}`}>
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.scam_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {c.report_location || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-cyan transition-colors ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
