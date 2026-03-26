import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { performTriage } from '../lib/triage';
import { services } from '../data/services';
import { useNavigate } from 'react-router-dom';
import type { TriageResult } from '../store/useAppStore';

export default function TriagePage() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const navigate = useNavigate();

  const handleTriage = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1500));

    const triageResult = performTriage(input);
    setResult(triageResult);
    setIsAnalyzing(false);
  };

  const matchedServices = result
    ? services.filter(s => s.specialty === result.specialty)
    : [];

  const urgencyConfig = {
    high: { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle, label: 'Urgent' },
    medium: { color: 'text-warning', bg: 'bg-warning/10', icon: Clock, label: 'Moderate' },
    low: { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle, label: 'Routine' },
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-display text-2xl text-foreground">AI Symptom Triage</h1>
        <p className="text-body text-muted-foreground mt-1">
          Describe your symptoms in plain English. Our AI will recommend the right specialist.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <div className={`rounded-xl bg-card shadow-aura-md overflow-hidden transition-aura ${isAnalyzing ? 'ring-2 ring-accent/50' : ''}`}>
          {isAnalyzing && <div className="h-0.5 ai-shimmer" />}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I've been having persistent headaches and blurred vision for the past week..."
            className="w-full p-5 pb-3 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[120px]"
            disabled={isAnalyzing}
          />
          <div className="flex items-center justify-between px-5 pb-4">
            <p className="text-xs text-muted-foreground">
              {input.length > 0 ? `${input.length} characters` : 'Be as descriptive as possible'}
            </p>
            <motion.button
              onClick={handleTriage}
              disabled={!input.trim() || isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover-lift"
              whileTap={{ scale: 0.97 }}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze symptoms
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="space-y-4"
          >
            {/* Triage Summary */}
            <div className="p-5 rounded-xl bg-card shadow-aura-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Triage Assessment</h3>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${urgencyConfig[result.urgency].bg} ${urgencyConfig[result.urgency].color}`}>
                  {(() => { const Icon = urgencyConfig[result.urgency].icon; return <Icon className="w-3 h-3" />; })()}
                  {urgencyConfig[result.urgency].label} — Score {result.urgencyScore}/10
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recommended Specialty</p>
                  <p className="text-sm font-medium text-primary">{result.specialty}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Clinical Summary</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Matched Services */}
            {matchedServices.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Recommended Services</h3>
                <div className="space-y-2">
                  {matchedServices.map((svc) => (
                    <motion.button
                      key={svc.id}
                      onClick={() => navigate(`/services/${svc.id}`, { state: { aiSummary: result.summary, urgency: result.urgency } })}
                      className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-card shadow-aura-sm transition-aura hover:shadow-aura-md group"
                      whileHover={{ y: -1 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">{svc.doctor} · {svc.duration} min · ${svc.price}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-aura" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={() => { setResult(null); setInput(''); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-aura"
            >
              Start a new assessment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
