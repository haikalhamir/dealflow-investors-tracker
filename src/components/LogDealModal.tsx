import React, { useState } from 'react';
import { DealOpportunity, Stage, EntityType } from '../types';
import { ASEAN_COUNTRIES, inDays, todayStr, STAGES } from '../utils/dealEngine';
import { X, Sparkles, Plus } from 'lucide-react';

interface LogDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeal: (deal: DealOpportunity) => void;
  initialStage?: Stage;
}

export const LogDealModal: React.FC<LogDealModalProps> = ({
  isOpen,
  onClose,
  onAddDeal,
  initialStage = 'Introduction',
}) => {
  const [company, setCompany] = useState('');
  const [countryCode, setCountryCode] = useState('SG');
  const [type, setType] = useState<EntityType>('investor');
  const [owner, setOwner] = useState('S. Tan (you)');
  const [stage, setStage] = useState<Stage>(initialStage);
  const [dealSize, setDealSize] = useState('$500k Seed');
  const [about, setAbout] = useState('');
  const [nextAction, setNextAction] = useState('Send pitch deck and qualification questions');
  const [nextDue, setNextDue] = useState(inDays(3));
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [meetingEvent, setMeetingEvent] = useState('Startup ASEAN CrossConnect');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    const id = `OPP-${Math.floor(100 + Math.random() * 900)}`;
    const newDeal: DealOpportunity = {
      id,
      company: company.trim(),
      countryCode,
      type,
      owner: owner.trim() || 'You',
      stage,
      created: todayStr(),
      nextAction: nextAction.trim() || 'Schedule follow-up discussion',
      nextDue: nextDue || inDays(3),
      dealSize: dealSize.trim() || undefined,
      about: about.trim() || `Discussion initiated via ${meetingEvent}`,
      contactName: contactName.trim() || undefined,
      contactRole: contactRole.trim() || undefined,
      meetingEvent: meetingEvent.trim() || undefined,
      history: [`D1 ${stage} initiated via ${meetingEvent}`],
      notes: [],
    };

    onAddDeal(newDeal);
    onClose();
  };

  const applyPreset = (presetType: 'vc' | 'corp' | 'cradle') => {
    if (presetType === 'vc') {
      setCompany('Insignia Ventures Partners (SG)');
      setCountryCode('SG');
      setType('investor');
      setStage('Introduction');
      setDealSize('$1.0M Seed');
      setAbout('Seed round follow-up from Echelon ASEAN Pitching day');
      setNextAction('Send data room access and updated Q3 financial model');
      setNextDue(inDays(2));
      setMeetingEvent('Echelon ASEAN Showcase');
    } else if (presetType === 'corp') {
      setCompany('Petronas Ventures (MY)');
      setCountryCode('MY');
      setType('corporate');
      setStage('Qualified');
      setDealSize('Enterprise Pilot (RM 150k)');
      setAbout('Clean logistics fleet trial and telemetry POC');
      setNextAction('Submit technical security review and pilot MOU scope');
      setNextDue(inDays(4));
      setMeetingEvent('KL Innovation Summit 2026');
    } else if (presetType === 'cradle') {
      setCompany('Enterprise Singapore / GIA (SG)');
      setCountryCode('SG');
      setType('government');
      setStage('Meeting');
      setDealSize('Cross-border Grant');
      setAbout('Regional market expansion support to Vietnam and Indonesia');
      setNextAction('Schedule diligence meeting with regional director');
      setNextDue(inDays(3));
      setMeetingEvent('ASEAN Chairmanship Bilateral Session');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Log Deal / Regional Handshake
            </h3>
            <p className="text-xs text-slate-500">
              Track a newly met investor or corporate partner across ASEAN.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
            <Sparkles className="h-3 w-3 text-amber-600" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('vc')}
            className="cursor-pointer rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 hover:border-amber-400 hover:text-slate-900 shrink-0"
          >
            VC Seed Round (SG)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('corp')}
            className="cursor-pointer rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 hover:border-amber-400 hover:text-slate-900 shrink-0"
          >
            Corporate Pilot (MY)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('cradle')}
            className="cursor-pointer rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700 hover:border-amber-400 hover:text-slate-900 shrink-0"
          >
            Market Grant
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Company / Firm Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Wavemaker Partners (SG)"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ASEAN Member State *
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {ASEAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Entity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EntityType)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                <option value="investor">Venture Capital / Investor</option>
                <option value="corporate">Corporate Partner</option>
                <option value="government">Government / Grant</option>
                <option value="accelerator">Accelerator / Program</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Pipeline Stage
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
                placeholder="e.g. $750k Seed or Pilot MOU"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              About / Context
            </label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="e.g. Discussed our logistics route optimizer for their regional hub"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Next Action (Owed Commitment) *
              </label>
              <input
                type="text"
                required
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Schedule discovery call, sign MOU"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              <span className="mt-1 block text-[10px] text-slate-400">
                Keywords like &quot;call&quot;, &quot;MOU&quot;, &quot;deck&quot;, &quot;pilot&quot; trigger smart stage suggestions.
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Action Due Date *
              </label>
              <input
                type="date"
                required
                value={nextDue}
                onChange={(e) => setNextDue(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Key Contact Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Somchai P."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Summit / Intro Origin
              </label>
              <input
                type="text"
                value={meetingEvent}
                onChange={(e) => setMeetingEvent(e.target.value)}
                placeholder="e.g. ASEAN Tech Week"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-300 shadow-xs border border-amber-500/30"
            >
              <Plus className="h-4 w-4" />
              <span>Track Opportunity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
