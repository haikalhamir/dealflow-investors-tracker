import React from 'react';
import { DealOpportunity } from '../types';
import { ASEAN_COUNTRIES, STAGES } from '../utils/dealEngine';
import { Globe, TrendingUp, Compass } from 'lucide-react';

interface RegionalMatrixViewProps {
  opportunities: DealOpportunity[];
  onSelectCountry: (country: string) => void;
  onSelectOpportunity: (o: DealOpportunity) => void;
}

export const RegionalMatrixView: React.FC<RegionalMatrixViewProps> = ({
  opportunities,
  onSelectCountry,
  onSelectOpportunity,
}) => {
  // Aggregate stats per country
  const countryStats = ASEAN_COUNTRIES.map((c) => {
    const deals = opportunities.filter(
      (o) => o.countryCode.toUpperCase() === c.code.toUpperCase()
    );
    const outcomes = deals.filter((o) => o.stage === 'Outcome').length;
    return {
      country: c,
      total: deals.length,
      outcomes,
      deals,
    };
  }).filter((cs) => cs.total > 0 || ['MY', 'SG', 'ID', 'TH', 'VN', 'PH'].includes(cs.country.code));

  // Funnel counts
  const stageCounts = STAGES.map((s) => ({
    stage: s,
    count: opportunities.filter((o) => o.stage === s).length,
  }));

  return (
    <div className="space-y-6">
      {/* Top row: Funnel & Cross-Border Velocity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Funnel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span>ASEAN Pipeline Conversion Funnel</span>
              </h3>
              <p className="text-xs text-slate-500">
                Conversion velocity across regional handshake milestones
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Total: {opportunities.length} deals
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {stageCounts.map(({ stage, count }, idx) => {
              const pct = opportunities.length
                ? Math.round((count / opportunities.length) * 100)
                : 0;

              return (
                <div
                  key={stage}
                  className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-center"
                >
                  <div className="text-[11px] font-mono text-slate-500 uppercase">
                    0{idx + 1}. {stage}
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono tabular-nums text-slate-900">
                    {count}
                  </div>
                  <div className="mt-1 text-[10px] text-amber-800 font-mono font-medium">
                    {pct}% of pipeline
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bilateral Corridors Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
            <Compass className="h-4 w-4 text-teal-600" />
            <span>CrossConnect Corridors</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Active cross-border collaboration channels
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
              <span className="text-slate-800 font-medium">🇲🇾 MY ⇄ 🇸🇬 SG</span>
              <span className="text-amber-800 font-mono text-[11px] font-medium">Venture Syndicate</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
              <span className="text-slate-800 font-medium">🇹🇭 TH ⇄ 🇻🇳 VN</span>
              <span className="text-teal-800 font-mono text-[11px] font-medium">Logistics Pilot</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
              <span className="text-slate-800 font-medium">🇲🇾 MY ⇄ 🇮🇩 ID</span>
              <span className="text-blue-800 font-mono text-[11px] font-medium">Market Access Grant</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
              <span className="text-slate-800 font-medium">🇵🇭 PH ⇄ 🇲🇾 MY</span>
              <span className="text-emerald-800 font-mono text-[11px] font-medium">Enterprise Trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Breakdown Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-blue-600" />
          <span>Ecosystem Distribution by ASEAN Member State</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Click any country to focus your pipeline view on that regional market.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {countryStats.map(({ country, total, deals }) => (
            <div
              key={country.code}
              onClick={() => onSelectCountry(country.code)}
              className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 hover:border-amber-400 hover:bg-amber-50/20 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                      {country.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Hub: {country.hub}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {total}
                  </span>
                  <div className="text-[10px] text-slate-500">deals</div>
                </div>
              </div>

              {deals.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                  {deals.slice(0, 2).map((d) => (
                    <div
                      key={d.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOpportunity(d);
                      }}
                      className="text-[11px] text-slate-700 hover:text-amber-800 truncate flex items-center justify-between"
                    >
                      <span className="truncate">{d.company}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                        {d.stage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
