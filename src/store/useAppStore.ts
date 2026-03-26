import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Service {
  id: string;
  name: string;
  specialty: string;
  description: string;
  duration: number;
  price: number;
  doctor: string;
  doctorTitle: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  doctor: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  aiSummary?: string;
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface TriageResult {
  specialty: string;
  urgency: 'low' | 'medium' | 'high';
  urgencyScore: number;
  summary: string;
  recommendedServices: string[];
}

interface AppState {
  user: User | null;
  appointments: Appointment[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  cancelAppointment: (id: string) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  appointments: [],
  isAuthenticated: false,

  login: (email: string, _password: string) => {
    const stored = localStorage.getItem('aura_users');
    const users = stored ? JSON.parse(stored) : [];
    const found = users.find((u: any) => u.email === email);
    if (found) {
      set({ user: found, isAuthenticated: true });
      const apts = localStorage.getItem(`aura_appointments_${found.id}`);
      if (apts) set({ appointments: JSON.parse(apts) });
      return true;
    }
    return false;
  },

  register: (name: string, email: string, _password: string) => {
    const stored = localStorage.getItem('aura_users');
    const users = stored ? JSON.parse(stored) : [];
    if (users.find((u: any) => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email };
    users.push(newUser);
    localStorage.setItem('aura_users', JSON.stringify(users));
    set({ user: newUser, isAuthenticated: true, appointments: [] });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, appointments: [] });
  },

  addAppointment: (apt) => {
    const id = crypto.randomUUID();
    const newApt = { ...apt, id, createdAt: new Date().toISOString() };
    const updated = [...get().appointments, newApt];
    set({ appointments: updated });
    const user = get().user;
    if (user) localStorage.setItem(`aura_appointments_${user.id}`, JSON.stringify(updated));
  },

  cancelAppointment: (id: string) => {
    const updated = get().appointments.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    );
    set({ appointments: updated });
    const user = get().user;
    if (user) localStorage.setItem(`aura_appointments_${user.id}`, JSON.stringify(updated));
  },

  updateAppointment: (id: string, updates: Partial<Appointment>) => {
    const updated = get().appointments.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    set({ appointments: updated });
    const user = get().user;
    if (user) localStorage.setItem(`aura_appointments_${user.id}`, JSON.stringify(updated));
  },
}));
