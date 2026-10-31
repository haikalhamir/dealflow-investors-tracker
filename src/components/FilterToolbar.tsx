import React from 'react';
import { ViewMode, EntityType } from '../types';
import { Search, LayoutGrid, ListFilter, BarChart3, X } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  entityTypeFilter: EntityType | 'all';
  onEntityTypeChange: (type: EntityType | 'all') => void;
  needsAttentionOnly: boolean;
  onToggleNeedsAttention: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  entityTypeFilter,
  onEntityTypeChange,
  needsAttentionOnly,
  onToggleNeedsAttention,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search partner, pilot topic, or contact..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Entity Type Selector */}
        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => onEntityTypeChange('all')}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              entityTypeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onEntityTypeChange('investor')}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              entityTypeFilter === 'investor'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Investors
          </button>
          <button
            type="button"
            onClick={() => onEntityTypeChange('corporate')}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              entityTypeFilter === 'corporate'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corporates
          </button>
          <button
            type="button"
            onClick={() => onEntityTypeChange('government')}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              entityTypeFilter === 'government'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Govt / Grants
          </button>
        </div>

        {/* Needs Attention Toggle */}
        <button
          type="button"
          onClick={onToggleNeedsAttention}
          className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            needsAttentionOnly
              ? 'border-amber-400 bg-amber-100 text-amber-900'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {needsAttentionOnly ? '⚠ Needs Attention (Active)' : 'Needs Attention'}
        </button>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="cursor-pointer text-xs text-amber-700 hover:text-amber-800 hover:underline px-1 font-medium"
          >
            Clear ({totalFilteredCount}/{totalCount})
          </button>
        )}

        {/* View Mode Switcher */}
        <div className="ml-auto flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`cursor-pointer inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kanban Pipeline Board"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`cursor-pointer inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Table List View"
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('analytics')}
            className={`cursor-pointer inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              viewMode === 'analytics'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Regional Velocity & Analytics"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Velocity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
