import { Outlet, Navigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import MobileNav from './MobileNav';
import { useAppStore } from '../store/useAppStore';

export default function AppLayout() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
