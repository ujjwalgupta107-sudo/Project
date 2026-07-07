import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import { useAuthStore } from '../../stores/authStore';

export function InvestigatorLayout() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="min-h-screen bg-surface-base flex items-center justify-center text-brand-cyan">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'INVESTIGATOR' && user?.role !== 'ADMIN') {
    return <Navigate to="/shield" replace />;
  }

  return (
    <div className="min-h-screen flex bg-surface-base">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="border-b border-surface-raised p-4 flex justify-between items-center md:hidden shrink-0">
           <h1 className="text-xl font-bold text-brand-cyan">Command Centre</h1>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-[#0b1120]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
