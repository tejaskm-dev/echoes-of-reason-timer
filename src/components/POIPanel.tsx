import React from 'react';
import { Hand, X, Check, Square, Volume2 } from 'lucide-react';
import type { POIState, Speaker, RoundStage } from '../types/debate';
import { formatTime } from '../utils/time';
import { GoldDiamond } from './ClassicalDecors';

interface POIPanelProps {
  poiState: POIState;
  activeSpeaker: Speaker;
  roundStage: RoundStage;
  onAllowPOI: () => void;
  onDeclinePOI: () => void;
  onEndPOI: () => void;
}

export const POIPanel: React.FC<POIPanelProps> = ({
  poiState,
  activeSpeaker,
  onAllowPOI,
  onDeclinePOI,
  onEndPOI,
}) => {
  // If idle, return null
  if (poiState.status === 'idle') {
    return null;
  }

  const isPropositionCalling = poiState.requestingTeam === 'proposition';
  const callingTeamName = isPropositionCalling ? 'Proposition (Team 1)' : 'Opposition (Team 2)';
  const callingBadgeColor = isPropositionCalling
    ? 'bg-blue-900/10 text-blue-900 border-blue-300'
    : 'bg-rose-900/10 text-rose-900 border-rose-300';

  // 1. ACTIVE POI HUD DIALOGUE (Classical Ivory Parchment & Gold Foil Decree)
  if (poiState.status === 'active') {
    const fraction = poiState.timeRemaining / 15;
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200 select-none">
        <div className="w-full max-w-2xl bg-[#fcfaf5]/98 text-[#141822] border-2 border-[#c5a059] rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_-15px_rgba(20,15,10,0.35),0_0_0_1px_rgba(197,160,89,0.3)] backdrop-blur-xl animate-in zoom-in-95 duration-200">
          {/* Top Bar with Live Badge & End Action */}
          <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <GoldDiamond className="w-3 h-3 text-[#c5a059]" />
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.25em] font-extrabold text-[#7a5c24] uppercase">
                POINT OF INFORMATION · ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-full font-cinzel text-[11px] font-bold uppercase tracking-wider border ${callingBadgeColor}`}>
                {callingTeamName}
              </span>
              <button
                onClick={onEndPOI}
                className="px-3 py-1 rounded-full bg-[#ede5d8] hover:bg-[#dfd3bf] text-[#4d3d24] text-xs font-cinzel tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer border border-[#c5a059]/40"
                title="End POI early (Esc)"
              >
                <Square className="w-3 h-3 fill-current text-rose-700" />
                End (Esc)
              </button>
            </div>
          </div>

          {/* Center Stage: Huge Didone Countdown Numerals & Direction */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-2">
            <div className="flex items-baseline gap-4">
              <span className="font-num text-7xl sm:text-8xl lg:text-9xl font-normal text-[#121620] tracking-tight leading-none tabular-nums">
                {formatTime(poiState.timeRemaining)}
              </span>
              <div className="flex flex-col">
                <span className="font-serif-display italic text-xl sm:text-2xl text-[#2b2214] font-semibold tracking-wide">
                  “Pose your question”
                </span>
                <span className="text-xs text-[#6e614d] font-sans-ui mt-0.5">
                  15 Seconds Maximum · No Follow-ups Allowed
                </span>
              </div>
            </div>

            <button
              onClick={onEndPOI}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#121620] hover:bg-[#252f40] text-amber-200 font-cinzel text-xs tracking-widest uppercase font-bold shadow-md transition-all active:scale-95 cursor-pointer border border-[#c5a059]"
            >
              Conclude POI
            </button>
          </div>

          {/* Noble Golden Countdown Progress Bar */}
          <div className="w-full bg-[#e8ded0] h-2.5 rounded-full overflow-hidden mt-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#8a6828] via-[#c5a059] to-[#e4c278] h-full rounded-full transition-all duration-200"
              style={{ width: `${fraction * 100}%` }}
            />
          </div>

          {/* Underneath Clarification */}
          <div className="flex items-center justify-between text-xs text-[#6e614d] font-sans-ui mt-3 pt-2.5 border-t border-[#c5a059]/20">
            <span className="flex items-center gap-1.5 text-[#7a5c24] font-medium">
              <Volume2 className="w-3.5 h-3.5" />
              Main speaker's 4:00 timer continues running underneath
            </span>
            <span className="font-cinzel text-[11px] text-[#554734]">
              Accepted this speech: <strong>{activeSpeaker.poisAccepted + 1}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. REQUESTED POI DECISION DIALOGUE (Classical Ivory Parchment Decree)
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-[#fcfaf5]/98 text-[#141822] border-2 border-[#c5a059] rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_-15px_rgba(20,15,10,0.35),0_0_0_1px_rgba(197,160,89,0.3)] backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-[#8a6828] animate-bounce" />
            <GoldDiamond className="w-2.5 h-2.5 text-[#c5a059]" />
            <span className="font-cinzel text-xs sm:text-sm tracking-[0.25em] font-extrabold text-[#7a5c24] uppercase">
              POINT OF INFORMATION OFFERED
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#ede5d8] text-[#7a5c24] text-[11px] font-cinzel font-bold border border-[#c5a059]/40">
            Awaiting Moderator
          </span>
        </div>

        <p className="font-serif-display text-xl sm:text-2xl text-[#141822] my-4 leading-snug">
          <strong className="text-[#8a6828]">{callingTeamName}</strong> rises to offer a Point of Information to{' '}
          <strong>{activeSpeaker.role} ({activeSpeaker.name})</strong>.
        </p>

        <p className="text-xs font-serif-display italic text-[#6e614d] mb-4">
          If accepted, the speaker will be given 15 seconds. The main 4:00 timer will continue running uninterrupted.
        </p>

        <div className="flex items-center gap-3.5 mt-2">
          <button
            onClick={onDeclinePOI}
            className="flex-1 py-3 px-4 rounded-full border border-gray-300 bg-white/80 hover:bg-white text-[#4d3d24] font-cinzel text-xs tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 text-rose-700" />
            Decline POI (Esc)
          </button>

          <button
            onClick={onAllowPOI}
            className="flex-1 py-3 px-4 rounded-full bg-[#121620] hover:bg-[#252f40] text-amber-200 font-cinzel text-xs tracking-wider uppercase font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#c5a059]"
          >
            <Check className="w-4 h-4 text-amber-300" />
            Accept POI (15s)
          </button>
        </div>
      </div>
    </div>
  );
};
