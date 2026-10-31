import React from 'react';
import { PipelineStats } from '../types';
import { Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatsStripProps {
  stats: PipelineStats;
  onFilterOverdue: () => void;
  onFilterStalled: () => void;
  onFilterOutcomes: () => void;
  onFilterAll: () => void;
  activeQuickFilter: string;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  stats,
  onFilterOverdue,
  onFilterStalled,
  onFilterOutcomes,
  onFilterAll,
  activeQuickFilter,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
      {/* Stat 1: Total Companies */}
      <button
        type="button"
        onClick={onFilterAll}
        className={`group cursor-pointer rounded-xl border p-4 text-left transition-all ${
          activeQuickFilter === 'all'
            ? 'border-amber-400 bg-amber-50/40 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 text-xs">
          <span>Active Pipeline</span>
          <Target className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums font-mono sm:text-3xl">
          {stats.total}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Companies &amp; investors tracked
        </div>
      </button>

      {/* Stat 2: Results Landed */}
      <button
        type="button"
        onClick={onFilterOutcomes}
        className={`group cursor-pointer rounded-xl border p-4 text-left transition-all ${
          activeQuickFilter === 'outcomes'
            ? 'border-emerald-400 bg-emerald-50/40 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
          <span>Results Landed</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 tabular-nums font-mono sm:text-3xl">
          {stats.outcomes}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Pilots launched &amp; checks sealed
        </div>
      </button>

      {/* Stat 3: Overdue Follow-ups */}
      <button
        type="button"
        onClick={onFilterOverdue}
        className={`group cursor-pointer rounded-xl border p-4 text-left transition-all ${
          activeQuickFilter === 'overdue'
            ? 'border-rose-400 bg-rose-50/40 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
          <span>Overdue Follow-ups</span>
          <Clock className="h-4 w-4 text-rose-600" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-rose-700 tabular-nums font-mono sm:text-3xl">
          {stats.overdue}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Urgent action needed today
        </div>
      </button>

      {/* Stat 4: Stalled Deals */}
      <button
        type="button"
        onClick={onFilterStalled}
        className={`group cursor-pointer rounded-xl border p-4 text-left transition-all ${
          activeQuickFilter === 'stalled'
            ? 'border-amber-400 bg-amber-50/40 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
          <span>Went Quiet (14d+)</span>
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-amber-700 tabular-nums font-mono sm:text-3xl">
          {stats.stalled}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Stalled without recent reply
        </div>
      </button>
    </div>
  );
};
