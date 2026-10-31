import React from 'react';
import { AseanEmblem } from './AseanEmblem';

interface HeaderProps {
  onOpenLogModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Brand title wordmark with ASEAN emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <AseanEmblem size={28} />
          <a
            href="/"
            onClick={(e) => e.preventDefault()}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 transition-colors hover:text-amber-600"
          >
            Startup ASEAN <span className="font-normal text-slate-400">/ DealFlow</span>
          </a>
        </div>

        {/* Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenLogModal}
            className="cursor-pointer rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold tracking-wide text-slate-950 transition-all hover:bg-amber-300 active:scale-98 whitespace-nowrap shrink-0 shadow-xs border border-amber-500/30"
          >
            + Log Deal
          </button>
        </div>
      </div>
    </header>
  );
};
