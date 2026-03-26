import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, appointments } = useAppStore();
  const navigate = useNavigate();

  const upcoming = appointments
    .filter(a => a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status !== 'cancelled').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display text-2xl text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-body text-muted-foreground mt-1">
          Here's your health overview
        </p>
      </div>

      {/* AI Triage CTA */}
      <motion.button
        onClick={() => navigate('/triage')}
        className="w-full text-left p-6 rounded-xl bg-card shadow-aura-md group transition-aura hover:shadow-aura-lg"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-medium text-accent uppercase tracking-wider">AI-Powered</span>
            </div>
            <h2 className="text-lg font-medium text-foreground mb-1">
              How are you feeling?
            </h2>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms in plain English and get matched with the right specialist instantly.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-aura mt-1" />
        </div>
      </motion.button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Visits', value: stats.total, icon: Activity },
          { label: 'Upcoming', value: stats.upcoming, icon: CalendarDays },
          { label: 'Cancelled', value: stats.cancelled, icon: Clock },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-xl bg-card shadow-aura-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <stat.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-medium text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-foreground">Upcoming Appointments</h2>
          <button
            onClick={() => navigate('/appointments')}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-8 rounded-xl bg-card shadow-aura-sm text-center">
            <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
            <button
              onClick={() => navigate('/services')}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Browse services
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((apt, i) => (
              <motion.div
                key={apt.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-aura-sm transition-aura hover:shadow-aura-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  apt.urgency === 'high' ? 'bg-destructive' :
                  apt.urgency === 'medium' ? 'bg-warning' : 'bg-success'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{apt.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-mono text-foreground">
                    {format(new Date(apt.date), 'MMM d')}
                  </p>
                  <p className="text-xs text-mono text-muted-foreground">{apt.time}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  apt.status === 'confirmed'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }`}>
                  {apt.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
