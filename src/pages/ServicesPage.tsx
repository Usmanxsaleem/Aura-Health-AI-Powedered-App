import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Search } from 'lucide-react';
import { services, specialties } from '../data/services';

export default function ServicesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = services.filter(s => {
    const matchFilter = filter === 'All' || s.specialty === filter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.specialty.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-2xl text-foreground">Services</h1>
        <p className="text-body text-muted-foreground mt-1">Browse available medical services and book an appointment</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card shadow-aura-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', ...specialties].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-aura ${
                filter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card shadow-aura-sm text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((svc, i) => (
          <motion.button
            key={svc.id}
            onClick={() => navigate(`/services/${svc.id}`)}
            className="text-left p-5 rounded-xl bg-card shadow-aura-sm transition-aura hover:shadow-aura-md group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -1 }}
          >
            <p className="text-xs text-accent font-medium mb-1.5">{svc.specialty}</p>
            <h3 className="text-sm font-medium text-foreground mb-1">{svc.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{svc.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{svc.duration} min</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{svc.price}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{svc.doctor}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
