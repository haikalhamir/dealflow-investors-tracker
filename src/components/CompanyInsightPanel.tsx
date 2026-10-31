import React, { useState } from 'react';
import { DealOpportunity } from '../types';
import { daysBetween, todayStr, daysToQualified } from '../utils/dealEngine';
import { Compass, Send, Check, Pencil, Trash2, X } from 'lucide-react';

interface CompanyInsightPanelProps {
  opportunities: DealOpportunity[];
  selectedOpportunityId: string | null;
  onSelectOpportunityId: (id: string) => void;
  onAddHistoryNote: (id: string, note: string) => void;
  onUpdateHistoryMilestone: (id: string, index: number, newText: string) => void;
  onDeleteHistoryMilestone: (id: string, index: number) => void;
  onOpenDetailModal: (o: DealOpportunity) => void;
}

export const CompanyInsightPanel: React.FC<CompanyInsightPanelProps> = ({
  opportunities,
  selectedOpportunityId,
  onSelectOpportunityId,
  onAddHistoryNote,
  onUpdateHistoryMilestone,
  onDeleteHistoryMilestone,
  onOpenDetailModal,
}) => {
  const [newNote, setNewNote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const currentDeal =
    opportunities.find((o) => o.id === selectedOpportunityId) ||
    opportunities[0] ||
    null;

  if (!currentDeal) return null;

  const since = daysBetween(currentDeal.created, todayStr());
  const hist = currentDeal.history || [];
  const lastEntry = hist.length ? hist[hist.length - 1] : '';
  const match = lastEntry.match(/D(\d+)/i);
  const lastDay = match ? parseInt(match[1], 10) : 0;
  const inStage = Math.max(0, since - lastDay);
  const qd = daysToQualified(currentDeal);

  // Helper to ensure country code is not duplicated if company name already includes (TH), (VN), etc.
  const formatCompanyOption = (company: string, countryCode: string) => {
    const trimmed = company.trim();
    if (/\([A-Z]{2}\)$/i.test(trimmed)) {
      return trimmed;
    }
    return `${trimmed} (${countryCode})`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddHistoryNote(currentDeal.id, newNote.trim());
    setNewNote('');
  };

  const startEditMilestone = (index: number, text: string) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const saveEditMilestone = () => {
    if (editingIndex === null) return;
    const trimmed = editText.trim();
    if (trimmed) {
      onUpdateHistoryMilestone(currentDeal.id, editingIndex, trimmed);
    }
    setEditingIndex(null);
    setEditText('');
  };

  const cancelEditMilestone = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const deleteMilestone = (index: number) => {
    onDeleteHistoryMilestone(currentDeal.id, index);
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditText('');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      {/* Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Company Journey &amp; Velocity
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Timeline velocity audit from initial discovery handshake to commercial closing.
          </p>
        </div>

        {/* Dropdown selector without repeated country shortform */}
        <div className="flex items-center gap-2">
          <select
            value={currentDeal.id}
            onChange={(e) => {
              setEditingIndex(null);
              onSelectOpportunityId(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none font-medium shadow-2xs"
          >
            {opportunities.map((o) => (
              <option key={o.id} value={o.id}>
                {formatCompanyOption(o.company, o.countryCode)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onOpenDetailModal(currentDeal)}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            View Full
          </button>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 mb-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-lg font-bold text-slate-900 tabular-nums font-mono">
            {since}d
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Days since handshake
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-lg font-bold text-amber-700 tabular-nums font-mono">
            {inStage}d
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500 truncate">
            Days in {currentDeal.stage}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-lg font-bold text-teal-700 tabular-nums font-mono">
            {qd === null ? '—' : `Day ${qd}`}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            When thesis qualified
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-lg font-bold text-slate-900 tabular-nums font-mono">
            {hist.length}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Milestones recorded
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Stage Milestone Progression</span>
            <span className="text-[11px] text-slate-400 font-normal">
              (click any milestone to edit)
            </span>
          </div>
          <span>
            Current stage: <strong className="text-amber-700 font-semibold">{currentDeal.stage}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg border border-slate-200 bg-slate-50/60 min-h-[56px]">
          {hist.map((h, i) => {
            const isLast = i === hist.length - 1;
            const isCurrentStageStep = h.toLowerCase().includes(currentDeal.stage.toLowerCase());
            const isEditing = editingIndex === i;

            if (isEditing) {
              return (
                <React.Fragment key={i}>
                  <div className="inline-flex items-center gap-1 rounded-md border border-amber-400 bg-white p-1 shadow-xs z-10">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditMilestone();
                        if (e.key === 'Escape') cancelEditMilestone();
                      }}
                      autoFocus
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500 w-48 sm:w-64"
                      placeholder="e.g. D12 POC proposal submitted"
                    />
                    <button
                      type="button"
                      onClick={saveEditMilestone}
                      className="cursor-pointer p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                      title="Save milestone (Enter)"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteMilestone(i);
                      }}
                      className="cursor-pointer p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete milestone"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        cancelEditMilestone();
                      }}
                      className="cursor-pointer p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                      title="Cancel (Esc)"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {!isLast && (
                    <span className="text-slate-400 text-xs font-mono">→</span>
                  )}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={i}>
                <span
                  className={`group relative inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-all ${
                    isCurrentStageStep
                      ? 'border border-teal-300 bg-teal-50 text-teal-900 font-semibold shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    onClick={() => startEditMilestone(i, h)}
                    className="cursor-pointer select-none"
                    title="Click to edit milestone"
                  >
                    {h}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEditMilestone(i, h);
                      }}
                      className="cursor-pointer p-0.5 rounded text-slate-400 hover:text-amber-700 hover:bg-slate-100"
                      title="Edit milestone"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteMilestone(i);
                      }}
                      className="cursor-pointer p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete milestone"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </span>
                {!isLast && (
                  <span className="text-slate-400 text-xs font-mono">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {currentDeal.outcome && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Outcome achieved:</strong> {currentDeal.outcome}
            </span>
          </div>
        )}
      </div>

      {/* Quick Add Timeline Note Form */}
      <form onSubmit={handleAddNote} className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={`Log meeting note or milestone for ${currentDeal.company}...`}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-teal-100 border border-teal-300 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-200 disabled:opacity-40 transition-colors"
        >
          <Send className="h-3 w-3 text-teal-700" />
          <span>Log</span>
        </button>
      </form>
    </div>
  );
};
