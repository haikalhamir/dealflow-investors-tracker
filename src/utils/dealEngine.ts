import { DealOpportunity, Stage, StageSuggestion, ASEANCountry } from '../types';

export const STAGES: Stage[] = ['Introduction', 'Qualified', 'Meeting', 'Negotiation', 'Outcome'];

export const ASEAN_COUNTRIES: ASEANCountry[] = [
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', hub: 'Singapore' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', hub: 'Kuala Lumpur / Cyberjaya' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', hub: 'Jakarta / Bandung' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', hub: 'Bangkok' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', hub: 'Ho Chi Minh City / Hanoi' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', hub: 'Metro Manila' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', hub: 'Bandar Seri Begawan' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', hub: 'Phnom Penh' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', hub: 'Vientiane' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', hub: 'Yangon' },
];

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function inDays(n: number): string {
  return daysAgo(-n);
}

export function daysBetween(a: string, b: string): number {
  const dateA = new Date(a + 'T00:00:00').getTime();
  const dateB = new Date(b + 'T00:00:00').getTime();
  return Math.round((dateB - dateA) / 86400000);
}

export type DueUrgency = 'overdue' | 'today' | 'tomorrow' | 'soon' | 'future';

export function getDueUrgency(due: string): DueUrgency {
  const d = daysBetween(todayStr(), due);
  if (d < 0) return 'overdue';
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d <= 7) return 'soon';
  return 'future';
}

export function dueLabel(due: string): string {
  const d = daysBetween(todayStr(), due);
  if (d < -1) return `${Math.abs(d)}d overdue`;
  if (d === -1) return '1d overdue';
  if (d === 0) return 'due today';
  if (d === 1) return 'due tomorrow';
  return `in ${d}d`;
}

/**
 * Stage Suggestion Heuristic Engine
 * Evaluates the nextAction string to advise founders if the deal
 * should move forward or if it's currently stalled at an earlier phase.
 */
export function suggestStage(o: DealOpportunity): StageSuggestion | null {
  const na = (o.nextAction || '').toLowerCase();
  if (!na.trim()) return null;

  const rules = [
    {
      re: /evidence|submit success|closed round|wire received|pilot launched|rollout completed|onboarded|contract sealed|case study/,
      idx: 4,
      why: 'next step is to collect outcome evidence, close, or launch pilot',
    },
    {
      re: /mou|sign|negotiat|proposal|poc pilot|term sheet|legal review|cap table|commercial terms|governance agreement/,
      idx: 3,
      why: 'next step involves terms, MOU proposal, or contract execution',
    },
    {
      re: /call|meeting|partner pitch|diligence|demo|second meet|ic review|deep dive|q&a session|financial model presentation/,
      idx: 2,
      why: 'next step is a partner meeting, diligence review, or presentation call',
    },
    {
      re: /one-pager|re-confirm|objectives|deck|thesis|qualification|intro follow-up|check criteria|send overview/,
      idx: 1,
      why: 'next step qualifies mutual alignment and investment criteria',
    },
  ];

  let best: StageSuggestion | null = null;
  for (const m of rules) {
    if (m.re.test(na) && (best === null || m.idx > best.idx)) {
      best = { idx: m.idx, stage: STAGES[m.idx], reason: m.why };
    }
  }
  return best;
}

export function daysToQualified(o: DealOpportunity): number | null {
  const q = o.history.find((h) => h.toLowerCase().includes('qualified'));
  if (!q) return null;
  const match = q.match(/D(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function median(arr: number[]): number | null {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round(((s[m - 1] + s[m]) / 2) * 10) / 10;
}

export function getCountryMeta(code: string): ASEANCountry {
  return (
    ASEAN_COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase()) || {
      code: code.toUpperCase(),
      name: code,
      flag: '🌐',
      hub: 'ASEAN Region',
    }
  );
}

export function exportPipelineToCSV(opportunities: DealOpportunity[]): void {
  const headers = [
    'ID',
    'Company',
    'Country',
    'Type',
    'Stage',
    'Owner',
    'Target Deal Size',
    'Next Action',
    'Next Due',
    'Days Since Created',
    'Status',
    'Outcome',
  ];

  const rows = opportunities.map((o) => [
    o.id,
    `"${o.company.replace(/"/g, '""')}"`,
    o.countryCode,
    o.type,
    o.stage,
    `"${o.owner.replace(/"/g, '""')}"`,
    `"${(o.dealSize || '').replace(/"/g, '""')}"`,
    `"${o.nextAction.replace(/"/g, '""')}"`,
    o.nextDue,
    daysBetween(o.created, todayStr()),
    o.stalled ? 'Stalled' : 'Active',
    `"${(o.outcome || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Startup_ASEAN_DealFlow_${todayStr()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
