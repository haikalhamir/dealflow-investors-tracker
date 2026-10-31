export type Stage = 'Introduction' | 'Qualified' | 'Meeting' | 'Negotiation' | 'Outcome';

export type EntityType = 'investor' | 'corporate' | 'accelerator' | 'government';

export interface ASEANCountry {
  code: string;
  name: string;
  flag: string;
  hub: string;
}

export interface DealOpportunity {
  id: string;
  company: string;
  countryCode: string;
  type: EntityType;
  about: string;
  owner: string;
  stage: Stage;
  created: string; // YYYY-MM-DD
  nextAction: string;
  nextDue: string; // YYYY-MM-DD
  stalled?: boolean;
  outcome?: string;
  dealSize?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  history: string[]; // e.g. ["D1 Introduction", "D5 Discovery meeting", ...]
  notes?: string[];
  meetingEvent?: string; // e.g. "ASEAN Tech Week 2026", "Echelon Singapore"
}

export interface StageSuggestion {
  idx: number;
  stage: Stage;
  reason: string;
}

export interface PipelineStats {
  total: number;
  outcomes: number;
  overdue: number;
  stalled: number;
  totalPipelineValue: string;
  medianDaysToQualified: number | null;
}

export type ViewMode = 'kanban' | 'table' | 'analytics';
