import React, { useState } from 'react';
import type { DebateSegment, Speaker, TeamType } from '../types/debate';
import { formatTimeCompact } from '../utils/time';
import {
  SEGMENT_SHORT_LABELS,
  isSpeakerComplete,
  speakerDisplaySegment,
} from '../utils/segments';
import { ClassicalPillarWatermark } from './ClassicalDecors';
import { Check, Edit2, MessagesSquare, Mic } from 'lucide-react';

interface TeamPanelProps {
  teamType: TeamType;
  teamName: string;
  teamSubtitle: string;
  speakers: Speaker[];
  segments: DebateSegment[];
  activeSegment: DebateSegment;
  activeSpeakerId: string;
  onSelectSpeaker: (speakerId: string) => void;
  onSelectSegment: (segmentId: string) => void;
  onUpdateSpeakerName: (speakerId: string, newName: string) => void;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  teamType,
  teamName,
  teamSubtitle,
  speakers,
  segments,
  activeSegment,
  activeSpeakerId,
  onSelectSpeaker,
  onSelectSegment,
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

  // This bench does the questioning whenever the floor belongs to the other side
  const holder = speakers.find((s) => s.id === activeSpeakerId);
  const isOpposingActiveSpeaker = !holder;
  const activeSpeakerHasCrossExam = segments.some(
    (seg) => seg.speakerId === activeSpeakerId && seg.kind === 'cross'
  );
  const crossSegment = segments.find(
    (seg) => seg.speakerId === activeSpeakerId && seg.kind === 'cross'
  );
  const showCrossCard = isOpposingActiveSpeaker && activeSpeakerHasCrossExam;

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
      <div className="mt-2.5 sm:mt-3 flex flex-col gap-2.5 sm:gap-3 w-full">
        {speakers.map((speaker, index) => {
          const isActive = speaker.id === activeSpeakerId;
          const isEditing = editingId === speaker.id;
          const display = speakerDisplaySegment(segments, speaker.id, activeSegment.id);
          const allRun = isSpeakerComplete(segments, speaker.id);

          return (
            <div
              key={speaker.id}
              onClick={() => onSelectSpeaker(speaker.id)}
              className={`group relative flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl cursor-pointer podium-speaker-row speaker-card-fluid ${
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
                  className={`font-cinzel text-xs sm:text-sm tracking-wider font-black transition-colors shrink-0 ${
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
                      className={`text-base md:text-lg font-normal tracking-wide truncate max-w-[125px] xl:max-w-[155px] ${
                        isActive ? 'text-white font-bold' : 'text-[#202530] font-semibold'
                      }`}
                      title={`${speaker.name} (${speaker.role})`}
                    >
                      {speaker.name}
                    </span>

                    {/* Role badge */}
                    <span
                      className={`text-[10px] sm:text-[11px] font-cinzel tracking-wider px-2 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                        isActive
                          ? isProposition
                            ? 'bg-blue-600/80 text-white shadow-xs'
                            : 'bg-rose-600/80 text-white shadow-xs'
                          : 'bg-black/5 text-[#5e6676]'
                      }`}
                    >
                      {speaker.roleAbbr}
                    </span>

                    {/* Live phase tag when this speaker holds the floor */}
                    {isActive && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-cinzel font-bold border border-amber-400/40 shadow-xs shrink-0">
                        {activeSegment.kind === 'cross' ? (
                          <MessagesSquare className="w-2.5 h-2.5" />
                        ) : (
                          <Mic className="w-2.5 h-2.5" />
                        )}
                        <span>{SEGMENT_SHORT_LABELS[activeSegment.kind]}</span>
                        <div className="flex items-end gap-[2px] h-2.5 w-3 ml-0.5 pb-0.5">
                          <span className="w-0.5 bg-amber-300 rounded-full animate-soundwave-1" />
                          <span className="w-0.5 bg-amber-300 rounded-full animate-soundwave-2" />
                          <span className="w-0.5 bg-amber-300 rounded-full animate-soundwave-3" />
                        </div>
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

              {/* Status dot & time left on this speaker's live phase */}
              <div className="flex items-center gap-2.5 shrink-0 pl-1">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? isProposition
                        ? 'bg-blue-400 shadow-[0_0_14px_#60a5fa] ring-4 ring-blue-400/40'
                        : 'bg-rose-400 shadow-[0_0_14px_#fb7185] ring-4 ring-rose-400/40'
                      : allRun
                      ? 'bg-[#c5a059]'
                      : 'bg-[#9ea6b5]'
                  }`}
                  title={
                    display
                      ? `${SEGMENT_SHORT_LABELS[display.kind]} · ${formatTimeCompact(display.timeRemaining)}`
                      : undefined
                  }
                />

                {/* Remaining Time of the displayed phase */}
                <span
                  className={`font-num text-base md:text-lg tracking-wider tabular-nums font-semibold ${
                    isActive ? 'text-white' : 'text-[#202530]'
                  }`}
                >
                  {formatTimeCompact(display?.timeRemaining ?? 0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Cross-Questioning Card (appears on the bench that holds the questions) */}
      {showCrossCard && crossSegment && (
        <div className="mt-3.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={`w-full rounded-2xl px-3 py-2.5 flex items-center justify-between gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
              activeSegment.kind === 'cross'
                ? 'bg-[#1b2230] border-amber-300 text-amber-100'
                : 'bg-[#faf6ee]/95 border-[#c5a059]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Gold Seal with Question Icon */}
              <div className="w-8 h-8 rounded-full bg-[#1b2230] border border-[#c5a059] flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
                <MessagesSquare
                  className={`w-4 h-4 ${activeSegment.kind === 'cross' ? 'animate-pulse' : ''}`}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-cinzel text-[11px] font-bold tracking-wide uppercase leading-tight ${
                    activeSegment.kind === 'cross' ? 'text-amber-100' : 'text-[#1b2230]'
                  }`}
                >
                  Cross-Questioning
                </span>
                <span
                  className={`text-[10px] font-serif-display italic mt-0.5 leading-tight ${
                    activeSegment.kind === 'cross' ? 'text-amber-200/85' : 'text-[#7a5c24]'
                  }`}
                >
                  {activeSegment.kind === 'cross'
                    ? 'Live · one at a time'
                    : activeSegment.kind === 'reply'
                    ? 'Reply · uninterrupted'
                    : '1:00 · after this speech'}
                </span>
              </div>
            </div>

            {/* Jump to the cross-questioning phase */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectSegment(crossSegment.id);
              }}
              title="Go to the 1-minute cross-questioning phase"
              className="px-3 py-1.5 rounded-full bg-[#141822] hover:bg-[#252f42] text-amber-200 hover:text-white border border-[#c5a059] font-cinzel text-[10px] tracking-wider uppercase font-bold shadow-md hover:shadow-xl hover:shadow-[#c5a059]/20 btn-spring cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              {activeSegment.kind === 'cross' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
              <span>{activeSegment.kind === 'cross' ? 'Live' : 'Q&A'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
