import React, { useState, useEffect, useMemo } from 'react';
import {
  DealOpportunity,
  Stage,
  EntityType,
  ViewMode,
  PipelineStats,
} from './types';
import { getInitialOpportunities } from './data/mockData';
import {
  daysBetween,
  todayStr,
  inDays,
  median,
  daysToQualified,
} from './utils/dealEngine';
import { Header } from './components/Header';
import { EcosystemBanner } from './components/EcosystemBanner';
import { StatsStrip } from './components/StatsStrip';
import { FilterToolbar } from './components/FilterToolbar';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { RegionalMatrixView } from './components/RegionalMatrixView';
import { RemindersPanel } from './components/RemindersPanel';
import { CompanyInsightPanel } from './components/CompanyInsightPanel';
import { LogDealModal } from './components/LogDealModal';
import { DealDetailModal } from './components/DealDetailModal';

const STORAGE_KEY = 'startup_asean_dealflow_data_v5';

export default function App() {
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  // Load data from localStorage or fallback to initial mock dataset
  const [opportunities, setOpportunities] = useState<DealOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return getInitialOpportunities();
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
    } catch {
      // ignore
    }
  }, [opportunities]);

  // UI state
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | 'all'>('all');
  const [needsAttentionOnly, setNeedsAttentionOnly] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'outcomes' | 'overdue' | 'stalled'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalStage, setLogModalStage] = useState<Stage>('Introduction');
  const [selectedOpportunity, setSelectedOpportunity] = useState<DealOpportunity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Selected opportunity for bottom insight panel
  const [insightSelectedId, setInsightSelectedId] = useState<string>(
    opportunities[0]?.id || ''
  );

  // Update insightSelectedId if the selected item was removed
  useEffect(() => {
    if (opportunities.length > 0 && !opportunities.some((o) => o.id === insightSelectedId)) {
      setInsightSelectedId(opportunities[0].id);
    }
  }, [opportunities, insightSelectedId]);

  // Handlers for pipeline operations
  const handleMoveToStage = (id: string, targetStage: Stage) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id || o.stage === targetStage) return o;
        const days = Math.max(1, daysBetween(o.created, todayStr()));
        const lastHist = o.history[o.history.length - 1] || '';
        const newHist = [...o.history];
        if (!lastHist.includes(targetStage)) {
          newHist.push(`D${days} Moved to ${targetStage}`);
        }
        return {
          ...o,
          stage: targetStage,
          history: newHist,
          stalled: false,
        };
      })
    );
  };

  const handleSnooze = (id: string, days: number) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          nextDue: inDays(days),
          stalled: false,
        };
      })
    );
  };

  const handleAddOpportunity = (newDeal: DealOpportunity) => {
    setOpportunities((prev) => [newDeal, ...prev]);
    setInsightSelectedId(newDeal.id);
  };

  const handleUpdateOpportunity = (updated: DealOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
    if (selectedOpportunity && selectedOpportunity.id === updated.id) {
      setSelectedOpportunity(updated);
    }
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  const handleResetData = () => {
    const fresh = getInitialOpportunities();
    setOpportunities(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
    setInsightSelectedId(fresh[0].id);
    setSelectedCountry('ALL');
    setSearchQuery('');
    setEntityTypeFilter('all');
    setNeedsAttentionOnly(false);
    setActiveQuickFilter('all');
    setResetNotification('✨ Fresh ASEAN demo pipeline restored!');
    setTimeout(() => setResetNotification(null), 3000);
  };

  const handleAddHistoryNote = (id: string, note: string) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const days = Math.max(1, daysBetween(o.created, todayStr()));
        return {
          ...o,
          history: [...o.history, `D${days} ${note}`],
          notes: [...(o.notes || []), note],
        };
      })
    );
  };

  const handleUpdateHistoryMilestone = (id: string, index: number, newText: string) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const newHistory = [...o.history];
        newHistory[index] = newText.trim();
        return {
          ...o,
          history: newHistory,
        };
      })
    );
    if (selectedOpportunity && selectedOpportunity.id === id) {
      const updatedHistory = [...selectedOpportunity.history];
      updatedHistory[index] = newText.trim();
      setSelectedOpportunity({
        ...selectedOpportunity,
        history: updatedHistory,
      });
    }
  };

  const handleDeleteHistoryMilestone = (id: string, index: number) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const newHistory = o.history.filter((_, i) => i !== index);
        return {
          ...o,
          history: newHistory,
        };
      })
    );
    if (selectedOpportunity && selectedOpportunity.id === id) {
      const updatedHistory = selectedOpportunity.history.filter((_, i) => i !== index);
      setSelectedOpportunity({
        ...selectedOpportunity,
        history: updatedHistory,
      });
    }
  };

  const handleCompleteAction = (o: DealOpportunity) => {
    const days = Math.max(1, daysBetween(o.created, todayStr()));
    const updated: DealOpportunity = {
      ...o,
      nextAction: 'Schedule partner check-in call',
      nextDue: inDays(4),
      stalled: false,
      history: [...o.history, `D${days} Completed: ${o.nextAction}`],
    };
    handleUpdateOpportunity(updated);
  };

  // Stats calculation
  const stats: PipelineStats = useMemo(() => {
    const total = opportunities.length;
    const outcomes = opportunities.filter((o) => o.stage === 'Outcome').length;
    const overdue = opportunities.filter(
      (o) => o.nextDue && daysBetween(todayStr(), o.nextDue) < 0
    ).length;
    const stalled = opportunities.filter((o) => Boolean(o.stalled)).length;

    const qDays = opportunities
      .map(daysToQualified)
      .filter((n): n is number => n !== null);

    return {
      total,
      outcomes,
      overdue,
      stalled,
      totalPipelineValue: '$4.2M',
      medianDaysToQualified: median(qDays),
    };
  }, [opportunities]);

  // Filtering opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((o) => {
      // Country filter
      if (selectedCountry !== 'ALL' && o.countryCode.toUpperCase() !== selectedCountry.toUpperCase()) {
        return false;
      }

      // Entity type filter
      if (entityTypeFilter !== 'all' && o.type !== entityTypeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          o.company.toLowerCase().includes(q) ||
          o.about.toLowerCase().includes(q) ||
          o.owner.toLowerCase().includes(q) ||
          o.nextAction.toLowerCase().includes(q) ||
          (o.contactName && o.contactName.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Quick filter
      if (activeQuickFilter === 'outcomes' && o.stage !== 'Outcome') {
        return false;
      }
      if (
        activeQuickFilter === 'overdue' &&
        (!o.nextDue || daysBetween(todayStr(), o.nextDue) >= 0)
      ) {
        return false;
      }
      if (activeQuickFilter === 'stalled' && !o.stalled) {
        return false;
      }

      // Needs attention
      if (needsAttentionOnly) {
        const isOverdue = o.nextDue && daysBetween(todayStr(), o.nextDue) < 0;
        if (!isOverdue && !o.stalled) {
          return false;
        }
      }

      return true;
    });
  }, [
    opportunities,
    selectedCountry,
    entityTypeFilter,
    searchQuery,
    activeQuickFilter,
    needsAttentionOnly,
  ]);

  const hasActiveFilters =
    selectedCountry !== 'ALL' ||
    entityTypeFilter !== 'all' ||
    Boolean(searchQuery.trim()) ||
    activeQuickFilter !== 'all' ||
    needsAttentionOnly;

  const handleResetFilters = () => {
    setSelectedCountry('ALL');
    setEntityTypeFilter('all');
    setSearchQuery('');
    setActiveQuickFilter('all');
    setNeedsAttentionOnly(false);
  };

  const openLogDealInStage = (stage: Stage) => {
    setLogModalStage(stage);
    setIsLogModalOpen(true);
  };

  const openDetailModal = (o: DealOpportunity) => {
    setSelectedOpportunity(o);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. Official Startup ASEAN Top Bar (Clean, no unused nav links) */}
      <Header onOpenLogModal={() => openLogDealInStage('Introduction')} />

      {/* Reset Notification Toast */}
      {resetNotification && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-950 text-xs py-2 px-4 text-center font-medium shadow-xs transition-all">
          {resetNotification}
        </div>
      )}

      {/* 2. Official Startup ASEAN Feature Hero / Banner */}
      <EcosystemBanner
        opportunities={opportunities}
        onResetData={handleResetData}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* 3. Stats Strip with interactive filter triggers */}
        <StatsStrip
          stats={stats}
          onFilterAll={() => setActiveQuickFilter('all')}
          onFilterOutcomes={() =>
            setActiveQuickFilter(activeQuickFilter === 'outcomes' ? 'all' : 'outcomes')
          }
          onFilterOverdue={() =>
            setActiveQuickFilter(activeQuickFilter === 'overdue' ? 'all' : 'overdue')
          }
          onFilterStalled={() =>
            setActiveQuickFilter(activeQuickFilter === 'stalled' ? 'all' : 'stalled')
          }
          activeQuickFilter={activeQuickFilter}
        />

        {/* 4. Filter Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          entityTypeFilter={entityTypeFilter}
          onEntityTypeChange={setEntityTypeFilter}
          needsAttentionOnly={needsAttentionOnly}
          onToggleNeedsAttention={() => setNeedsAttentionOnly(!needsAttentionOnly)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredOpportunities.length}
          totalCount={opportunities.length}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* 5. Main View: Board, Table, or Velocity Matrix */}
        {viewMode === 'kanban' && (
          <KanbanBoard
            opportunities={filteredOpportunities}
            onSelectOpportunity={openDetailModal}
            onMoveToStage={handleMoveToStage}
            onSnooze={handleSnooze}
            onQuickAddInStage={openLogDealInStage}
          />
        )}

        {viewMode === 'table' && (
          <TableView
            opportunities={filteredOpportunities}
            onSelectOpportunity={openDetailModal}
            onMoveToStage={handleMoveToStage}
            onSnooze={handleSnooze}
          />
        )}

        {viewMode === 'analytics' && (
          <RegionalMatrixView
            opportunities={opportunities}
            onSelectCountry={(c) => {
              setSelectedCountry(c);
              setViewMode('kanban');
            }}
            onSelectOpportunity={openDetailModal}
          />
        )}

        {/* 6. Dual Operational Panels (Follow-Up Reminders & Company Velocity Inspector) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 pt-2">
          {/* Panel 1: Follow-up Reminders */}
          <RemindersPanel
            opportunities={opportunities}
            onSnooze={handleSnooze}
            onSelectOpportunity={openDetailModal}
            onCompleteAction={handleCompleteAction}
          />

          {/* Panel 2: Company Insight & Velocity */}
          <CompanyInsightPanel
            opportunities={opportunities}
            selectedOpportunityId={insightSelectedId}
            onSelectOpportunityId={setInsightSelectedId}
            onAddHistoryNote={handleAddHistoryNote}
            onUpdateHistoryMilestone={handleUpdateHistoryMilestone}
            onDeleteHistoryMilestone={handleDeleteHistoryMilestone}
            onOpenDetailModal={openDetailModal}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Startup ASEAN</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Initiative under Malaysia&apos;s ASEAN Chairmanship &amp; MOSTI / Cradle Fund</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="https://startup-asean.org/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-700 transition-colors"
            >
              startup-asean.org
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>10 Member States Connected</span>
          </div>
        </div>
      </footer>

      {/* Log Deal Modal */}
      <LogDealModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddDeal={handleAddOpportunity}
        initialStage={logModalStage}
      />

      {/* Deal Detail / Edit Modal */}
      <DealDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        opportunity={selectedOpportunity}
        onUpdateOpportunity={handleUpdateOpportunity}
        onDeleteOpportunity={handleDeleteOpportunity}
        onMoveToStage={handleMoveToStage}
      />
    </div>
  );
}
