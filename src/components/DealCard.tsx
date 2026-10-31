import React from 'react';
import { DealOpportunity, Stage } from '../types';
import {
  suggestStage,
  getDueUrgency,
  dueLabel,
  getCountryMeta,
  STAGES,
} from '../utils/dealEngine';
import { ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';

interface DealCardProps {
  opportunity: DealOpportunity;
  onSelect: (opportunity: DealOpportunity) => void;
  onMoveToStage: (id: string, targetStage: Stage) => void;
  onSnooze: (id: string, days: number) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({
  opportunity,
  onSelect,
  onMoveToStage,
  onSnooze,
  onDragStart,
  onDragEnd,
  isDragging,
}) => {
  const o = opportunity;
  const country = getCountryMeta(o.countryCode);
  const urgency = getDueUrgency(o.nextDue);
  const curIdx = STAGES.indexOf(o.stage);
  const sug = suggestStage(o);

  const urgencyStyles: Record<string, string> = {
    overdue: 'border-rose-200 bg-rose-50 text-rose-800',
    today: 'border-amber-300 bg-amber-50 text-amber-900',
    tomorrow: 'border-amber-200 bg-amber-50/70 text-amber-800',
    soon: 'border-slate-200 bg-slate-50 text-slate-700',
    future: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, o.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(o)}
      className={`group relative cursor-grab rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs active:cursor-grabbing ${
        isDragging ? 'opacity-40 scale-98 border-amber-400' : ''
      }`}
    >
      {/* Top row: Company name & country flag */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
          {o.company}
        </h4>
        <span
          className="shrink-0 text-sm"
          title={`${country.name} (${country.code})`}
        >
          {country.flag}
        </span>
      </div>

      {/* About description */}
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
        {o.about}
      </p>

      {/* Next Action & Due Date */}
      {o.nextAction && (
        <div
          className={`mt-2.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
            urgencyStyles[urgency] || urgencyStyles.future
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-semibold truncate">➜ {o.nextAction}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between text-[11px] opacity-90">
            <span className="tabular-nums font-mono font-medium">
              {dueLabel(o.nextDue)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSnooze(o.id, 7);
              }}
              className="cursor-pointer text-[10px] font-medium underline underline-offset-2 opacity-80 hover:opacity-100"
              title="Postpone deadline by 7 days"
            >
              +7d snooze
            </button>
          </div>
        </div>
      )}

      {/* Clean Unboxed Metadata (§1.A Zero-Pill Discipline) */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        <span className="capitalize font-medium text-slate-700">
          {o.type === 'investor'
            ? '🧑‍💼 VC'
            : o.type === 'corporate'
            ? '🏢 Corp'
            : '🏛 Govt'}
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="truncate max-w-[110px]">{o.owner}</span>
        {o.dealSize && (
          <>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-amber-700 font-medium tabular-nums">
              {o.dealSize}
            </span>
          </>
        )}
      </div>

      {/* Stalled indicator */}
      {o.stalled && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-700">
          <span>⚠ Stalled — no communication in 14+ days</span>
        </div>
      )}

      {/* Outcome indicator */}
      {o.outcome && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-200">
          <Check className="h-3 w-3 shrink-0 text-emerald-600" />
          <span className="truncate">{o.outcome}</span>
        </div>
      )}

      {/* Stage Suggestion Engine Banner */}
      <div className="mt-2.5 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
        {sug === null ? (
          <div className="text-[10px] text-slate-400 italic">
            · Set a specific next step to trigger stage suggestions
          </div>
        ) : sug.idx > curIdx ? (
          <div className="flex items-center justify-between gap-1 rounded-md bg-teal-50 px-2 py-1 text-[11px] text-teal-900 border border-teal-200">
            <span className="truncate font-medium flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 shrink-0 text-teal-600" />
              <span>Suggested: <strong>{sug.stage}</strong></span>
            </span>
            <button
              type="button"
              onClick={() => onMoveToStage(o.id, sug.stage)}
              className="cursor-pointer shrink-0 rounded bg-teal-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-teal-900 hover:bg-teal-300 transition-colors"
            >
              Move
            </button>
          </div>
        ) : sug.idx < curIdx ? (
          <div className="flex items-center justify-between gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-900 border border-amber-200">
            <span className="truncate font-medium flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 shrink-0 text-amber-600" />
              <span>Decision stands: <strong>{sug.stage}</strong></span>
            </span>
            <button
              type="button"
              onClick={() => onMoveToStage(o.id, sug.stage)}
              className="cursor-pointer shrink-0 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
            >
              Move back
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
            <Check className="h-2.5 w-2.5 shrink-0 text-emerald-600" />
            <span className="truncate">Stage aligned: {sug.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
};
