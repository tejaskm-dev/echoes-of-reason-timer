import React from 'react';
import type { Speaker } from '../types/debate';

interface ProgressIndicatorProps {
  speakingOrder: Speaker[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  speakingOrder,
  currentIndex,
  onSelectIndex,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentIndex / (speakingOrder.length - 1 || 1)) * 100));

  return (
    <div className="flex flex-col items-center justify-center my-1 sm:my-1.5 select-none">
      <div className="relative flex items-center justify-center w-full max-w-[340px] sm:max-w-[420px]">
        {/* Background track horizontal line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[1.5px] bg-[#c5a059]/25 z-0" />

        {/* Dynamic active progress fill line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#886729] via-[#c5a059] to-[#ebd08c] z-0 transition-all duration-500 ease-out"
          style={{ width: `calc((100% - 32px) * ${progressPercent / 100})` }}
        />

        {/* 6 Speaker Nodes in Official Asian Parliamentary Order */}
        <div className="relative z-10 flex items-center justify-between w-full px-2">
          {speakingOrder.map((speaker, index) => {
            const isActive = index === currentIndex;
            const isCompleted = speaker.hasSpoken && !isActive;
            const isProp = speaker.team === 'proposition';

            return (
              <button
                key={speaker.id}
                onClick={() => onSelectIndex(index)}
                title={`${index + 1}. ${speaker.role} (${isProp ? 'Proposition' : 'Opposition'}): ${speaker.name}`}
                className="group relative flex items-center justify-center focus:outline-none cursor-pointer p-1.5 transition-transform duration-200 hover:scale-110 active:scale-95"
                aria-label={`Go to ${speaker.role}`}
              >
                {/* Active Concentric Outer Ring with Radiant Ping */}
                {isActive ? (
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-6 h-6 rounded-full bg-[#c5a059]/35 animate-progress-ping pointer-events-none" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#121620] flex items-center justify-center bg-[#faf7f2] shadow-sm transition-transform group-hover:scale-110">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#121620]" />
                    </div>
                  </div>
                ) : isCompleted ? (
                  <div className="w-3 h-3 rounded-full bg-[#c5a059] border border-white/80 shadow-2xs group-hover:scale-125 transition-all duration-200" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a39782] group-hover:bg-[#1b222d] group-hover:scale-125 transition-all duration-200" />
                )}

                {/* Tooltip on hover with official role and team */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-[#171b22] text-white text-[10px] font-sans-ui px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-md">
                  {index + 1}. {speaker.roleAbbr} ({isProp ? 'Prop' : 'Opp'})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
