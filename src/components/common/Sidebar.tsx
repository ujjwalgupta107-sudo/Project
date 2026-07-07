import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileStack, Network, Users, Map, Bell, Bot, LogOut, GitBranch } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/intelligence', exact: true },
  { label: 'Cases', icon: FileStack, path: '/intelligence/cases' },
  { label: 'Fraud Network', icon: Network, path: '/intelligence/network' },
  { label: 'Clusters', icon: GitBranch, path: '/intelligence/clusters' },
  { label: 'Entities', icon: Users, path: '/intelligence/entities' },
  { label: 'Geographic Map', icon: Map, path: '/intelligence/map' },
  { label: 'Alerts', icon: Bell, path: '/intelligence/alerts' },
  { label: 'AI Assistant', icon: Bot, path: '/intelligence/assistant' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 border-r border-surface-raised hidden md:flex flex-col bg-surface-base sticky top-0 h-screen">
      <div className="p-4 border-b border-surface-raised h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold text-brand-cyan tracking-tight">KAVACH AI</h1>
          <span className="ml-2 text-xs text-text-muted uppercase font-semibold">Command</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => cn(
              'flex items-center justify-between px-3 py-2 rounded-md transition-colors group',
              isActive 
                ? 'bg-brand-blue/10 text-brand-cyan' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised/50'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-surface-raised">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-status-critical transition-colors w-full px-3 py-2 rounded-md hover:bg-status-critical/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
