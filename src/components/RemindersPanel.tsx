import React, { useState } from 'react';
import { DealOpportunity } from '../types';
import { daysBetween, todayStr, dueLabel, getDueUrgency } from '../utils/dealEngine';
import { Bell, CheckCircle2 } from 'lucide-react';

interface RemindersPanelProps {
  opportunities: DealOpportunity[];
  onSnooze: (id: string, days: number) => void;
  onSelectOpportunity: (o: DealOpportunity) => void;
  onCompleteAction: (o: DealOpportunity) => void;
}

export const RemindersPanel: React.FC<RemindersPanelProps> = ({
  opportunities,
  onSnooze,
  onSelectOpportunity,
  onCompleteAction,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'overdue' | 'today'>('all');

  const rows = opportunities
    .filter((o) => Boolean(o.nextDue))
    .sort((a, b) => a.nextDue.localeCompare(b.nextDue))
    .filter((o) => {
      if (filterMode === 'overdue') {
        return daysBetween(todayStr(), o.nextDue) < 0;
      }
      if (filterMode === 'today') {
        return daysBetween(todayStr(), o.nextDue) === 0;
      }
      return true;
    });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Follow-Up Reminders &amp; Nudges
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Never drop a regional handshake — active commitments sorted by deadline urgency.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`cursor-pointer rounded-md px-2 py-1 font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('overdue')}
            className={`cursor-pointer rounded-md px-2 py-1 font-medium transition-colors ${
              filterMode === 'overdue'
                ? 'bg-rose-100 text-rose-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overdue
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('today')}
            className={`cursor-pointer rounded-md px-2 py-1 font-medium transition-colors ${
              filterMode === 'today'
                ? 'bg-amber-100 text-amber-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due Today
          </button>
        </div>
      </div>

      {/* Reminder items */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {rows.length > 0 ? (
          rows.map((o) => {
            const urgency = getDueUrgency(o.nextDue);
            const isOverdue = urgency === 'overdue';
            const isToday = urgency === 'today';

            return (
              <div
                key={o.id}
                onClick={() => onSelectOpportunity(o)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                  isOverdue
                    ? 'border-rose-200 bg-rose-50/70 hover:border-rose-300'
                    : isToday
                    ? 'border-amber-200 bg-amber-50/70 hover:border-amber-300'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold tabular-nums font-mono ${
                        isOverdue
                          ? 'text-rose-700'
                          : isToday
                          ? 'text-amber-800'
                          : 'text-slate-600'
                      }`}
                    >
                      {dueLabel(o.nextDue)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                      {o.company}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      ({o.stage})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 truncate font-medium">
                    ➜ {o.nextAction}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Assigned: {o.owner}</span>
                    {o.meetingEvent && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="truncate">{o.meetingEvent}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Snooze & action buttons */}
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onSnooze(o.id, 7)}
                    className="cursor-pointer rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    title="Snooze deadline 7 days"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => onSnooze(o.id, 3)}
                    className="cursor-pointer rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    title="Snooze deadline 3 days"
                  >
                    +3d
                  </button>
                  <button
                    type="button"
                    onClick={() => onCompleteAction(o)}
                    className="cursor-pointer inline-flex items-center gap-1 rounded bg-amber-100 border border-amber-300 px-2 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-200 transition-colors"
                  >
                    <CheckCircle2 className="h-3 w-3 text-amber-700" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No follow-ups matching this filter. You are all caught up!
          </div>
        )}
      </div>
    </div>
  );
};
