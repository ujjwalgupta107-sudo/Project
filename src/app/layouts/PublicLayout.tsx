
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Public Footer Placeholder */}
      <footer className="border-t border-surface-raised p-4 text-center text-text-muted text-sm">
        &copy; {new Date().getFullYear()} KAVACH AI Platform
      </footer>
    </div>
  );
}
