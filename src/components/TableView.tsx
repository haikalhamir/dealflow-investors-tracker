import React, { useState } from 'react';
import { DealOpportunity, Stage } from '../types';
import {
  getCountryMeta,
  getDueUrgency,
  dueLabel,
  daysBetween,
  todayStr,
  STAGES,
} from '../utils/dealEngine';
import { ArrowUpDown, ExternalLink } from 'lucide-react';

interface TableViewProps {
  opportunities: DealOpportunity[];
  onSelectOpportunity: (o: DealOpportunity) => void;
  onMoveToStage: (id: string, stage: Stage) => void;
  onSnooze: (id: string, days: number) => void;
}

type SortField = 'company' | 'country' | 'stage' | 'nextDue' | 'daysSince';

export const TableView: React.FC<TableViewProps> = ({
  opportunities,
  onSelectOpportunity,
  onMoveToStage,
  onSnooze,
}) => {
  const [sortField, setSortField] = useState<SortField>('nextDue');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'company') {
      cmp = a.company.localeCompare(b.company);
    } else if (sortField === 'country') {
      cmp = a.countryCode.localeCompare(b.countryCode);
    } else if (sortField === 'stage') {
      cmp = STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
    } else if (sortField === 'nextDue') {
      cmp = a.nextDue.localeCompare(b.nextDue);
    } else if (sortField === 'daysSince') {
      cmp =
        daysBetween(b.created, todayStr()) - daysBetween(a.created, todayStr());
    }
    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono">
            <tr>
              <th
                onClick={() => handleSort('company')}
                className="cursor-pointer py-3 pl-4 pr-3 hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company / Partner</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('country')}
                className="cursor-pointer px-3 py-3 hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Region</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3 py-3">Type</th>
              <th
                onClick={() => handleSort('stage')}
                className="cursor-pointer px-3 py-3 hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Stage</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3 py-3">Target / Deal</th>
              <th className="px-3 py-3">Next Action</th>
              <th
                onClick={() => handleSort('nextDue')}
                className="cursor-pointer px-3 py-3 hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Due Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('daysSince')}
                className="cursor-pointer px-3 py-3 text-right hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Age</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {sortedOpportunities.map((o) => {
              const country = getCountryMeta(o.countryCode);
              const urgency = getDueUrgency(o.nextDue);
              const isOverdue = urgency === 'overdue';
              const daysSince = daysBetween(o.created, todayStr());

              return (
                <tr
                  key={o.id}
                  onClick={() => onSelectOpportunity(o)}
                  className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                >
                  {/* Company */}
                  <td className="py-3 pl-4 pr-3 font-semibold text-slate-900 group-hover:text-amber-700">
                    <div className="truncate max-w-[200px]">{o.company}</div>
                    <div className="text-[11px] font-normal text-slate-500 truncate max-w-[200px]">
                      {o.owner}
                    </div>
                  </td>

                  {/* Country */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <span>{country.flag}</span>
                      <span className="font-mono text-slate-500">{country.code}</span>
                    </span>
                  </td>

                  {/* Type */}
                  <td className="whitespace-nowrap px-3 py-3 capitalize text-slate-600">
                    {o.type}
                  </td>

                  {/* Stage */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <select
                      value={o.stage}
                      onChange={(e) => {
                        e.stopPropagation();
                        onMoveToStage(o.id, e.target.value as Stage);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Target / Deal */}
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-amber-800 font-medium tabular-nums">
                    {o.dealSize || '—'}
                  </td>

                  {/* Next Action */}
                  <td className="px-3 py-3 max-w-[240px]">
                    <div className="truncate text-slate-800 font-medium">
                      {o.nextAction}
                    </div>
                    {o.outcome && (
                      <div className="text-[11px] text-emerald-700 truncate font-medium">
                        ✔ {o.outcome}
                      </div>
                    )}
                  </td>

                  {/* Due Status */}
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums font-mono">
                    <span
                      className={`font-semibold ${
                        isOverdue
                          ? 'text-rose-700'
                          : urgency === 'today'
                          ? 'text-amber-800'
                          : 'text-slate-600'
                      }`}
                    >
                      {dueLabel(o.nextDue)}
                    </span>
                  </td>

                  {/* Age */}
                  <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-slate-500">
                    {daysSince}d
                  </td>

                  {/* Actions */}
                  <td
                    className="whitespace-nowrap py-3 pl-3 pr-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSnooze(o.id, 7)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100 shadow-2xs"
                        title="Snooze 7 days"
                      >
                        +7d
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectOpportunity(o)}
                        className="rounded border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-2xs"
                        title="Open Details"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
