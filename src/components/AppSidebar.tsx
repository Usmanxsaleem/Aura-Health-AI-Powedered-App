import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/triage', label: 'AI Triage', icon: Sparkles },
  { path: '/services', label: 'Services', icon: Stethoscope },
  { path: '/appointments', label: 'Appointments', icon: CalendarDays },
];

export default function AppSidebar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAppStore();

  if (!isAuthenticated) return null;

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-card shadow-aura-sm">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-display text-lg text-foreground">aura</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Precision healthcare</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-aura ${
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/5 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <item.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 mt-1 text-sm text-muted-foreground hover:text-destructive rounded-lg transition-aura"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
