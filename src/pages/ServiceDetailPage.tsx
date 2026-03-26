import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, CheckCircle, Calendar } from 'lucide-react';
import { services } from '../data/services';
import { useAppStore } from '../store/useAppStore';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addAppointment, user } = useAppStore();

  const service = services.find(s => s.id === id);
  const aiSummary = (location.state as any)?.aiSummary;
  const urgency = (location.state as any)?.urgency || 'low';

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (!service) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Service not found</p>
        <button onClick={() => navigate('/services')} className="text-primary text-sm mt-2">Back to services</button>
      </div>
    );
  }

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { label: format(d, 'EEE, MMM d'), value: format(d, 'yyyy-MM-dd') };
  });

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !user) return;
    addAppointment({
      userId: user.id,
      serviceId: service.id,
      serviceName: service.name,
      doctor: service.doctor,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      aiSummary,
      urgency,
    });
    setBooked(true);
    toast.success('Appointment booked successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-aura">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <AnimatePresence mode="wait">
        {booked ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 rounded-xl bg-card shadow-aura-md"
          >
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Appointment Confirmed</h2>
            <p className="text-sm text-muted-foreground mb-1">{service.name} with {service.doctor}</p>
            <p className="text-sm text-mono text-foreground">{format(new Date(selectedDate!), 'EEEE, MMMM d, yyyy')} at {selectedTime}</p>
            {aiSummary && (
              <div className="mt-4 p-3 rounded-lg bg-secondary text-left">
                <p className="text-xs text-muted-foreground mb-1">AI Clinical Summary (shared with doctor)</p>
                <p className="text-xs text-foreground">{aiSummary}</p>
              </div>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => navigate('/appointments')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover-lift">
                View Appointments
              </button>
              <button onClick={() => navigate('/services')} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover-lift">
                Browse More
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Service Info */}
            <div className="p-5 rounded-xl bg-card shadow-aura-md">
              <p className="text-xs text-accent font-medium mb-1">{service.specialty}</p>
              <h1 className="text-lg font-medium text-foreground mb-1">{service.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{service.duration} min</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />${service.price}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground">{service.doctor}</p>
                <p className="text-xs text-muted-foreground">{service.doctorTitle}</p>
              </div>
            </div>

            {aiSummary && (
              <div className="p-4 rounded-xl bg-accent/5 shadow-aura-sm">
                <p className="text-xs text-accent font-medium mb-1">AI Triage Summary</p>
                <p className="text-xs text-foreground">{aiSummary}</p>
              </div>
            )}

            {/* Date Selection */}
            <div className="p-5 rounded-xl bg-card shadow-aura-md">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableDates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => { setSelectedDate(d.value); setSelectedTime(null); }}
                    className={`p-2.5 rounded-lg text-xs font-medium transition-aura ${
                      selectedDate === d.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-card shadow-aura-md"
              >
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {service.availability.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-2.5 rounded-lg text-xs text-mono font-medium transition-aura ${
                        selectedTime === t
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Book Button */}
            {selectedDate && selectedTime && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={handleBook}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover-lift"
                >
                  Confirm Booking — {format(new Date(selectedDate), 'MMM d')} at {selectedTime}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
