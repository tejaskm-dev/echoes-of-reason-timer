import React from 'react';
import type { DebateSegment, Speaker } from '../types/debate';
import { SEGMENT_GLYPHS, SEGMENT_SHORT_LABELS } from '../utils/segments';

interface ProgressIndicatorProps {
  speakingOrder: Speaker[];
  segments: DebateSegment[];
  currentSegmentIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * Fourteen-bead running order: each of the four main speeches shows its
 * Speech / Q&A / Reply phases clustered together, closings show a single bead.
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  speakingOrder,
  segments,
  currentSegmentIndex,
  onSelectIndex,
}) => {
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentSegmentIndex / (segments.length - 1 || 1)) * 100)
  );

  return (
    <div className="flex flex-col items-center justify-center my-0.5 select-none">
      <div className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[560px]">
        {/* Background track horizontal line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[1.5px] bg-[#c5a059]/25 z-0" />

        {/* Dynamic active progress fill line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#886729] via-[#c5a059] to-[#ebd08c] z-0 transition-all duration-500 ease-out"
          style={{ width: `calc((100% - 32px) * ${progressPercent / 100})` }}
        />

        {/* Phase beads, clustered per speaker */}
        <div className="relative z-10 flex items-center justify-between w-full px-2">
          {speakingOrder.map((speaker) => {
            const ownSegments = segments
              .map((seg, idx) => ({ seg, idx }))
              .filter(({ seg }) => seg.speakerId === speaker.id);
            const isProp = speaker.team === 'proposition';

            return (
              <div key={speaker.id} className="flex items-center gap-0.5">
                {ownSegments.map(({ seg, idx }) => {
                  const isActive = idx === currentSegmentIndex;
                  const isCompleted = seg.hasRun && !isActive;
                  const isSpeech = seg.kind === 'speech';

                  return (
                    <button
                      key={seg.id}
                      onClick={() => onSelectIndex(idx)}
                      title={`${idx + 1}. ${speaker.role} (${isProp ? 'Proposition' : 'Opposition'}) · ${
                        SEGMENT_SHORT_LABELS[seg.kind]
                      }`}
                      className="group relative flex items-center justify-center focus:outline-none cursor-pointer p-0.5 transition-transform duration-200 hover:scale-110 active:scale-95"
                      aria-label={`Go to ${speaker.role} ${SEGMENT_SHORT_LABELS[seg.kind]}`}
                    >
                      {isActive ? (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-6 h-6 rounded-full bg-[#c5a059]/35 animate-progress-ping pointer-events-none" />
                          <div className="w-5 h-5 rounded-full border-2 border-[#121620] flex items-center justify-center bg-[#faf7f2] shadow-sm transition-transform group-hover:scale-110">
                            <span className="font-cinzel text-[8px] font-black text-[#121620] leading-none">
                              {SEGMENT_GLYPHS[seg.kind]}
                            </span>
                          </div>
                        </div>
                      ) : isCompleted ? (
                        <div
                          className={`rounded-full bg-[#c5a059] border border-white/80 shadow-2xs group-hover:scale-125 transition-all duration-200 ${
                            isSpeech ? 'w-3 h-3' : 'w-2 h-2'
                          }`}
                        />
                      ) : (
                        <div
                          className={`rounded-full bg-[#a39782] group-hover:bg-[#1b222d] group-hover:scale-125 transition-all duration-200 ${
                            isSpeech ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'
                          }`}
                        />
                      )}

                      {/* Tooltip on hover with official role, team and phase */}
                      <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-[#171b22] text-white text-[10px] font-sans-ui px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-md z-20">
                        {speaker.roleAbbr} ({isProp ? 'Prop' : 'Opp'}) · {SEGMENT_SHORT_LABELS[seg.kind]}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
