import React, { useState } from 'react';
import { Edit2, Check, Mic } from 'lucide-react';
import type { Speaker, TeamType } from '../types/debate';
import { formatTimeCompact } from '../utils/time';
import { 
  GoldDiamond, 
  ImperialLaurelCrown, 
  BaroqueAcanthusPediment, 
  FiligreeCornerOrnament, 
  POIMedallionEmblem 
} from './ClassicalDecors';

interface ExtravagantPodiumProps {
  teamType: TeamType;
  teamName: string;
  onUpdateTeamName: (name: string) => void;
  speakers: Speaker[];
  activeSpeakerId: string;
  isOpposingActiveSpeaker: boolean;
  activeSpeakerTimeRemaining: number;
  onCallPOI: () => void;
  onSelectSpeaker: (id: string) => void;
  onUpdateSpeakerName: (id: string, name: string) => void;
}

export const ExtravagantPodium: React.FC<ExtravagantPodiumProps> = ({
  teamType,
  teamName,
  onUpdateTeamName,
  speakers,
  activeSpeakerId,
  isOpposingActiveSpeaker,
  activeSpeakerTimeRemaining,
  onCallPOI,
  onSelectSpeaker,
  onUpdateSpeakerName,
}) => {
  const isProp = teamType === 'proposition';

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
    <div className="w-[315px] sm:w-[340px] xl:w-[375px] 2xl:w-[400px] flex flex-col items-center shrink-0 select-none transition-all duration-300">
      {/* 1. Sculpted Gilded Neoclassical Pediment Crown */}
      <div className="w-full relative z-20 -mb-2.5">
        <BaroqueAcanthusPediment teamType={teamType} className="w-full drop-shadow-md" />
        {/* Ribbon Title Overlay */}
        <div className="absolute top-[52px] sm:top-[56px] left-0 right-0 flex items-center justify-center pointer-events-none">
          <span className="font-cinzel text-[9px] sm:text-[10px] font-black tracking-[0.28em] text-amber-200 uppercase drop-shadow-xs">
            {isProp ? 'PROPOSITION · TEAM 1' : 'OPPOSITION · TEAM 2'}
          </span>
        </div>
      </div>

      {/* 2. Freestanding Carrara Marble Monument Body */}
      <div className="w-full relative z-10 bg-[#fcfaf6]/94 backdrop-blur-md rounded-b-[26px] border-2 border-[#c5a059]/60 shadow-[0_20px_50px_-10px_rgba(20,16,10,0.22),0_0_0_1px_rgba(255,255,255,0.85)_inset] p-3.5 sm:p-4.5 pt-4">
        {/* Four Classical Filigree Corner Brackets */}
        <FiligreeCornerOrnament position="top-left" className="absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="top-right" className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />
        <FiligreeCornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 opacity-75" />

        {/* Podium Inner Content */}
        <div className="relative z-10 flex flex-col justify-between">
          {/* Imperial Laurel Wreath & Celestial Star Crest */}
          <div className="flex justify-center -mt-1 mb-0.5">
            <ImperialLaurelCrown className="w-24 sm:w-28 h-9 sm:h-10" />
          </div>

          {/* Team Name Header (Editable) */}
          <div className="text-center pb-2 mb-2 border-b border-[#c5a059]/35">
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
                  className="bg-white text-lg font-serif-display font-bold px-2 py-0.5 rounded border border-[#c5a059] outline-none text-center w-44 shadow-inner text-[#0c1017]"
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
                className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight cursor-pointer hover:text-[#8a6828] transition-colors leading-tight drop-shadow-xs ${
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
          <div className="flex flex-col gap-2 my-1">
            {speakers.map((sp, idx) => {
              const isActive = sp.id === activeSpeakerId;
              const isEditingSp = editingSpeakerId === sp.id;

              return (
                <div
                  key={sp.id}
                  onClick={() => onSelectSpeaker(sp.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive
                      ? isProp
                        ? 'bg-gradient-to-r from-white via-[#f0f6ff] to-white border-1.5 border-blue-500/70 shadow-[0_6px_18px_-2px_rgba(59,130,246,0.35),0_0_0_1px_rgba(255,255,255,0.9)_inset] scale-[1.02]'
                        : 'bg-gradient-to-r from-white via-[#fff1f4] to-white border-1.5 border-rose-500/70 shadow-[0_6px_18px_-2px_rgba(225,29,72,0.35),0_0_0_1px_rgba(255,255,255,0.9)_inset] scale-[1.02]'
                      : 'bg-white/80 hover:bg-white border border-[#c5a059]/30 hover:border-[#c5a059]/60 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Left: Medallion Number, Name, Role Badge, Active Equalizer */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Gilded Roman Number Medallion */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shadow-2xs ${
                      isActive 
                        ? 'border-[#c5a059] bg-gradient-to-b from-[#f5e09b] to-[#c5a059] text-[#121620]'
                        : 'border-[#c5a059]/40 bg-[#faf7f2] text-[#554325]'
                    }`}>
                      <span className="font-cinzel text-[10px] font-black leading-none">
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
                        <span className={`text-sm font-serif-display font-semibold truncate max-w-[110px] ${
                          isActive ? 'text-[#0c1017] font-bold' : 'text-[#2b3342]'
                        }`}>
                          {sp.name}
                        </span>

                        {/* Heraldic Role Badge */}
                        <span className={`text-[9px] font-cinzel font-bold uppercase px-1.5 py-0.2 rounded border ${
                          isProp 
                            ? 'bg-blue-50 text-blue-950 border-blue-200' 
                            : 'bg-rose-50 text-rose-950 border-rose-200'
                        }`}>
                          {sp.roleAbbr}
                        </span>

                        {/* Active Soundwave Indicator */}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-400/25 text-[#7c5b1d] text-[8px] font-cinzel font-bold border border-amber-400/40">
                            <Mic className="w-2 h-2" />
                            <div className="flex items-end gap-[1.5px] h-2 w-2 pb-0.5">
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

                  {/* Right: Jewel Status Dot & Remaining Speech Time */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isActive ? (
                      <span className={`w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center shadow-xs ${
                        isProp ? 'border-blue-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isProp ? 'bg-blue-600' : 'bg-rose-600'}`} />
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    )}
                    <span className="font-num text-sm font-semibold tabular-nums text-[#0c1017]">
                      {formatTimeCompact(sp.timeRemaining)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Imperial Brass POI Seal Button (Active when opposing team is speaking) */}
          {isOpposingActiveSpeaker && activeSpeakerTimeRemaining > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#c5a059]/30">
              <button
                type="button"
                onClick={onCallPOI}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#121c2b] via-[#1c2c44] to-[#121c2b] hover:from-[#18263a] hover:to-[#18263a] text-amber-200 border-2 border-[#c5a059] font-cinzel text-[10px] tracking-wider uppercase font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <POIMedallionEmblem className="w-4 h-4" />
                <span>Offer Point of Information (15s)</span>
              </button>
            </div>
          )}

          {/* Sculpted Plinth Footer Tag */}
          <div className="text-center pt-2 border-t border-[#c5a059]/25 mt-2 flex items-center justify-center gap-2">
            <GoldDiamond className="w-2 h-2 opacity-75" />
            <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.25em] text-[#755b28] uppercase font-bold opacity-85">
              {isProp ? 'ARGUE · EXPLORE · ADVANCE' : 'SCRUTINISE · CHALLENGE · PROTECT'}
            </span>
            <GoldDiamond className="w-2 h-2 opacity-75" />
          </div>
        </div>
      </div>
    </div>
  );
};
