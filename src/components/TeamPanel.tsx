import React, { useState } from 'react';
import type { Speaker, TeamType } from '../types/debate';
import { formatTimeCompact } from '../utils/time';
import { ClassicalPillarWatermark } from './ClassicalDecors';
import { Check, Edit2, Hand, Mic } from 'lucide-react';

interface TeamPanelProps {
  teamType: TeamType;
  teamName: string;
  teamSubtitle: string;
  speakers: Speaker[];
  activeSpeakerId: string;
  isOpposingActiveSpeaker: boolean;
  activeSpeakerTimeRemaining?: number;
  onCallPOI: () => void;
  onSelectSpeaker: (speakerId: string) => void;
  onUpdateSpeakerName: (speakerId: string, newName: string) => void;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  teamType,
  teamName,
  teamSubtitle,
  speakers,
  activeSpeakerId,
  isOpposingActiveSpeaker,
  activeSpeakerTimeRemaining,
  onCallPOI,
  onSelectSpeaker,
  onUpdateSpeakerName,
}) => {
  const isProposition = teamType === 'proposition';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const handleStartEdit = (e: React.MouseEvent, sp: Speaker) => {
    e.stopPropagation();
    setEditingId(sp.id);
    setEditNameValue(sp.name);
  };

  const handleSaveEdit = (speakerId: string) => {
    if (editNameValue.trim()) {
      onUpdateSpeakerName(speakerId, editNameValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-full podium-responsive flex flex-col select-none">
      {/* 1. Top Arch Header (Classical Podium Arch - Fluid Responsive) */}
      <div
        className={`relative w-full rounded-t-[70px] md:rounded-t-[86px] rounded-b-[18px] overflow-hidden pt-5 sm:pt-6 pb-4 sm:pb-5 px-5 text-center transition-all duration-300 podium-arch ${
          isProposition ? 'arch-proposition' : 'arch-opposition'
        }`}
      >
        {/* Subtle Ionic/Corinthian Pillar Watermark in arch */}
        <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none opacity-20">
          <ClassicalPillarWatermark 
            className={`w-52 h-52 -translate-y-8 ${isProposition ? 'text-blue-100' : 'text-rose-100'}`} 
            opacity={0.16} 
          />
        </div>

        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-36 rounded-full blur-2xl pointer-events-none ${
            isProposition ? 'bg-blue-400/15' : 'bg-rose-400/15'
          }`}
        />

        {/* Header Text */}
        <div className="relative z-10">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#c5a059] font-bold block mb-0.5">
            {teamSubtitle}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl xl:text-[42px] font-normal tracking-wide text-white leading-tight">
            {teamName}
          </h2>
        </div>
      </div>

      {/* 2. Speaker Row Pills Below the Arch */}
      <div className="mt-2.5 sm:mt-3 flex flex-col gap-2 sm:gap-2.5 w-full">
        {speakers.map((speaker, index) => {
          const isActive = speaker.id === activeSpeakerId;
          const isEditing = editingId === speaker.id;

          return (
            <div
              key={speaker.id}
              onClick={() => onSelectSpeaker(speaker.id)}
              className={`group relative flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl cursor-pointer podium-speaker-row ${
                isActive
                  ? isProposition
                    ? 'speaker-pill-active-prop text-white'
                    : 'speaker-pill-active-opp text-white'
                  : 'speaker-pill-inactive text-[#232936] opacity-85'
              }`}
            >
              {/* Speaker Number & Name */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`font-cinzel text-xs tracking-wider font-bold transition-colors ${
                    isActive
                      ? isProposition
                        ? 'text-blue-300'
                        : 'text-rose-300'
                      : 'text-[#636c7e]'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Speaker Name & Role Badge */}
                {isEditing ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(speaker.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      className="bg-black/70 text-white text-xs px-2 py-0.5 rounded border border-[#c5a059] outline-none w-24 sm:w-28 font-sans-ui"
                    />
                    <button
                      onClick={() => handleSaveEdit(speaker.id)}
                      className="p-1 rounded bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/30"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group/name min-w-0">
                    <span
                      className={`text-sm md:text-base font-normal tracking-wide truncate max-w-[110px] xl:max-w-[130px] ${
                        isActive ? 'text-white font-bold' : 'text-[#202530] font-semibold'
                      }`}
                      title={`${speaker.name} (${speaker.role})`}
                    >
                      {speaker.name}
                    </span>
                    
                    {/* Role badge */}
                    <span
                      className={`text-[9px] font-cinzel tracking-wider px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? isProposition
                            ? 'bg-blue-600/80 text-white shadow-xs'
                            : 'bg-rose-600/80 text-white shadow-xs'
                          : 'bg-black/5 text-[#5e6676]'
                      }`}
                    >
                      {speaker.roleAbbr}
                    </span>

                    {/* Speaking Now beacon tag when active */}
                    {isActive && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-cinzel font-bold border border-amber-400/40 animate-pulse">
                        <Mic className="w-2.5 h-2.5" />
                        Speaking
                      </span>
                    )}

                    <button
                      onClick={(e) => handleStartEdit(e, speaker)}
                      className="opacity-0 group-hover/name:opacity-100 p-0.5 text-current/40 hover:text-current transition-opacity"
                      title="Edit speaker name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dot & Time */}
              <div className="flex items-center gap-2.5 shrink-0 pl-1">
                {/* Glowing Dot */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? isProposition
                        ? 'bg-blue-400 shadow-[0_0_12px_#60a5fa] ring-4 ring-blue-400/35 animate-ping-short'
                        : 'bg-rose-400 shadow-[0_0_12px_#fb7185] ring-4 ring-rose-400/35 animate-ping-short'
                      : !isProposition && index === 0
                      ? 'bg-[#d97788]'
                      : 'bg-[#9ea6b5]'
                  }`}
                />

                {/* Remaining Time */}
                <span
                  className={`font-num text-sm md:text-base tracking-wider tabular-nums font-semibold ${
                    isActive ? 'text-white' : 'text-[#202530]'
                  }`}
                >
                  {formatTimeCompact(speaker.timeRemaining)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Authentic Classical POI Card (Appears on the OPPOSING team's podium) */}
      {isOpposingActiveSpeaker && (activeSpeakerTimeRemaining === undefined || activeSpeakerTimeRemaining > 0) && (
        <div className="mt-3.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-full rounded-2xl bg-[#faf6ee]/95 border-2 border-[#c5a059] px-4 py-3 flex items-center justify-between gap-3 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 min-w-0">
              {/* Gold Seal with Hand Icon */}
              <div className="w-10 h-10 rounded-full bg-[#1b2230] border border-[#c5a059] flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
                <Hand className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-cinzel text-xs font-bold text-[#1b2230] tracking-wider uppercase leading-tight truncate">
                  Point of Information
                </span>
                <span className="text-[11px] font-serif-display italic text-[#7a5c24] mt-0.5 truncate">
                  15s Max · Available Now
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onCallPOI}
              title="Rise to offer a Point of Information (15s)"
              className="px-4 py-2 rounded-full bg-[#141822] hover:bg-[#252f42] text-amber-200 border border-[#c5a059] font-cinzel text-[11px] tracking-wider uppercase font-bold shadow-md btn-spring cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>Offer POI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
