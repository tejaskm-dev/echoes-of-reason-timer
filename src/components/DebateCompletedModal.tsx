import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, RotateCcw } from 'lucide-react';
import type { DebateSegment, Speaker } from '../types/debate';
import { formatTimeCompact } from '../utils/time';
import {
  SEGMENT_SHORT_LABELS,
  segmentsForSpeaker,
  totalElapsedSeconds,
  totalScheduledSeconds,
} from '../utils/segments';
import { GoldDiamond } from './ClassicalDecors';

interface DebateCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartDebate: () => void;
  speakers: Speaker[];
  segments: DebateSegment[];
}

export const DebateCompletedModal: React.FC<DebateCompletedModalProps> = ({
  isOpen,
  onClose,
  onRestartDebate,
  speakers,
  segments,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti with academic gold and navy colors
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#1d4ed8', '#be123c', '#e2c285'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const propSpeakers = speakers.filter((s) => s.team === 'proposition');
  const oppSpeakers = speakers.filter((s) => s.team === 'opposition');

  const scheduled = totalScheduledSeconds(segments);
  const used = totalElapsedSeconds(segments);

  const renderBench = (bench: Speaker[], isProp: boolean) => (
    <div>
      <h4
        className={`font-cinzel tracking-wider text-[11px] font-bold uppercase pb-1 mb-2 border-b ${
          isProp ? 'text-blue-900 border-blue-900/10' : 'text-rose-900 border-rose-900/10'
        }`}
      >
        {isProp ? 'Proposition' : 'Opposition'}
      </h4>
      <div className="space-y-2 font-sans-ui text-[#293241]">
        {bench.map((sp) => {
          const own = segmentsForSpeaker(segments, sp.id);
          return (
            <div key={sp.id} className="flex flex-col gap-0.5">
              <span className="truncate font-medium">
                {sp.name}
                <span className="text-[10px] font-cinzel text-[#7b8393] ml-1.5 uppercase">
                  {sp.roleAbbr}
                </span>
              </span>
              <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 pl-0.5">
                {own.map((seg) => (
                  <span key={seg.id} className="text-[10px] text-[#5d6678] whitespace-nowrap">
                    {SEGMENT_SHORT_LABELS[seg.kind]}{' '}
                    <span
                      className={`font-num font-medium ${isProp ? 'text-blue-950' : 'text-rose-950'}`}
                    >
                      {formatTimeCompact(seg.timeRemaining)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-lg bg-[#f7f3ec] border-2 border-[#c5a059]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#606a7c] hover:text-[#181d26] hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Laurel / Award Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#ede5d8] border border-[#c5a059]/40 flex items-center justify-center mb-3 text-[#9b7632] shadow-sm">
          <Award className="w-8 h-8" />
        </div>

        <span className="font-cinzel text-xs tracking-[0.3em] text-[#9b7632] uppercase font-bold">
          Echoes of Reason
        </span>

        <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1a1f28] font-medium mt-1">
          Debate Complete
        </h2>

        <p className="font-serif-display italic text-sm text-[#5d6678] mt-1 mb-5">
          “Reason prevails — all speakers have concluded their arguments.”
        </p>

        {/* Recap Table: time left on every phase of every speech */}
        <div className="text-left p-4 rounded-2xl bg-[#ede6da]/70 border border-[#c5a059]/20 mb-6 text-xs">
          <div className="grid grid-cols-2 gap-4">
            {renderBench(propSpeakers, true)}
            {renderBench(oppSpeakers, false)}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#c5a059]/25 flex items-center justify-between text-[11px] text-[#5d6678] font-sans-ui">
            <span>
              Floor time used{' '}
              <strong className="font-num text-[#293241]">{formatTimeCompact(used)}</strong> of{' '}
              <strong className="font-num text-[#293241]">{formatTimeCompact(scheduled)}</strong>
            </span>
            <span className="font-cinzel tracking-wider uppercase text-[10px]">
              {segments.length} phases
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#c5a059]/40 bg-white hover:bg-[#ede5d6] text-[#2c3340] font-cinzel text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer"
          >
            Review Timings
          </button>
          <button
            onClick={onRestartDebate}
            className="px-6 py-2.5 rounded-full bg-[#181d26] hover:bg-[#28313e] text-white font-cinzel text-xs tracking-wider uppercase font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#c5a059]" />
            New Match
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-cinzel tracking-widest text-[#848e9f]">
          <GoldDiamond className="w-2 h-2 opacity-50" />
          <span>SCIENCE CLUB · ASIET</span>
          <GoldDiamond className="w-2 h-2 opacity-50" />
        </div>
      </div>
    </div>
  );
};
