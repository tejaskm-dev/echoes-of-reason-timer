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
  return (
    <div className="flex flex-col items-center justify-center my-2 select-none">
      <div className="relative flex items-center justify-center">
        {/* Connecting horizontal line */}
        <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-[1px] bg-[#c5a059]/40 z-0" />

        {/* 6 Speaker Nodes in Official Asian Parliamentary Order */}
        <div className="relative z-10 flex items-center gap-7 sm:gap-9">
          {speakingOrder.map((speaker, index) => {
            const isActive = index === currentIndex;
            const isCompleted = speaker.hasSpoken && !isActive;
            const isProp = speaker.team === 'proposition';

            return (
              <button
                key={speaker.id}
                onClick={() => onSelectIndex(index)}
                title={`${index + 1}. ${speaker.role} (${isProp ? 'Proposition' : 'Opposition'}): ${speaker.name}`}
                className="group relative flex items-center justify-center focus:outline-none cursor-pointer p-1"
                aria-label={`Go to ${speaker.role}`}
              >
                {/* Active Concentric Outer Ring */}
                {isActive ? (
                  <div className="w-5 h-5 rounded-full border border-[#1b222d] flex items-center justify-center bg-[#f7f2ea]/90 shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1b222d]" />
                  </div>
                ) : isCompleted ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059] group-hover:scale-125 transition-transform" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#968b77] group-hover:bg-[#1b222d] group-hover:scale-125 transition-all" />
                )}

                {/* Tooltip on hover with official role and team */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#171b22] text-white text-[10px] font-sans-ui px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-md">
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
