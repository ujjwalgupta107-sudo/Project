import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { AlertTriangle, Users, ShieldAlert, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dashboardService } from '../../services/api/dashboardService';
import { alertService } from '../../services/api/alertService';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [m, c, a] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getCharts(),
          alertService.getAlerts()
        ]);
        setMetrics(m);
        setCharts(c);
        // Handle pagination response vs array response for alerts
        setAlerts(a.items || a || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading || !metrics || !charts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading intelligence dashboard...</p>
      </div>
    );
  }

  // Safely map charts data in case the backend fields differ slightly
  const reportsData = charts.reports_over_time?.map((d: any) => ({ name: d.date || d.d, reports: d.count || d.c })) || [];
  const scamTypesData = charts.scam_type_distribution?.map((d: any) => ({ name: (d.type || d.name).replace('_', ' '), value: d.count || d.value })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Investigator Dashboard</h2>
          <p className="text-text-secondary">Overview of active threats, cases, and emerging clusters.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="bg-surface-elevated border border-surface-raised px-3 py-1.5 rounded-md text-text-muted">Live Feed</span>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active High-Risk Cases</p>
                <h3 className="text-3xl font-bold mt-2 text-status-critical">{metrics.active_high_risk_cases || 0}</h3>
              </div>
              <div className="p-2 bg-status-critical/10 rounded-md text-status-critical">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">New Reports Today</p>
                <h3 className="text-3xl font-bold mt-2">{metrics.reports_today || 0}</h3>
              </div>
              <div className="p-2 bg-brand-cyan/10 rounded-md text-brand-cyan">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Suspicious Entities</p>
                <h3 className="text-3xl font-bold mt-2 text-status-warning">{metrics.suspicious_entities_tracked || 0}</h3>
              </div>
              <div className="p-2 bg-status-warning/10 rounded-md text-status-warning">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Emerging Clusters</p>
                <h3 className="text-3xl font-bold mt-2 text-brand-cyan">{metrics.emerging_clusters || 0}</h3>
              </div>
              <div className="p-2 bg-brand-blue/20 rounded-md text-brand-cyan">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Reports Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scam Types & Alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cases by Scam Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scamTypesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} hide />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                      cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Alerts</CardTitle>
                <span onClick={() => navigate('/intelligence/alerts')} className="text-xs text-brand-cyan cursor-pointer hover:underline">View All</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="flex gap-3 items-start pb-4 border-b border-surface-raised last:border-0 last:pb-0">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-status-critical shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
                    <div>
                      <p className="text-sm font-medium leading-snug text-text-primary">{alert.title || alert.text}</p>
                      <p className="text-xs text-text-muted mt-1">{new Date(alert.created_at || alert.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && <p className="text-sm text-text-muted">No active alerts.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
