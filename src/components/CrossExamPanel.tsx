import React from 'react';
import { MessagesSquare, Mic, SkipForward } from 'lucide-react';
import type { DebateSegment, Speaker } from '../types/debate';
import { formatTime } from '../utils/time';
import { GoldDiamond } from './ClassicalDecors';

interface CrossExamPanelProps {
  activeSegment: DebateSegment;
  activeSpeaker: Speaker;
  /** Label of the next segment, used on the advance button ("Reply", "Next Speaker"...). */
  nextSegmentLabel?: string;
  onAdvance: () => void;
  variant?: 'stage' | 'grand';
}

/**
 * Banner shown while a cross-questioning or reply segment holds the floor.
 * These phases ARE the main clock, so rather than overlay the stage the banner
 * takes the motion's slot for the minute it runs — no layout shift, nothing
 * obscured, and the room gets the rule it needs instead of a motion it has
 * already heard.
 */
export const CrossExamPanel: React.FC<CrossExamPanelProps> = ({
  activeSegment,
  activeSpeaker,
  nextSegmentLabel,
  onAdvance,
  variant = 'stage',
}) => {
  if (activeSegment.kind !== 'cross' && activeSegment.kind !== 'reply') {
    return null;
  }

  const isCross = activeSegment.kind === 'cross';
  const isProp = activeSpeaker.team === 'proposition';
  const questioningTeam = isProp ? 'Opposition' : 'Proposition';

  const fraction = Math.max(
    0,
    Math.min(1, activeSegment.timeRemaining / Math.max(1, activeSegment.totalDuration))
  );

  const accent = isCross
    ? isProp
      ? 'border-rose-500/70 bg-rose-950/95'
      : 'border-blue-500/70 bg-blue-950/95'
    : isProp
    ? 'border-blue-500/70 bg-blue-950/95'
    : 'border-rose-500/70 bg-rose-950/95';

  return (
    <div
      className={`relative z-20 w-full mx-auto px-4 animate-in fade-in zoom-in-95 duration-300 ${
        variant === 'grand' ? 'max-w-4xl xl:max-w-5xl' : 'max-w-5xl xl:max-w-6xl'
      }`}
    >
      <div
        className={`rounded-2xl sm:rounded-3xl border-2 ${accent} text-amber-100 shadow-[0_18px_48px_-12px_rgba(10,8,5,0.6)] backdrop-blur-md px-4 sm:px-6 py-3 select-none`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Phase identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            {isCross ? (
              <MessagesSquare className="w-4 h-4 text-amber-300 shrink-0" />
            ) : (
              <Mic className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.22em] uppercase font-extrabold leading-tight">
                {isCross ? 'Cross-Questioning' : 'Reply'}
                <span className="text-amber-300/70"> · 1:00</span>
              </span>
              <span className="font-serif-display italic text-xs sm:text-sm text-amber-200/85 truncate">
                {isCross
                  ? `${questioningTeam} questions ${activeSpeaker.roleAbbr} · one questioner at a time`
                  : `${activeSpeaker.roleAbbr} (${activeSpeaker.name}) replies uninterrupted`}
              </span>
            </div>
          </div>

          {/* Countdown & advance */}
          <div className="flex items-center gap-3 shrink-0">
            <GoldDiamond className="hidden sm:block w-2.5 h-2.5 text-amber-300/70" />
            <span className="font-num text-3xl sm:text-4xl tabular-nums leading-none text-white">
              {formatTime(activeSegment.timeRemaining)}
            </span>
            {nextSegmentLabel && (
              <button
                type="button"
                onClick={onAdvance}
                title={`Advance to ${nextSegmentLabel} (N)`}
                className="px-3 py-1.5 rounded-full bg-amber-300/15 hover:bg-amber-300/25 border border-amber-300/50 text-amber-100 font-cinzel text-[10px] tracking-wider uppercase font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <SkipForward className="w-3 h-3" />
                <span className="hidden sm:inline">{nextSegmentLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Countdown bar */}
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="bg-gradient-to-r from-[#8a6828] via-[#c5a059] to-[#f0d494] h-full rounded-full transition-all duration-200"
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
