import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Keyboard, BookOpen } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
  onOpenRules: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
  onOpenRules,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="relative w-full pt-2 sm:pt-2.5 pb-0.5 px-6 md:px-12 flex items-center justify-between select-none">
      {/* 1. Left: Echoes of Reason & DEBATE COMPETITION Masthead */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl tracking-tight font-serif-display text-[#141720] flex items-baseline font-semibold leading-none">
          <span>Echoes</span>
          <span className="font-serif-display italic font-normal text-[#9e7939] px-1 text-xl sm:text-2xl md:text-3xl">
            of
          </span>
          <span>Reason</span>
        </h1>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[#c5a059]/60 text-xs">|</span>
          <span className="font-cinzel text-[9px] md:text-[10px] tracking-[0.25em] text-[#636c7e] uppercase font-bold">
            DEBATE COMPETITION
          </span>
        </div>
      </div>

      {/* 2. Right: Discreet Moderator Tool Icons */}
      <div className="flex items-center gap-1 sm:gap-2 opacity-85 hover:opacity-100 transition-opacity">
        <button
          onClick={onOpenRules}
          title="Official Rules & Regulations"
          className="px-2.5 py-1 rounded-full hover:bg-black/5 text-[#475266] transition-all btn-spring cursor-pointer flex items-center gap-1 text-[11px] font-cinzel tracking-wider uppercase border border-transparent hover:border-[#c5a059]/30"
          aria-label="View Rules"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#9e7939]" />
          <span className="hidden sm:inline text-[10px] font-bold">Rules</span>
        </button>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute debate bell (M)' : 'Unmute debate bell (M)'}
          className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] transition-all btn-spring cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#475266]" /> : <VolumeX className="w-3.5 h-3.5 text-red-700" />}
        </button>

        <button
          onClick={onOpenShortcuts}
          title="Keyboard shortcuts (?)"
          className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] transition-all btn-spring cursor-pointer"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen stage mode'}
          className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] transition-all btn-spring cursor-pointer"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
