import React from 'react';
import { SkipForward } from 'lucide-react';
import type { DebateSegment, Speaker } from '../types/debate';
import { formatTime } from '../utils/time';
import {
  CrossedQuillsEmblem,
  FiligreeCornerOrnament,
  GildedCountdownRail,
  GoldDiamond,
  LaurelGarlandBand,
  ReplyRostrumEmblem,
} from './ClassicalDecors';

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
 * These phases ARE the main clock, so rather than overlay the stage it takes
 * the motion cartouche's slot for the minute it runs — and it is built from
 * the same regalia as that cartouche (gilded rules, filigree corners, an
 * engraved emblem, a Greek key fret) so the stage keeps one visual language.
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

  const fraction = activeSegment.timeRemaining / Math.max(1, activeSegment.totalDuration);
  const isFinalTen = activeSegment.timeRemaining <= 10;

  // Cross-questioning is carried by the bench opposite the speaker, so the
  // plaque takes that bench's colour; the reply returns it to the speaker's.
  const floorIsProp = isCross ? !isProp : isProp;
  const plaque = floorIsProp
    ? 'from-[#0a1226] via-[#111d38] to-[#0a1226]'
    : 'from-[#25060f] via-[#3c0c1b] to-[#25060f]';

  return (
    <div
      className={`relative z-20 w-full mx-auto px-4 animate-in fade-in zoom-in-95 duration-300 ${
        variant === 'grand' ? 'max-w-4xl xl:max-w-5xl' : 'max-w-5xl xl:max-w-6xl'
      }`}
    >
      <div
        className={`relative rounded-2xl sm:rounded-3xl bg-gradient-to-r ${plaque} border-2 border-[#c5a059] shadow-[0_16px_44px_-12px_rgba(10,8,5,0.6),0_0_0_1px_rgba(197,160,89,0.25)_inset] overflow-hidden select-none`}
      >
        {/* Engraved marble sheen across the plaque face */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.16] bg-[radial-gradient(ellipse_at_28%_-20%,#ffffff_0%,transparent_58%)]" />

        {/* Laurel frieze across the head of the plaque, run between the corner
            ornaments so the rounded corners never clip it. The bottom edge is
            left to the countdown rail rather than doubling up on gold. */}
        <LaurelGarlandBand className="absolute top-2 inset-x-9 h-3.5 opacity-75" />

        {/* Gilded hairline inset & corner filigree, as on the motion cartouche */}
        <div className="absolute inset-1.5 rounded-xl sm:rounded-2xl border border-[#c5a059]/30 pointer-events-none" />
        <FiligreeCornerOrnament position="top-left" className="absolute top-1 left-1 w-5 h-5 opacity-80" />
        <FiligreeCornerOrnament position="top-right" className="absolute top-1 right-1 w-5 h-5 opacity-80" />
        <FiligreeCornerOrnament position="bottom-left" className="absolute bottom-1 left-1 w-5 h-5 opacity-80" />
        <FiligreeCornerOrnament position="bottom-right" className="absolute bottom-1 right-1 w-5 h-5 opacity-80" />

        {/* Padding steps up only on wide stages: the motion cartouche this
            replaces gets shorter as the viewport narrows, and the banner has
            to stay within its slot so the stage never shifts */}
        <div className="relative z-10 px-5 sm:px-9 pt-4 xl:pt-6 pb-3 xl:pb-4">
          <div className="flex items-center justify-between gap-3 sm:gap-5">
            {/* Engraved emblem & phase legend */}
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <div className={isCross ? 'animate-subtle-float' : undefined}>
                {isCross ? (
                  <CrossedQuillsEmblem className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]" />
                ) : (
                  <ReplyRostrumEmblem className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="flex items-center gap-2 font-cinzel text-sm sm:text-base tracking-[0.26em] uppercase font-extrabold text-[#f7e8c4] leading-tight">
                  <span className="truncate">{isCross ? 'Cross-Questioning' : 'Reply'}</span>
                  <GoldDiamond className="w-2 h-2 shrink-0 opacity-90" />
                  <span className="font-num tracking-normal text-[#e2c078]">1:00</span>
                </span>
                <span className="font-serif-display italic text-sm sm:text-[15px] text-[#dcc9a2] mt-1 truncate">
                  {isCross
                    ? `${questioningTeam} questions ${activeSpeaker.roleAbbr} · one questioner at a time`
                    : `${activeSpeaker.roleAbbr} (${activeSpeaker.name}) replies uninterrupted`}
                </span>
              </div>
            </div>

            {/* Countdown in a cast bezel, and the advance control */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div
                className={`relative px-3.5 sm:px-4 py-0.5 rounded-xl border bg-black/35 ${
                  isFinalTen ? 'border-amber-300 shadow-[0_0_18px_rgba(226,192,120,0.45)]' : 'border-[#c5a059]/70'
                }`}
              >
                <span
                  className={`font-num text-3xl sm:text-4xl tabular-nums leading-none ${
                    isFinalTen ? 'text-amber-200' : 'text-[#fdf6e6]'
                  }`}
                >
                  {formatTime(activeSegment.timeRemaining)}
                </span>
                {/* Bezel rivets */}
                <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#e2c078]/80" />
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#e2c078]/80" />
                <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#e2c078]/80" />
                <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#e2c078]/80" />
              </div>

              {nextSegmentLabel && (
                <button
                  type="button"
                  onClick={onAdvance}
                  title={`Advance to ${nextSegmentLabel} (N)`}
                  className="px-3.5 py-2 rounded-full bg-[#c5a059]/12 hover:bg-[#c5a059]/25 border border-[#c5a059]/70 hover:border-[#e2c078] text-[#f5e3b8] font-cinzel text-[10px] tracking-[0.18em] uppercase font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <SkipForward className="w-3 h-3" />
                  <span className="hidden sm:inline">{nextSegmentLabel}</span>
                </button>
              )}
            </div>
          </div>

          {/* Gilded countdown rail with cast palmette caps */}
          <GildedCountdownRail fraction={fraction} className="mt-3 px-0.5" />
        </div>
      </div>
    </div>
  );
};
