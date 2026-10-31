import React from 'react';
import { ASEAN_COUNTRIES, exportPipelineToCSV } from '../utils/dealEngine';
import { DealOpportunity } from '../types';
import { Download, RotateCcw } from 'lucide-react';

interface EcosystemBannerProps {
  opportunities: DealOpportunity[];
  onResetData: () => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

export const EcosystemBanner: React.FC<EcosystemBannerProps> = ({
  opportunities,
  onResetData,
  selectedCountry,
  onSelectCountry,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <span>Startup ASEAN Official Feature</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-normal">MOSTI &amp; Cradle Fund Initiative</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-normal">10 Member States</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              DealFlow ASEAN <span className="font-normal text-slate-500">— Investor &amp; Corporate Tracker</span>
            </h1>
            <p className="text-sm text-slate-600 text-pretty">
              Your cross-border investor pipeline and corporate pilot tracker. Never lose momentum after the handshake at regional summits, pitch days, and bilateral matching sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => exportPipelineToCSV(opportunities)}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
              title="Download portfolio report for ASEAN partners or board"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onResetData}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-700"
              title="Reset sample ASEAN deals to original state"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* ASEAN Country Filter Strip with flags */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 shrink-0 font-medium mr-1">Region:</span>
          <button
            type="button"
            onClick={() => onSelectCountry('ALL')}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors shrink-0 ${
              selectedCountry === 'ALL'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ASEAN (10)
          </button>
          {ASEAN_COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(c.code)}
              className={`cursor-pointer inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors shrink-0 ${
                selectedCountry === c.code
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
