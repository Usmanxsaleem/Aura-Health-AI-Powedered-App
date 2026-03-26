import type { TriageResult } from '../store/useAppStore';

const triageRules: { keywords: string[]; specialty: string; urgencyBase: number }[] = [
  { keywords: ['headache', 'migraine', 'blurred vision', 'dizziness', 'seizure', 'numbness', 'tingling', 'memory'], specialty: 'Neurology', urgencyBase: 7 },
  { keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'blood pressure', 'cardiac'], specialty: 'Cardiology', urgencyBase: 8 },
  { keywords: ['rash', 'skin', 'acne', 'mole', 'eczema', 'psoriasis', 'itch', 'hives'], specialty: 'Dermatology', urgencyBase: 4 },
  { keywords: ['joint', 'bone', 'fracture', 'sprain', 'back pain', 'knee', 'shoulder', 'muscle'], specialty: 'Orthopedics', urgencyBase: 5 },
  { keywords: ['anxiety', 'depression', 'stress', 'sleep', 'insomnia', 'panic', 'mood', 'mental'], specialty: 'Psychiatry', urgencyBase: 6 },
  { keywords: ['child', 'baby', 'infant', 'pediatric', 'growth', 'vaccination', 'fever'], specialty: 'Pediatrics', urgencyBase: 5 },
  { keywords: ['eye', 'vision', 'glasses', 'contact lens', 'cataract', 'glaucoma'], specialty: 'Ophthalmology', urgencyBase: 4 },
];

export function performTriage(symptoms: string): TriageResult {
  const lower = symptoms.toLowerCase();
  let bestMatch = { specialty: 'General Practice', urgencyBase: 3, matchCount: 0 };

  for (const rule of triageRules) {
    const matchCount = rule.keywords.filter(k => lower.includes(k)).length;
    if (matchCount > bestMatch.matchCount) {
      bestMatch = { ...rule, matchCount };
    }
  }

  // Adjust urgency based on severity keywords
  let urgencyScore = bestMatch.urgencyBase;
  if (lower.includes('severe') || lower.includes('intense') || lower.includes('emergency')) urgencyScore = Math.min(10, urgencyScore + 2);
  if (lower.includes('persistent') || lower.includes('chronic') || lower.includes('worsening')) urgencyScore = Math.min(10, urgencyScore + 1);
  if (lower.includes('mild') || lower.includes('slight') || lower.includes('occasional')) urgencyScore = Math.max(1, urgencyScore - 1);

  const urgency: 'low' | 'medium' | 'high' = urgencyScore >= 7 ? 'high' : urgencyScore >= 4 ? 'medium' : 'low';

  const summaries: Record<string, string> = {
    'Neurology': `Patient reports neurological symptoms including ${symptoms.slice(0, 80)}. Recommend neurological assessment with focus on diagnostic imaging if persistent. Priority assessment advised.`,
    'Cardiology': `Patient presents with cardiovascular concerns: ${symptoms.slice(0, 80)}. Recommend immediate cardiac evaluation including ECG and vital monitoring.`,
    'Dermatology': `Patient describes dermatological symptoms: ${symptoms.slice(0, 80)}. Standard dermatological consultation recommended for assessment and treatment planning.`,
    'Orthopedics': `Patient reports musculoskeletal issues: ${symptoms.slice(0, 80)}. Orthopedic evaluation recommended with possible imaging studies.`,
    'Psychiatry': `Patient describes mental health concerns: ${symptoms.slice(0, 80)}. Confidential psychiatric consultation recommended for assessment and support planning.`,
    'Pediatrics': `Patient reports pediatric health concern: ${symptoms.slice(0, 80)}. Pediatric evaluation recommended for comprehensive assessment.`,
    'Ophthalmology': `Patient reports vision-related symptoms: ${symptoms.slice(0, 80)}. Comprehensive ophthalmological examination recommended.`,
    'General Practice': `Patient presents with general health concerns: ${symptoms.slice(0, 80)}. General consultation recommended for initial assessment and possible specialist referral.`,
  };

  return {
    specialty: bestMatch.specialty,
    urgency,
    urgencyScore,
    summary: summaries[bestMatch.specialty] || summaries['General Practice'],
    recommendedServices: [bestMatch.specialty],
  };
}
