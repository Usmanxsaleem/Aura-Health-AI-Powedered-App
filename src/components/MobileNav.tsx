import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, CalendarDays, Sparkles, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/triage', label: 'AI Triage', icon: Sparkles },
  { path: '/services', label: 'Services', icon: Stethoscope },
  { path: '/appointments', label: 'Appointments', icon: CalendarDays },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAppStore();

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-card shadow-aura-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-medium text-foreground">aura</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-muted-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="bg-card shadow-aura-md p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-aura ${
                location.pathname === item.path
                  ? 'text-primary font-medium bg-primary/5'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          <div className="px-3 py-1 text-xs text-muted-foreground">{user?.email}</div>
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
