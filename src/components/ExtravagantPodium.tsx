import React, { useState } from 'react';
import { Edit2, Check, MessagesSquare, Mic } from 'lucide-react';
import type { DebateSegment, Speaker, TeamType } from '../types/debate';
import { formatTimeCompact } from '../utils/time';
import {
  SEGMENT_GLYPHS,
  SEGMENT_SHORT_LABELS,
  segmentsForSpeaker,
  speakerDisplaySegment,
} from '../utils/segments';
import { 
  GoldDiamond, 
  ImperialLaurelCrown, 
  BaroqueAcanthusPediment, 
  FiligreeCornerOrnament, 
  CrossExamMedallionEmblem,
  CorinthianCapitalPilaster,
  ImperialDebateSeal
} from './ClassicalDecors';

interface ExtravagantPodiumProps {
  teamType: TeamType;
  teamName: string;
  onUpdateTeamName: (name: string) => void;
  speakers: Speaker[];
  segments: DebateSegment[];
  activeSegment: DebateSegment;
  activeSpeakerId: string;
  onSelectSpeaker: (id: string) => void;
  onSelectSegment: (segmentId: string) => void;
  onUpdateSpeakerName: (id: string, name: string) => void;
}

export const ExtravagantPodium: React.FC<ExtravagantPodiumProps> = ({
  teamType,
  teamName,
  onUpdateTeamName,
  speakers,
  segments,
  activeSegment,
  activeSpeakerId,
  onSelectSpeaker,
  onSelectSegment,
  onUpdateSpeakerName,
}) => {
  const isProp = teamType === 'proposition';

  // This bench asks the questions whenever the floor belongs to the other side
  const isOpposingActiveSpeaker = !speakers.some((s) => s.id === activeSpeakerId);
  const crossSegment = segments.find(
    (seg) => seg.speakerId === activeSpeakerId && seg.kind === 'cross'
  );
  const showCrossCard = isOpposingActiveSpeaker && Boolean(crossSegment);
  const isCrossLive = activeSegment.kind === 'cross';

  // Team Name Editing State
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamVal, setEditTeamVal] = useState(teamName);

  // Speaker Name Editing State
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [editSpeakerVal, setEditSpeakerVal] = useState('');

  const handleSaveTeamName = () => {
    if (editTeamVal.trim()) {
      onUpdateTeamName(editTeamVal.trim());
    }
    setIsEditingTeam(false);
  };

  return (
    <div className="w-[290px] sm:w-[315px] md:w-[335px] lg:w-[360px] xl:w-[385px] 2xl:w-[415px] flex flex-col items-center shrink-0 select-none transition-all duration-300">
      {/* 1. Sculpted Gilded Neoclassical Pediment Crown */}
      <div className="w-full relative z-20 -mb-2.5">
        <BaroqueAcanthusPediment teamType={teamType} className="w-full drop-shadow-md" />
      </div>

      {/* 2. Freestanding Carrara Marble Monument Body */}
      <div className="w-full relative z-10 bg-[#fcfaf6]/94 backdrop-blur-md rounded-b-[24px] border-2 border-[#c5a059]/60 shadow-[0_16px_40px_-10px_rgba(20,16,10,0.22),0_0_0_1px_rgba(255,255,255,0.85)_inset] p-3 sm:p-4 pt-3.5">
        {/* Four Classical Filigree Corner Brackets */}
        <FiligreeCornerOrnament position="top-left" className="absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="top-right" className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />

        {/* Flanking Corinthian Pilaster Capitals */}
        <CorinthianCapitalPilaster side="left" className="absolute top-3 left-1 w-2.5 sm:w-3 h-[92%] opacity-60 pointer-events-none" />
        <CorinthianCapitalPilaster side="right" className="absolute top-3 right-1 w-2.5 sm:w-3 h-[92%] opacity-60 pointer-events-none" />

        {/* Podium Inner Content */}
        <div className="relative z-10 flex flex-col justify-between">
          {/* Imperial Laurel Wreath & Celestial Star Crest */}
          <div className="flex justify-center -mt-1 mb-0.5">
            <ImperialLaurelCrown className="w-24 sm:w-28 h-9 sm:h-10" />
          </div>

          {/* Team Name Header (Editable) */}
          <div className="text-center pb-2 mb-2 border-b border-[#c5a059]/35">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#c5a059]" />
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-[#8d6928] uppercase font-bold opacity-95">
                {isProp ? 'AFFIRMATIVE BENCH' : 'NEGATIVE BENCH'}
              </span>
              <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#c5a059]" />
            </div>
            {isEditingTeam ? (
              <div className="flex items-center justify-center gap-1.5 my-0.5">
                <input
                  type="text"
                  value={editTeamVal}
                  onChange={(e) => setEditTeamVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTeamName();
                    else if (e.key === 'Escape') setIsEditingTeam(false);
                  }}
                  autoFocus
                  className="bg-white text-lg font-serif-display font-bold px-2 py-0.5 rounded border border-[#c5a059] outline-none text-center w-48 shadow-inner text-[#0c1017]"
                />
                <button
                  type="button"
                  onClick={handleSaveTeamName}
                  className="p-1 rounded bg-[#c5a059]/20 text-[#8a6828] hover:bg-[#c5a059]/40 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <h3
                onClick={() => {
                  setEditTeamVal(teamName);
                  setIsEditingTeam(true);
                }}
                title="Click to edit team name"
                className={`font-serif-display text-2xl sm:text-3xl xl:text-[32px] font-bold tracking-tight cursor-pointer hover:text-[#8a6828] transition-colors leading-tight drop-shadow-xs ${
                  isProp ? 'text-[#0a1c36]' : 'text-[#360914]'
                }`}
              >
                {teamName}
              </h3>
            )}

            {/* Classical Motto with Centered Gold Diamond Divider */}
            <div className="flex items-center justify-center gap-2 mt-1 opacity-90">
              <div className="h-[0.5px] w-6 bg-gradient-to-r from-transparent to-[#c5a059]" />
              <GoldDiamond className="w-2 h-2" />
              <span className="font-serif-display italic text-[11px] sm:text-xs text-[#6e5322] tracking-wide">
                {isProp ? 'Truth Seeks Bolder Questions' : 'A Stronger Tomorrow Questions Today'}
              </span>
              <GoldDiamond className="w-2 h-2" />
              <div className="h-[0.5px] w-6 bg-gradient-to-l from-transparent to-[#c5a059]" />
            </div>
          </div>

          {/* 3 Opulent Bevelled Speaker Inlays */}
          <div className="flex flex-col gap-1.5 my-0.5">
            {speakers.map((sp, idx) => {
              const isActive = sp.id === activeSpeakerId;
              const isEditingSp = editingSpeakerId === sp.id;
              const ownSegments = segmentsForSpeaker(segments, sp.id);
              const display = speakerDisplaySegment(segments, sp.id, activeSegment.id);

              return (
                <div
                  key={sp.id}
                  onClick={() => onSelectSpeaker(sp.id)}
                  className={`flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl cursor-pointer speaker-card-fluid ${
                    isActive
                      ? isProp
                        ? 'bg-gradient-to-r from-white via-[#f0f6ff] to-white border-1.5 border-blue-500/70 shadow-[0_6px_20px_-2px_rgba(59,130,246,0.38),0_0_0_1px_rgba(255,255,255,0.9)_inset] scale-[1.025] speaker-row-active-anim'
                        : 'bg-gradient-to-r from-white via-[#fff1f4] to-white border-1.5 border-rose-500/70 shadow-[0_6px_20px_-2px_rgba(225,29,72,0.38),0_0_0_1px_rgba(255,255,255,0.9)_inset] scale-[1.025] speaker-row-active-anim'
                      : 'bg-white/80 hover:bg-white border border-[#c5a059]/30 hover:border-[#c5a059]/60 shadow-2xs hover:shadow-xs hover:translate-y-[-1px]'
                  }`}
                >
                  {/* Left: Medallion Number, Name, Role Badge, Active Equalizer */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Gilded Roman Number Medallion */}
                    <div className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center shadow-2xs ${
                      isActive 
                        ? 'border-[#c5a059] bg-gradient-to-b from-[#f5e09b] to-[#c5a059] text-[#121620]'
                        : 'border-[#c5a059]/40 bg-[#faf7f2] text-[#554325]'
                    }`}>
                      <span className="font-cinzel text-[10px] sm:text-[11px] font-black leading-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {isEditingSp ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editSpeakerVal}
                          onChange={(e) => setEditSpeakerVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editSpeakerVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerVal.trim());
                              setEditingSpeakerId(null);
                            } else if (e.key === 'Escape') setEditingSpeakerId(null);
                          }}
                          autoFocus
                          className="bg-white text-xs px-2 py-0.5 rounded border border-[#c5a059] outline-none w-24 font-sans-ui text-[#121620]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editSpeakerVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerVal.trim());
                            setEditingSpeakerId(null);
                          }}
                          className="p-1 text-[#8a6828]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 min-w-0 group/sp">
                        <span className={`text-sm sm:text-base font-serif-display font-semibold truncate max-w-[125px] sm:max-w-[160px] xl:max-w-[185px] ${
                          isActive ? 'text-[#0c1017] font-bold' : 'text-[#2b3342]'
                        }`}>
                          {sp.name}
                        </span>

                        {/* Heraldic Role Badge */}
                        <span className={`text-[9px] sm:text-[10px] font-cinzel font-bold uppercase px-1.5 py-0.5 rounded border ${
                          isProp 
                            ? 'bg-blue-50 text-blue-950 border-blue-200' 
                            : 'bg-rose-50 text-rose-950 border-rose-200'
                        }`}>
                          {sp.roleAbbr}
                        </span>

                        {/* Active Soundwave Indicator */}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-400/25 text-[#7c5b1d] text-[8px] font-cinzel font-bold border border-amber-400/40">
                            {activeSegment.kind === 'cross' ? (
                              <MessagesSquare className="w-2.5 h-2.5" />
                            ) : (
                              <Mic className="w-2.5 h-2.5" />
                            )}
                            <span>{SEGMENT_SHORT_LABELS[activeSegment.kind]}</span>
                            <div className="flex items-end gap-[1.5px] h-2.5 w-2.5 pb-0.5">
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-1" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-2" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-3" />
                            </div>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSpeakerId(sp.id);
                            setEditSpeakerVal(sp.name);
                          }}
                          className="opacity-0 group-hover/sp:opacity-100 p-0.5 text-gray-400 hover:text-black transition-opacity"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Phase Pips (S/Q/R) & Remaining Time of the Live Phase */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {ownSegments.map((seg) => {
                        const isSegActive = seg.id === activeSegment.id;
                        return (
                          <button
                            key={seg.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSegment(seg.id);
                            }}
                            title={`${SEGMENT_SHORT_LABELS[seg.kind]} · ${formatTimeCompact(seg.timeRemaining)}`}
                            className={`w-4 h-4 rounded-full flex items-center justify-center font-cinzel text-[7px] font-black leading-none transition-all duration-200 cursor-pointer hover:scale-125 ${
                              isSegActive
                                ? 'bg-gradient-to-b from-[#f5e09b] to-[#c5a059] text-[#121620] ring-2 ring-[#c5a059]/45'
                                : seg.hasRun
                                ? 'bg-[#c5a059]/70 text-[#3b2f14]'
                                : 'bg-[#ece5d6] text-[#7b6c4f]'
                            }`}
                          >
                            {SEGMENT_GLYPHS[seg.kind]}
                          </button>
                        );
                      })}
                    </div>
                    <span className="font-num text-sm font-semibold tabular-nums text-[#0c1017]">
                      {formatTimeCompact(display?.timeRemaining ?? 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Imperial Brass Cross-Questioning Seal (this bench holds the questions) */}
          {showCrossCard && crossSegment && (
            <div className="mt-2.5 pt-2 border-t border-[#c5a059]/30">
              <button
                type="button"
                onClick={() => onSelectSegment(crossSegment.id)}
                title="Go to the 1-minute cross-questioning phase"
                className={`w-full py-2 rounded-xl text-amber-200 border-2 border-[#c5a059] font-cinzel text-[10px] tracking-wider uppercase font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                  isCrossLive
                    ? 'bg-gradient-to-r from-[#4a3207] via-[#6b4c12] to-[#4a3207] animate-pulse'
                    : 'bg-gradient-to-r from-[#121c2b] via-[#1c2c44] to-[#121c2b] hover:from-[#18263a] hover:to-[#18263a]'
                }`}
              >
                <CrossExamMedallionEmblem className="w-4 h-4" />
                <span>
                  {isCrossLive ? 'Cross-Questioning · Live' : 'Cross-Questioning (1:00)'}
                </span>
              </button>
            </div>
          )}

          {/* Sculpted Plinth Footer Tag with Imperial Seal */}
          <div className="pt-2 border-t border-[#c5a059]/25 mt-2 flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center gap-2">
              <GoldDiamond className="w-2 h-2 opacity-75" />
              <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.25em] text-[#755b28] uppercase font-bold opacity-85">
                {isProp ? 'ARGUE · EXPLORE · ADVANCE' : 'SCRUTINISE · CHALLENGE · PROTECT'}
              </span>
              <GoldDiamond className="w-2 h-2 opacity-75" />
            </div>
            <div className="flex justify-center -mb-0.5 opacity-90 hover:opacity-100 transition-opacity">
              <ImperialDebateSeal className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
