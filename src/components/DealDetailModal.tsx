import React, { useState } from 'react';
import { DealOpportunity, Stage } from '../types';
import {
  getCountryMeta,
  getDueUrgency,
  dueLabel,
  suggestStage,
  daysBetween,
  todayStr,
  inDays,
  STAGES,
} from '../utils/dealEngine';
import {
  X,
  Clock,
  Send,
  Trash2,
  Check,
  Pencil,
} from 'lucide-react';

interface DealDetailModalProps {
  opportunity: DealOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOpportunity: (updated: DealOpportunity) => void;
  onDeleteOpportunity: (id: string) => void;
  onMoveToStage: (id: string, stage: Stage) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onMoveToStage,
}) => {
  if (!isOpen || !opportunity) return null;

  const o = opportunity;
  const country = getCountryMeta(o.countryCode);
  const urgency = getDueUrgency(o.nextDue);
  const sug = suggestStage(o);
  const curIdx = STAGES.indexOf(o.stage);
  const daysSince = daysBetween(o.created, todayStr());

  // Edit states
  const [stage, setStage] = useState<Stage>(o.stage);
  const [nextAction, setNextAction] = useState(o.nextAction);
  const [nextDue, setNextDue] = useState(o.nextDue);
  const [stalled, setStalled] = useState(Boolean(o.stalled));
  const [outcome, setOutcome] = useState(o.outcome || '');
  const [dealSize, setDealSize] = useState(o.dealSize || '');
  const [owner, setOwner] = useState(o.owner);
  const [about, setAbout] = useState(o.about);
  const [newMilestone, setNewMilestone] = useState('');
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
  const [editingMilestoneText, setEditingMilestoneText] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSave = () => {
    const updated: DealOpportunity = {
      ...o,
      stage,
      nextAction: nextAction.trim(),
      nextDue,
      stalled,
      outcome: outcome.trim() || undefined,
      dealSize: dealSize.trim() || undefined,
      owner: owner.trim(),
      about: about.trim(),
    };

    if (stage !== o.stage) {
      updated.history = [
        ...o.history,
        `D${daysSince} Moved to ${stage}`,
      ];
    }

    onUpdateOpportunity(updated);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;

    const updated: DealOpportunity = {
      ...o,
      history: [...o.history, `D${daysSince} ${newMilestone.trim()}`],
    };
    onUpdateOpportunity(updated);
    setNewMilestone('');
  };

  const handleSaveEditMilestone = (index: number) => {
    if (!editingMilestoneText.trim()) return;
    const newHist = [...o.history];
    newHist[index] = editingMilestoneText.trim();
    const updated: DealOpportunity = {
      ...o,
      history: newHist,
    };
    onUpdateOpportunity(updated);
    setEditingMilestoneIndex(null);
    setEditingMilestoneText('');
  };

  const handleDeleteMilestone = (index: number) => {
    const newHist = o.history.filter((_, i) => i !== index);
    const updated: DealOpportunity = {
      ...o,
      history: newHist,
    };
    onUpdateOpportunity(updated);
    if (editingMilestoneIndex === index) {
      setEditingMilestoneIndex(null);
      setEditingMilestoneText('');
    }
  };

  const handleQuickSnooze = (days: number) => {
    const newDate = inDays(days);
    setNextDue(newDate);
    setStalled(false);
    const updated: DealOpportunity = {
      ...o,
      nextDue: newDate,
      stalled: false,
    };
    onUpdateOpportunity(updated);
  };

  const [showConfirmDeleteDeal, setShowConfirmDeleteDeal] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{country.flag}</span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {o.company}
              </h3>
              <span className="font-mono text-xs text-slate-400">
                #{o.id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">{o.type}</span>
              <span aria-hidden="true">·</span>
              <span>{country.name}</span>
              <span aria-hidden="true">·</span>
              <span>First met: {daysSince} days ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showConfirmDeleteDeal ? (
              <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 text-xs">
                <span className="text-rose-800 text-[11px] px-1 font-medium">Archive deal?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteOpportunity(o.id);
                    onClose();
                  }}
                  className="cursor-pointer bg-rose-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold hover:bg-rose-700"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDeleteDeal(false)}
                  className="cursor-pointer text-slate-600 hover:text-slate-900 px-1 text-[11px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmDeleteDeal(true)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Archive deal"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Engine Banner inside detail */}
        {sug && sug.idx !== curIdx && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 p-3 text-xs text-teal-900">
            <div>
              <span className="font-bold">Next Action Signal:</span>{' '}
              {sug.reason}. Suggested stage:{' '}
              <strong className="underline">{sug.stage}</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                setStage(sug.stage);
                onMoveToStage(o.id, sug.stage);
              }}
              className="cursor-pointer shrink-0 rounded bg-teal-200 px-2.5 py-1 font-semibold text-teal-900 hover:bg-teal-300"
            >
              Align to {sug.stage}
            </button>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Stage & Check Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Current Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target / Check Size
              </label>
              <input
                type="text"
                value={dealSize}
                onChange={(e) => setDealSize(e.target.value)}
                placeholder="e.g. $500k Seed, Commercial Pilot"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Assigned Team Lead
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* About / Context */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              About / Deal Thesis
            </label>
            <textarea
              rows={2}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Next Action & Due Date */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Next Action &amp; Follow-up Deadline</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickSnooze(3)}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSnooze(7)}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  +7d
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Specific follow-up action..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={nextDue}
                  onChange={(e) => setNextDue(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-900 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={stalled}
                  onChange={(e) => setStalled(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span>Mark as went quiet / stalled (needs re-engagement)</span>
              </label>

              <span className="font-mono text-[11px] text-amber-800 font-semibold tabular-nums">
                {dueLabel(nextDue)}
              </span>
            </div>
          </div>

          {/* Outcome field */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Outcome Evidence / Result (Optional)
            </label>
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="e.g. Commercial pilot launched with 3 clinics onboarding"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Milestone History Log (Editable) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Deal Journey History ({o.history.length} logged steps)
              </span>
              <span className="text-[10px] text-slate-400">Click pencil to edit or delete any step</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {o.history.map((h, i) => {
                const isEditing = editingMilestoneIndex === i;

                if (isEditing) {
                  return (
                    <div
                      key={i}
                      className="rounded-md border border-amber-400 bg-amber-50/40 p-1.5 font-mono text-[11px] text-slate-800 flex items-center gap-1.5 shadow-2xs"
                    >
                      <input
                        type="text"
                        value={editingMilestoneText}
                        onChange={(e) => setEditingMilestoneText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEditMilestone(i);
                          if (e.key === 'Escape') setEditingMilestoneIndex(null);
                        }}
                        autoFocus
                        className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditMilestone(i)}
                        className="cursor-pointer rounded p-1 text-emerald-700 hover:bg-emerald-100"
                        title="Save milestone"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(i)}
                        className="cursor-pointer rounded p-1 text-rose-600 hover:bg-rose-100"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMilestoneIndex(null)}
                        className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-200"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className="group rounded-md border border-slate-200 bg-slate-50 p-2 font-mono text-[11px] text-slate-700 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                  >
                    <span className="truncate pr-2">{h}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-slate-400 text-[10px] mr-1">Step {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMilestoneIndex(i);
                          setEditingMilestoneText(h);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-white"
                        title="Edit milestone"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick add step */}
            <form onSubmit={handleAddMilestone} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="Log new interaction or meeting summary..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newMilestone.trim()}
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40"
              >
                <Send className="h-3 w-3 text-slate-500" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Footer Save button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {showSavedFeedback ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Changes saved
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Last updated just now
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="cursor-pointer rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-300 shadow-xs border border-amber-500/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
