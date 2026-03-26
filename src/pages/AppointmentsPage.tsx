import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const { appointments, cancelAppointment } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = appointments
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const urgencyDot = {
    high: 'bg-destructive',
    medium: 'bg-warning',
    low: 'bg-success',
  };

  const statusBadge = {
    confirmed: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-2xl text-foreground">Appointments</h1>
        <p className="text-body text-muted-foreground mt-1">Manage your upcoming and past appointments</p>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-aura ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-card shadow-aura-sm text-muted-foreground hover:text-foreground'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-xl bg-card shadow-aura-sm">
          <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((apt, i) => (
            <motion.div
              key={apt.id}
              className="p-4 rounded-xl bg-card shadow-aura-sm transition-aura hover:shadow-aura-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${urgencyDot[apt.urgency]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground">{apt.serviceName}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusBadge[apt.status]}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-mono text-muted-foreground">
                    <span>{format(new Date(apt.date), 'EEE, MMM d, yyyy')}</span>
                    <span>{apt.time}</span>
                  </div>
                  {apt.aiSummary && (
                    <div className="mt-2 p-2.5 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground mb-0.5">AI Summary</p>
                      <p className="text-xs text-foreground">{apt.aiSummary}</p>
                    </div>
                  )}
                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        cancelAppointment(apt.id);
                        toast.success('Appointment cancelled');
                      }}
                      className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-destructive transition-aura"
                    >
                      <X className="w-3 h-3" />
                      Cancel appointment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
