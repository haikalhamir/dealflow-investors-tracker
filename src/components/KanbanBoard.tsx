import React, { useState } from 'react';
import { DealOpportunity, Stage } from '../types';
import { STAGES } from '../utils/dealEngine';
import { DealCard } from './DealCard';

interface KanbanBoardProps {
  opportunities: DealOpportunity[];
  onSelectOpportunity: (o: DealOpportunity) => void;
  onMoveToStage: (id: string, targetStage: Stage) => void;
  onSnooze: (id: string, days: number) => void;
  onQuickAddInStage: (stage: Stage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  opportunities,
  onSelectOpportunity,
  onMoveToStage,
  onSnooze,
  onQuickAddInStage,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<Stage | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', id);
    } catch {
      // Fallback
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setHoveredStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoveredStage !== stage) {
      setHoveredStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    if (hoveredStage === stage) {
      setHoveredStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    setHoveredStage(null);
    if (!draggedId) return;
    onMoveToStage(draggedId, stage);
    setDraggedId(null);
  };

  const stageHeaderColors: Record<Stage, { title: string; border: string }> = {
    Introduction: { title: 'text-slate-600', border: 'border-slate-200' },
    Qualified: { title: 'text-blue-700', border: 'border-blue-200' },
    Meeting: { title: 'text-amber-700', border: 'border-amber-200' },
    Negotiation: { title: 'text-teal-700', border: 'border-teal-200' },
    Outcome: { title: 'text-emerald-700', border: 'border-emerald-200' },
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Your Pipeline — ASEAN Investors &amp; Corporate Pilots
        </h2>
        <span className="text-xs text-slate-500">
          Drag cards across stages · Stage suggestions automatically analyze next action
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STAGES.map((stage) => {
          const items = opportunities.filter((o) => o.stage === stage);
          const isHovered = hoveredStage === stage;
          const styling = stageHeaderColors[stage];

          return (
            <div
              key={stage}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={(e) => handleDragLeave(e, stage)}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex flex-col rounded-xl border p-2.5 min-h-[380px] transition-colors ${
                isHovered
                  ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400/40'
                  : 'border-slate-200 bg-slate-100/60 hover:border-slate-300'
              }`}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between border-b pb-2 px-1 mb-2.5 ${styling.border}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase font-mono ${styling.title}`}
                  >
                    {stage}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 tabular-nums">
                    {items.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onQuickAddInStage(stage)}
                  className="cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
                  title={`Add opportunity to ${stage}`}
                >
                  +
                </button>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5">
                {items.length > 0 ? (
                  items.map((o) => (
                    <DealCard
                      key={o.id}
                      opportunity={o}
                      onSelect={onSelectOpportunity}
                      onMoveToStage={onMoveToStage}
                      onSnooze={onSnooze}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedId === o.id}
                    />
                  ))
                ) : (
                  <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/80 p-4 text-center">
                    <span className="text-xs text-slate-400">No deals in {stage}</span>
                    <button
                      type="button"
                      onClick={() => onQuickAddInStage(stage)}
                      className="mt-2 text-[11px] font-medium text-amber-700 hover:text-amber-800 underline"
                    >
                      + Add to {stage}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
