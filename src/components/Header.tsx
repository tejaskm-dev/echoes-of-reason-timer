import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Keyboard, BookOpen } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
  onOpenRules: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  screenMode?: 'semifinals' | 'grand_final';
  onSelectScreenMode?: (mode: 'semifinals' | 'grand_final') => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
  onOpenRules,
  isFullscreen,
  onToggleFullscreen,
  screenMode = 'semifinals',
  onSelectScreenMode,
}) => {
  return (
    <header className="relative z-40 w-full pt-2 sm:pt-2.5 pb-1 px-5 sm:px-8 md:px-12 flex items-center justify-between select-none">
      {/* 1. Left: Echoes of Reason & DEBATE COMPETITION Masthead */}
      <div className="flex items-center gap-2 sm:gap-3 bg-[#fdfaf5]/90 border border-[#c5a059]/45 shadow-xs backdrop-blur-md rounded-full px-3.5 sm:px-4.5 py-1.5 transition-all">
        <h1 className="text-xl sm:text-2xl md:text-2xl tracking-tight font-serif-display text-[#0a0e17] flex items-baseline font-bold leading-none select-none">
          <span>Echoes</span>
          <span className="font-serif-display italic font-semibold text-[#8d6928] px-1 text-xl sm:text-2xl md:text-2xl">
            of
          </span>
          <span>Reason</span>
        </h1>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[#c5a059]/70 text-xs">|</span>
          <span className="font-cinzel text-[9px] md:text-[10px] tracking-[0.25em] text-[#3d3221] uppercase font-bold">
            DEBATE COMPETITION
          </span>
        </div>
      </div>

      {/* 2. Absolute Dead-Center Mode Switcher: 0px Movement Guaranteed */}
      {onSelectScreenMode && (
        <div className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-2.5 z-50 flex items-center p-0.5 rounded-full bg-[#fdfaf5]/90 border border-[#c5a059]/50 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => onSelectScreenMode('semifinals')}
            className={`px-3 sm:px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
              screenMode === 'semifinals'
                ? 'bg-[#18202d] text-amber-300 shadow-xs scale-[1.02]'
                : 'text-[#5d4a25] hover:text-[#18202d] hover:scale-105'
            }`}
          >
            🏛️ Semifinals
          </button>
          <button
            type="button"
            onClick={() => onSelectScreenMode('grand_final')}
            className={`px-3 sm:px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
              screenMode === 'grand_final'
                ? 'bg-[#18202d] text-amber-300 shadow-xs scale-[1.02]'
                : 'text-[#5d4a25] hover:text-[#18202d] hover:scale-105'
            }`}
          >
            👑 Grand Finale
          </button>
        </div>
      )}

      {/* 3. Right: Science Club ASIET & Moderator Tool Icons in Frosted Glass Capsule */}
      <div className="flex items-center gap-1 sm:gap-2.5 bg-[#fdfaf5]/85 border border-[#c5a059]/40 shadow-xs backdrop-blur-md rounded-full px-2.5 sm:px-3 py-1">
        <span className="hidden lg:inline font-cinzel text-[10px] tracking-[0.25em] text-[#4d3d1f] uppercase font-bold pr-1 border-r border-[#c5a059]/30">
          SCIENCE CLUB · ASIET
        </span>
        <div className="flex items-center gap-1 text-[#2c3442]">
          <button
            onClick={onOpenRules}
            title="Official Rules & Regulations"
            className="p-1 sm:px-2 sm:py-0.5 rounded-full hover:bg-black/5 text-[#2c3442] hover:text-[#0c1017] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] font-cinzel tracking-wider uppercase"
            aria-label="View Rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8d6928]" />
            <span className="hidden sm:inline text-[10px] font-bold">Rules</span>
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute debate bell (M)' : 'Unmute debate bell (M)'}
            className="p-1 rounded-full hover:bg-black/5 text-[#2c3442] hover:text-[#0c1017] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2c3442]" /> : <VolumeX className="w-3.5 h-3.5 text-red-700" />}
          </button>

          <button
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts (?)"
            className="p-1 rounded-full hover:bg-black/5 text-[#2c3442] hover:text-[#0c1017] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen stage mode'}
            className="p-1 rounded-full hover:bg-black/5 text-[#2c3442] hover:text-[#0c1017] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
