import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Keyboard, 
  BookOpen, 
  Edit2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  SkipForward, 
  Hand, 
  Mic, 
  Clock, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import type { Speaker, TimerStatus, POIState } from '../types/debate';
import { formatTime, formatTimeCompact } from '../utils/time';
import { playTactileClick } from '../utils/audio';
import { GoldDiamond } from './ClassicalDecors';
import { POIPanel } from './POIPanel';

interface GrandFinalScreenProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
  onOpenRules: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSelectScreenMode: (mode: 'semifinals' | 'grand_final') => void;

  motion: string;
  onUpdateMotion: (newMotion: string) => void;
  propTeamName: string;
  oppTeamName: string;
  onUpdatePropTeamName: (name: string) => void;
  onUpdateOppTeamName: (name: string) => void;

  speakingOrder: Speaker[];
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  onUpdateSpeakerName: (id: string, name: string) => void;
  onUpdateSpeakerTime: (id: string, time: number, totalDuration?: number) => void;

  timerStatus: TimerStatus;
  onStartPause: () => void;
  onReset: () => void;
  onNextSpeaker: () => void;
  hasNextSpeaker: boolean;

  poiState: POIState;
  onTriggerPOIRequest: (team: 'proposition' | 'opposition') => void;
  onAllowPOI: () => void;
  onDeclinePOI: () => void;
  onEndPOI: () => void;
}

export const GrandFinalScreen: React.FC<GrandFinalScreenProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
  onOpenRules,
  isFullscreen,
  onToggleFullscreen,
  onSelectScreenMode,
  motion,
  onUpdateMotion,
  propTeamName,
  oppTeamName,
  onUpdatePropTeamName,
  onUpdateOppTeamName,
  speakingOrder,
  currentIndex,
  onSelectIndex,
  onUpdateSpeakerName,
  onUpdateSpeakerTime,
  timerStatus,
  onStartPause,
  onReset,
  onNextSpeaker,
  hasNextSpeaker,
  poiState,
  onTriggerPOIRequest,
  onAllowPOI,
  onDeclinePOI,
  onEndPOI,
}) => {
  const isRunning = timerStatus === 'running';
  const activeSpeaker = speakingOrder[currentIndex] || speakingOrder[0];
  const timeRemaining = activeSpeaker.timeRemaining;
  const totalDuration = activeSpeaker.totalDuration || 240;
  const isCompleted = timeRemaining <= 0;
  const isProp = activeSpeaker.team === 'proposition';
  const isPOIActive = poiState.status === 'active';

  // Motion editing modal (Freeform, NO preset questions, purely Grand Final custom entry)
  const [isEditingMotion, setIsEditingMotion] = useState(false);
  const [motionInput, setMotionInput] = useState(motion);
  const motionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Time editing modal inside clock face
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [minStr, setMinStr] = useState('');
  const [secStr, setSecStr] = useState('');
  const minInputRef = useRef<HTMLInputElement>(null);

  // Speaker name editing
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [editSpeakerNameVal, setEditSpeakerNameVal] = useState('');

  // Team name editing
  const [editingTeam, setEditingTeam] = useState<'prop' | 'opp' | null>(null);
  const [editTeamNameVal, setEditTeamNameVal] = useState('');

  const propSpeakers = speakingOrder
    .filter((s) => s.team === 'proposition')
    .sort((a, b) => a.number - b.number);
  const oppSpeakers = speakingOrder
    .filter((s) => s.team === 'opposition')
    .sort((a, b) => a.number - b.number);

  // Motion Edit Handlers
  const handleOpenEditMotion = () => {
    setMotionInput(motion);
    setIsEditingMotion(true);
  };

  useEffect(() => {
    if (isEditingMotion && motionTextareaRef.current) {
      motionTextareaRef.current.focus();
      motionTextareaRef.current.select();
    }
  }, [isEditingMotion]);

  const handleSaveMotion = () => {
    if (motionInput.trim()) {
      onUpdateMotion(motionInput.trim());
    }
    setIsEditingMotion(false);
  };

  // Time Edit Handlers
  const handleOpenEditTime = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isRunning) onStartPause();
    const mins = Math.floor(timeRemaining / 60);
    const secs = Math.floor(timeRemaining % 60);
    setMinStr(String(mins));
    setSecStr(String(secs).padStart(2, '0'));
    setIsEditingTime(true);
  };

  useEffect(() => {
    if (isEditingTime) {
      const timer = setTimeout(() => {
        minInputRef.current?.focus();
        minInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isEditingTime]);

  const handleApplyTime = () => {
    const m = Math.max(0, parseInt(minStr, 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(secStr, 10) || 0));
    const total = Math.max(1, m * 60 + s);
    onUpdateSpeakerTime(activeSpeaker.id, total, timerStatus === 'idle' ? total : undefined);
    setIsEditingTime(false);
  };

  const handleQuickAdjust = (e: React.MouseEvent, deltaSeconds: number) => {
    e.stopPropagation();
    playTactileClick();
    const next = Math.max(1, timeRemaining + deltaSeconds);
    const nextTotal = timerStatus === 'idle' ? next : undefined;
    onUpdateSpeakerTime(activeSpeaker.id, next, nextTotal);
  };

  // Circular Chronometer Math
  const size = 640;
  const center = size / 2;
  const strokeWidth = 16;
  const radius = 276;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(1, totalDuration);
  const fraction = Math.max(0, Math.min(1, timeRemaining / safeTotal));
  const strokeDashoffset = circumference * (1 - fraction);

  const minuteTicks = Array.from({ length: 60 }, (_, i) => {
    const tickAngle = (i * 6 - 90) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const innerR = radius - (isMajor ? 10 : 5);
    const outerR = radius + (isMajor ? 10 : 5);
    return {
      key: i,
      x1: center + innerR * Math.cos(tickAngle),
      y1: center + innerR * Math.sin(tickAngle),
      x2: center + outerR * Math.cos(tickAngle),
      y2: center + outerR * Math.sin(tickAngle),
      isMajor,
    };
  });

  const progressPercent = Math.min(100, Math.max(0, (currentIndex / (speakingOrder.length - 1 || 1)) * 100));

  return (
    <div className="h-screen max-h-screen w-full grand-final-bg flex flex-col justify-between overflow-hidden relative selection:bg-[#c5a059]/30">
      {/* 0. Classical Inscriptions on Architecture (per Concept Mockup) */}
      {/* Top Left Pillar */}
      <div className="absolute top-24 left-3 lg:left-6 z-10 hidden xl:flex flex-col items-center gap-1.5 opacity-45 pointer-events-none select-none">
        {['IDEAS', 'CLASH', 'MINDS', 'GROW', 'REASON', 'PREVAILS'].map((word, i) => (
          <span key={i} className="font-cinzel text-[9px] tracking-[0.3em] font-extrabold text-[#3a2c16]">
            {word}
          </span>
        ))}
      </div>

      {/* Top Right Pillar */}
      <div className="absolute top-24 right-3 lg:right-6 z-10 hidden xl:flex flex-col items-center gap-1.5 opacity-45 pointer-events-none select-none">
        {['A', 'MORE', 'CURIOUS', 'A KINDER', 'BRIGHTER', 'TOMORROW'].map((word, i) => (
          <span key={i} className="font-cinzel text-[9px] tracking-[0.3em] font-extrabold text-[#3a2c16]">
            {word}
          </span>
        ))}
      </div>

      {/* Blue Banner Inscription */}
      <div className="absolute top-20 left-[21%] lg:left-[22.2%] z-10 hidden 2xl:flex flex-col items-center gap-1 opacity-80 pointer-events-none select-none">
        {['TRUTH', 'SEEKS', 'BOLDER', 'QUESTIONS'].map((word, i) => (
          <span key={i} className="font-cinzel text-[8px] tracking-[0.25em] font-black text-amber-200 drop-shadow-xs">
            {word}
          </span>
        ))}
      </div>

      {/* Maroon Banner Inscription */}
      <div className="absolute top-20 right-[21%] lg:right-[22.2%] z-10 hidden 2xl:flex flex-col items-center gap-1 opacity-80 pointer-events-none select-none">
        {['A', 'STRONGER', 'TOMORROW', 'QUESTIONS', 'TODAY'].map((word, i) => (
          <span key={i} className="font-cinzel text-[8px] tracking-[0.25em] font-black text-amber-200 drop-shadow-xs">
            {word}
          </span>
        ))}
      </div>

      {/* 1. Header Bar: Masthead, Mode Toggle, and Tool Controls */}
      <header className="relative z-30 w-full pt-2 sm:pt-2.5 pb-0.5 px-5 md:px-10 flex items-center justify-between select-none">
        {/* Left: Echoes of Reason */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl sm:text-2xl tracking-tight font-serif-display text-[#141720] flex items-baseline font-semibold leading-none drop-shadow-xs">
            <span>Echoes</span>
            <span className="font-serif-display italic font-normal text-[#8d6928] px-1 text-xl sm:text-2xl">
              of
            </span>
            <span>Reason</span>
          </h1>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#c5a059]/60 text-xs">|</span>
            <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#554734] uppercase font-bold">
              DEBATE COMPETITION
            </span>
          </div>
        </div>

        {/* Center: Mode Switcher (Allows seamless return to Semifinals) */}
        <div className="flex items-center p-0.5 rounded-full bg-[#fdfaf5]/90 border border-[#c5a059]/60 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => onSelectScreenMode('semifinals')}
            className="px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase text-[#5a4823] hover:text-[#18202d] transition-all duration-200 cursor-pointer hover:scale-105"
          >
            🏛️ Semifinals
          </button>
          <button
            type="button"
            onClick={() => onSelectScreenMode('grand_final')}
            className="px-3.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#18202d] text-amber-300 shadow-xs scale-[1.02] cursor-pointer"
          >
            👑 Grand Finale
          </button>
        </div>

        {/* Right: Science Club · ASIET & Moderator Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:inline font-cinzel text-[10px] tracking-[0.25em] text-[#554734] uppercase font-bold opacity-85">
            SCIENCE CLUB · ASIET
          </span>
          <div className="flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity">
            <button
              onClick={onOpenRules}
              title="Official Rules"
              className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] hover:text-[#11151c] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8d6928]" />
            </button>
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] hover:text-[#11151c] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-700" />}
            </button>
            <button
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts"
              className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] hover:text-[#11151c] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#475266] hover:text-[#11151c] transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Grand Header: ROUND 4 · GRAND FINAL · THE MOTION BEFORE THE HOUSE */}
      <section className="relative z-20 w-full max-w-4xl mx-auto px-4 text-center my-0.5 select-none flex flex-col items-center">
        {/* Hairline Round 4 Tag */}
        <div className="flex items-center gap-2 mb-0.5 opacity-80">
          <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#c5a059]" />
          <span className="font-cinzel text-[10px] tracking-[0.3em] font-bold text-[#6f5624] uppercase">
            ROUND 4
          </span>
          <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#c5a059]" />
        </div>

        {/* Majestic GRAND FINAL Title */}
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] font-extrabold uppercase text-[#141822] leading-tight mb-0.5 drop-shadow-xs">
          GRAND FINAL
        </h2>

        {/* Heraldic Tag */}
        <div className="flex items-center gap-2 mb-0.5 opacity-85">
          <div className="h-[0.5px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#c5a059]" />
          <GoldDiamond className="w-2 h-2 opacity-80" />
          <span className="font-cinzel text-[9px] tracking-[0.3em] font-extrabold uppercase shimmer-gold-text">
            THE MOTION BEFORE THE HOUSE
          </span>
          <GoldDiamond className="w-2 h-2 opacity-80" />
          <div className="h-[0.5px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#c5a059]" />
        </div>

        {/* Editable Motion Display (NO PRESETS - Purely custom Grand Final entry) */}
        {isEditingMotion ? (
          <div className="w-full max-w-2xl bg-[#faf7f2]/98 backdrop-blur-md border-2 border-[#c5a059] rounded-2xl p-4 shadow-2xl animate-in zoom-in-95 duration-200 mt-1">
            <span className="block text-[10px] font-cinzel uppercase tracking-widest text-[#7c5f27] font-bold mb-1">
              Grand Final Debate Motion
            </span>
            <textarea
              ref={motionTextareaRef}
              value={motionInput}
              onChange={(e) => setMotionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveMotion();
                } else if (e.key === 'Escape') {
                  setIsEditingMotion(false);
                }
              }}
              rows={2}
              placeholder="Type official Grand Final motion here..."
              className="w-full bg-white border border-[#c5a059]/40 rounded-xl p-2.5 font-serif-display text-base sm:text-lg text-[#10141c] text-center italic leading-snug outline-none resize-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all shadow-inner"
            />
            <div className="flex items-center justify-center gap-2.5 mt-2.5">
              <button
                type="button"
                onClick={() => setIsEditingMotion(false)}
                className="px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-cinzel text-[11px] uppercase font-bold cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3 inline mr-1" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMotion}
                className="px-5 py-1 rounded-full bg-[#141820] hover:bg-[#283244] text-white font-cinzel text-[11px] uppercase font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-3 h-3 text-amber-300 inline mr-1" /> Apply Motion
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleOpenEditMotion}
            title="Click to edit Grand Final motion"
            className="group cursor-pointer px-4 py-1 rounded-2xl hover:bg-white/40 transition-all duration-300 flex flex-col items-center"
          >
            <p className="font-serif-display text-lg sm:text-xl md:text-2xl text-[#121620] italic font-normal max-w-3xl leading-snug transition-transform group-hover:scale-[1.008]">
              “{motion}”
            </p>
            <span className="text-[9px] font-cinzel text-[#886729] font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex items-center gap-1">
              <Edit3 className="w-2.5 h-2.5 text-[#c5a059]" /> Click to Edit Motion
            </span>
          </div>
        )}
      </section>

      {/* Prominent POI HUD Overlay */}
      <POIPanel
        poiState={poiState}
        activeSpeaker={activeSpeaker}
        roundStage="Round 4: Grand Final"
        onAllowPOI={onAllowPOI}
        onDeclinePOI={onDeclinePOI}
        onEndPOI={onEndPOI}
      />

      {/* 3. Main Stage: Left Marble Tablet, Massive Central Timer, Right Marble Tablet */}
      <main className="relative z-10 w-full flex-1 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 py-0.5 flex items-center justify-between gap-3 xl:gap-8">
        {/* Left Marble Tablet: TEAM 1 · Proposition */}
        <div className="w-[300px] sm:w-[330px] xl:w-[360px] grand-final-tablet rounded-[26px] p-4 sm:p-5 flex flex-col justify-between shrink-0 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center border-b border-[#c5a059]/25 pb-3 mb-3">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#8a6828] uppercase font-bold block mb-0.5">
              TEAM 1
            </span>
            {editingTeam === 'prop' ? (
              <div className="flex items-center justify-center gap-1.5 my-1">
                <input
                  type="text"
                  value={editTeamNameVal}
                  onChange={(e) => setEditTeamNameVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editTeamNameVal.trim()) onUpdatePropTeamName(editTeamNameVal.trim());
                      setEditingTeam(null);
                    } else if (e.key === 'Escape') setEditingTeam(null);
                  }}
                  autoFocus
                  className="bg-white text-[#121620] text-lg font-serif-display font-bold px-2 py-0.5 rounded border border-[#c5a059] outline-none text-center w-40 shadow-inner"
                />
                <button
                  onClick={() => {
                    if (editTeamNameVal.trim()) onUpdatePropTeamName(editTeamNameVal.trim());
                    setEditingTeam(null);
                  }}
                  className="p-1 rounded bg-[#c5a059]/20 text-[#8a6828]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <h3
                onClick={() => {
                  setEditingTeam('prop');
                  setEditTeamNameVal(propTeamName);
                }}
                title="Click to edit team name"
                className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#141822] cursor-pointer hover:text-[#8a6828] transition-colors leading-tight"
              >
                {propTeamName}
              </h3>
            )}
            <span className="font-serif-display italic text-xs text-[#7a5c24] tracking-wide block mt-0.5">
              TRUTH SEEKS BOLDER QUESTIONS
            </span>
          </div>

          {/* 3 Proposition Speaker Rows */}
          <div className="flex flex-col gap-2 my-1">
            {propSpeakers.map((sp, idx) => {
              const isActive = sp.id === activeSpeaker.id;
              const isEditingSp = editingSpeakerId === sp.id;

              return (
                <div
                  key={sp.id}
                  onClick={() => onSelectIndex(speakingOrder.findIndex((s) => s.id === sp.id))}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive ? 'grand-final-tablet-row-active' : 'grand-final-tablet-row-inactive'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-cinzel text-xs font-bold text-[#6e5828]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isEditingSp ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editSpeakerNameVal}
                          onChange={(e) => setEditSpeakerNameVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editSpeakerNameVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerNameVal.trim());
                              setEditingSpeakerId(null);
                            } else if (e.key === 'Escape') setEditingSpeakerId(null);
                          }}
                          autoFocus
                          className="bg-white text-xs px-2 py-0.5 rounded border border-[#c5a059] outline-none w-24 font-sans-ui"
                        />
                        <button
                          onClick={() => {
                            if (editSpeakerNameVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerNameVal.trim());
                            setEditingSpeakerId(null);
                          }}
                          className="p-1 text-[#8a6828]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 min-w-0 group/sp">
                        <span className={`text-sm font-semibold truncate max-w-[110px] ${isActive ? 'text-[#10141c] font-bold' : 'text-[#333e4f]'}`}>
                          {sp.name}
                        </span>
                        <span className="text-[9px] font-cinzel font-bold uppercase px-1.5 py-0.5 rounded bg-blue-900/10 text-blue-950 border border-blue-900/20">
                          {sp.roleAbbr}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[#856322] text-[8px] font-cinzel font-bold border border-amber-400/40">
                            <Mic className="w-2 h-2" />
                            <div className="flex items-end gap-[1.5px] h-2 w-2 pb-0.5">
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-1" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-2" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-3" />
                            </div>
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSpeakerId(sp.id);
                            setEditSpeakerNameVal(sp.name);
                          }}
                          className="opacity-0 group-hover/sp:opacity-100 p-0.5 text-gray-400 hover:text-black transition-opacity"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-blue-600 ring-4 ring-blue-600/30' : 'bg-gray-300'}`} />
                    <span className="font-num text-sm font-semibold tabular-nums text-[#121620]">
                      {formatTimeCompact(sp.timeRemaining)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Offer POI button on Proposition tablet (if Opposition speaker is speaking) */}
          {!isProp && (timeRemaining > 0) && (
            <div className="mt-2.5 pt-2 border-t border-[#c5a059]/20">
              <button
                onClick={() => onTriggerPOIRequest('proposition')}
                className="w-full py-1.5 rounded-xl bg-[#141822] hover:bg-[#252f40] text-amber-200 border border-[#c5a059] font-cinzel text-[10px] tracking-wider uppercase font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Hand className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Offer POI (15s)</span>
              </button>
            </div>
          )}

          {/* Footer Classical Tag */}
          <div className="text-center pt-2.5 border-t border-[#c5a059]/20 mt-2">
            <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#8a6828] uppercase font-bold opacity-80">
              ARGUE · EXPLORE · ADVANCE
            </span>
          </div>
        </div>

        {/* Center Arena: Circular Chronometer & Tactile Control Deck */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-[800px]">
          {/* Circular Chronometer Dial */}
          <div className="relative clock-dial-responsive flex items-center justify-center my-0.5">
            {/* Ambient Halo Face */}
            <div 
              className={`absolute inset-2 sm:inset-3 rounded-full clock-face-halo transition-all duration-700 pointer-events-none ${
                isPOIActive
                  ? 'ring-4 ring-rose-500/50 shadow-[0_0_60px_rgba(225,29,72,0.3)]'
                  : isRunning
                  ? 'animate-halo-breathing'
                  : 'shadow-[0_24px_60px_-12px_rgba(30,25,18,0.12)]'
              }`}
            />

            <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="gfPropTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
                <linearGradient id="gfOppTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#881337" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
                <linearGradient id="gfWarningTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#fca5a5" />
                </linearGradient>
                <radialGradient id="gfBeadJewelGradient" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor={isProp ? '#93c5fd' : '#fecdd3'} />
                  <stop offset="80%" stopColor={isProp ? '#2563eb' : '#e11d48'} />
                  <stop offset="100%" stopColor={isProp ? '#1e3a8a' : '#881337'} />
                </radialGradient>
              </defs>

              {/* Chronometer minute ticks */}
              <g opacity="0.25">
                {minuteTicks.map((t) => (
                  <line
                    key={t.key}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke="#8c7750"
                    strokeWidth={t.isMajor ? 1.5 : 0.75}
                  />
                ))}
              </g>

              {/* Background circle track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#dfd6c6"
                strokeWidth={strokeWidth}
                className="opacity-75"
              />

              {/* Active countdown arc */}
              <g transform={`rotate(-90 ${center} ${center})`}>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={
                    timeRemaining <= 30 && timeRemaining > 0
                      ? 'url(#gfWarningTimerGradient)'
                      : isProp
                      ? 'url(#gfPropTimerGradient)'
                      : 'url(#gfOppTimerGradient)'
                  }
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.5s ease' }}
                />
              </g>

              {/* GPU-Accelerated Chronometer Indicator Bead */}
              {fraction > 0.003 && (
                <g
                  transform={`rotate(${fraction * 360} ${center} ${center})`}
                  style={{ transition: 'transform 0.3s linear' }}
                >
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth + 4}
                    fill={isProp ? '#3b82f6' : '#e11d48'}
                    opacity="0.28"
                  />
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth / 2 + 5}
                    fill="#ffffff"
                    stroke="#c5a059"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth / 2 + 1.5}
                    fill="url(#gfBeadJewelGradient)"
                  />
                  <circle
                    cx={center - 2}
                    cy={center - radius - 2}
                    r="2"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                </g>
              )}
            </svg>

            {/* Centered Timer Numerals & Adjusters */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
              {isEditingTime ? (
                <div className="flex flex-col items-center gap-2.5 p-4 bg-[#faf7f2]/98 backdrop-blur-md rounded-3xl border-2 border-[#c5a059] shadow-2xl animate-in zoom-in-95 duration-200 w-[290px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span className="font-cinzel text-xs uppercase font-bold text-[#7a5c24] tracking-widest">
                      Edit Speech Duration
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setMinStr((m) => String(Math.max(0, (parseInt(m, 10) || 0) + 1)))}
                        className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <input
                        ref={minInputRef}
                        type="text"
                        value={minStr}
                        onChange={(e) => setMinStr(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        className="w-16 text-center text-4xl font-num font-bold bg-white border-2 border-[#c5a059]/60 rounded-xl py-1 text-[#12161d] outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setMinStr((m) => String(Math.max(0, (parseInt(m, 10) || 0) - 1)))}
                        className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-4xl font-num font-bold text-[#c5a059] pb-6">:</span>
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setSecStr((s) => String(Math.min(59, (parseInt(s, 10) || 0) + 5)).padStart(2, '0'))}
                        className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={secStr}
                        onChange={(e) => setSecStr(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        className="w-16 text-center text-4xl font-num font-bold bg-white border-2 border-[#c5a059]/60 rounded-xl py-1 text-[#12161d] outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setSecStr((s) => String(Math.max(0, (parseInt(s, 10) || 0) - 5)).padStart(2, '0'))}
                        className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 w-full">
                    <button
                      type="button"
                      onClick={() => setIsEditingTime(false)}
                      className="flex-1 py-1 rounded-xl border border-gray-300 text-gray-700 font-cinzel text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyTime}
                      className="flex-1 py-1 rounded-xl bg-[#12161d] text-white font-cinzel text-xs uppercase font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-20 flex flex-col items-center select-none">
                  <button
                    type="button"
                    onClick={handleOpenEditTime}
                    title="Click to edit speech time"
                    className="cursor-pointer hover:opacity-90 hover:scale-[1.015] transition-all duration-300 outline-none block"
                  >
                    <div
                      className={`font-num font-normal tracking-tight numerals-responsive select-none transition-all duration-300 ${
                        isCompleted
                          ? 'text-rose-600 animate-bounce'
                          : timeRemaining <= 30
                          ? 'text-amber-700 animate-pulse'
                          : isRunning
                          ? 'text-[#0a0e16] drop-shadow-xs'
                          : 'text-[#0e1219]'
                      }`}
                    >
                      {formatTime(timeRemaining)}
                    </div>
                  </button>

                  {/* Quick Adjust Buttons */}
                  <div 
                    className="relative z-30 flex items-center justify-center gap-1.5 mt-3 bg-[#ede4d4]/95 border border-[#c5a059]/50 rounded-full px-2 py-1.5 shadow-sm backdrop-blur-xs transition-transform duration-300 hover:scale-[1.02]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, -60)}
                      title="-1 minute"
                      className="px-2.5 py-1 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] border border-[#c5a059]/40 text-xs font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[42px]"
                    >
                      -1m
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, -30)}
                      title="-30 seconds"
                      className="px-2.5 py-1 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] border border-[#c5a059]/40 text-xs font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[44px]"
                    >
                      -30s
                    </button>
                    <div className="h-4 w-[1px] bg-[#c5a059]/50 mx-0.5" />
                    <button
                      type="button"
                      onClick={handleOpenEditTime}
                      title="Edit Time"
                      className="px-3 py-1 rounded-full bg-[#161e2b] hover:bg-[#253245] text-amber-200 border border-[#c5a059] text-xs font-cinzel font-bold shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3 text-[#c5a059]" />
                      <span>Edit Time</span>
                    </button>
                    <div className="h-4 w-[1px] bg-[#c5a059]/50 mx-0.5" />
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, 30)}
                      title="+30 seconds"
                      className="px-2.5 py-1 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] border border-[#c5a059]/40 text-xs font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[44px]"
                    >
                      +30s
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, 60)}
                      title="+1 minute"
                      className="px-2.5 py-1 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] border border-[#c5a059]/40 text-xs font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[42px]"
                    >
                      +1m
                    </button>
                  </div>
                </div>
              )}

              {/* Status Subtitle */}
              <div className="mt-1 sm:mt-1.5 flex flex-col items-center">
                <span className="font-cinzel text-xs sm:text-sm tracking-[0.25em] font-semibold text-[#5a6476] uppercase">
                  {isCompleted
                    ? 'TIME EXPIRED'
                    : isPOIActive
                    ? 'POI IN PROGRESS · 15S MAX'
                    : !isRunning
                    ? 'TIMER PAUSED'
                    : 'SPEAKING TIME'}
                </span>
                <div className="mt-1 flex items-center justify-center gap-2 opacity-70">
                  <div className="h-[0.5px] w-6 bg-gradient-to-r from-transparent to-[#c5a059]" />
                  <GoldDiamond className="w-2.5 h-2.5 animate-subtle-float" />
                  <div className="h-[0.5px] w-6 bg-gradient-to-l from-transparent to-[#c5a059]" />
                </div>
              </div>
            </div>
          </div>

          {/* Symmetrical 3-Button Control Deck */}
          <div className="flex items-center justify-center gap-8 sm:gap-11 mt-1">
            {/* Reset */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onReset}
                title="Reset timer (R)"
                className="group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#eae3d6]/85 hover:bg-white border border-white/80 shadow-xs hover:shadow-md flex items-center justify-center text-[#373f4e] hover:text-[#11151c] transition-all duration-200 active:scale-90 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
              </button>
              <span className="font-cinzel text-[10px] tracking-widest text-[#697384] uppercase font-semibold">
                Reset
              </span>
            </div>

            {/* Play / Pause with Radar Wave */}
            <div className="flex flex-col items-center gap-1 relative">
              {isRunning && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-radar-ripple pointer-events-none" />
              )}
              <button
                onClick={onStartPause}
                title={isRunning ? 'Pause timer (Space)' : 'Start timer (Space)'}
                className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer btn-halo transition-all duration-300 active:scale-90 ${
                  isRunning
                    ? 'bg-[#12161d] text-white hover:bg-[#202733]'
                    : isCompleted
                    ? 'bg-[#881337] text-white hover:bg-[#9f1239]'
                    : 'bg-[#12161d] text-white hover:bg-[#202733]'
                }`}
              >
                {isRunning ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 fill-current translate-x-0.5 transition-transform duration-200 hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="7,4 19.5,12 7,20" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
              <span className="font-cinzel text-xs tracking-[0.2em] text-[#12161d] uppercase font-bold">
                {isRunning ? 'Pause' : 'Start'}
              </span>
            </div>

            {/* Next Speaker */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onNextSpeaker}
                disabled={!hasNextSpeaker}
                title={hasNextSpeaker ? 'Next Speaker (N)' : 'Final speech concluded'}
                className={`group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  hasNextSpeaker
                    ? 'bg-[#eae3d6]/85 hover:bg-white border border-white/80 shadow-xs hover:shadow-md text-[#373f4e] hover:text-[#11151c] cursor-pointer'
                    : 'bg-[#e2ddd5]/40 border border-black/5 text-[#9ea7b5] cursor-not-allowed opacity-50'
                }`}
              >
                <SkipForward className={`w-5 h-5 transition-transform duration-300 ${hasNextSpeaker ? 'group-hover:translate-x-0.5' : ''}`} />
              </button>
              <span className="font-cinzel text-[10px] tracking-widest text-[#697384] uppercase font-semibold">
                Next
              </span>
            </div>
          </div>
        </div>

        {/* Right Marble Tablet: TEAM 2 · Opposition */}
        <div className="w-[300px] sm:w-[330px] xl:w-[360px] grand-final-tablet rounded-[26px] p-4 sm:p-5 flex flex-col justify-between shrink-0 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center border-b border-[#c5a059]/25 pb-3 mb-3">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#8a6828] uppercase font-bold block mb-0.5">
              TEAM 2
            </span>
            {editingTeam === 'opp' ? (
              <div className="flex items-center justify-center gap-1.5 my-1">
                <input
                  type="text"
                  value={editTeamNameVal}
                  onChange={(e) => setEditTeamNameVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editTeamNameVal.trim()) onUpdateOppTeamName(editTeamNameVal.trim());
                      setEditingTeam(null);
                    } else if (e.key === 'Escape') setEditingTeam(null);
                  }}
                  autoFocus
                  className="bg-white text-[#121620] text-lg font-serif-display font-bold px-2 py-0.5 rounded border border-[#c5a059] outline-none text-center w-40 shadow-inner"
                />
                <button
                  onClick={() => {
                    if (editTeamNameVal.trim()) onUpdateOppTeamName(editTeamNameVal.trim());
                    setEditingTeam(null);
                  }}
                  className="p-1 rounded bg-[#c5a059]/20 text-[#8a6828]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <h3
                onClick={() => {
                  setEditingTeam('opp');
                  setEditTeamNameVal(oppTeamName);
                }}
                title="Click to edit team name"
                className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#141822] cursor-pointer hover:text-[#8a6828] transition-colors leading-tight"
              >
                {oppTeamName}
              </h3>
            )}
            <span className="font-serif-display italic text-xs text-[#7a5c24] tracking-wide block mt-0.5">
              A STRONGER TOMORROW QUESTIONS TODAY
            </span>
          </div>

          {/* 3 Opposition Speaker Rows */}
          <div className="flex flex-col gap-2 my-1">
            {oppSpeakers.map((sp, idx) => {
              const isActive = sp.id === activeSpeaker.id;
              const isEditingSp = editingSpeakerId === sp.id;

              return (
                <div
                  key={sp.id}
                  onClick={() => onSelectIndex(speakingOrder.findIndex((s) => s.id === sp.id))}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive ? 'grand-final-tablet-row-active' : 'grand-final-tablet-row-inactive'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-cinzel text-xs font-bold text-[#6e5828]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isEditingSp ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editSpeakerNameVal}
                          onChange={(e) => setEditSpeakerNameVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editSpeakerNameVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerNameVal.trim());
                              setEditingSpeakerId(null);
                            } else if (e.key === 'Escape') setEditingSpeakerId(null);
                          }}
                          autoFocus
                          className="bg-white text-xs px-2 py-0.5 rounded border border-[#c5a059] outline-none w-24 font-sans-ui"
                        />
                        <button
                          onClick={() => {
                            if (editSpeakerNameVal.trim()) onUpdateSpeakerName(sp.id, editSpeakerNameVal.trim());
                            setEditingSpeakerId(null);
                          }}
                          className="p-1 text-[#8a6828]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 min-w-0 group/sp">
                        <span className={`text-sm font-semibold truncate max-w-[110px] ${isActive ? 'text-[#10141c] font-bold' : 'text-[#333e4f]'}`}>
                          {sp.name}
                        </span>
                        <span className="text-[9px] font-cinzel font-bold uppercase px-1.5 py-0.5 rounded bg-rose-900/10 text-rose-950 border border-rose-900/20">
                          {sp.roleAbbr}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[#856322] text-[8px] font-cinzel font-bold border border-amber-400/40">
                            <Mic className="w-2 h-2" />
                            <div className="flex items-end gap-[1.5px] h-2 w-2 pb-0.5">
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-1" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-2" />
                              <span className="w-0.5 bg-amber-600 rounded-full animate-soundwave-3" />
                            </div>
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSpeakerId(sp.id);
                            setEditSpeakerNameVal(sp.name);
                          }}
                          className="opacity-0 group-hover/sp:opacity-100 p-0.5 text-gray-400 hover:text-black transition-opacity"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-rose-600 ring-4 ring-rose-600/30' : 'bg-gray-300'}`} />
                    <span className="font-num text-sm font-semibold tabular-nums text-[#121620]">
                      {formatTimeCompact(sp.timeRemaining)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Offer POI button on Opposition tablet (if Proposition speaker is speaking) */}
          {isProp && (timeRemaining > 0) && (
            <div className="mt-2.5 pt-2 border-t border-[#c5a059]/20">
              <button
                onClick={() => onTriggerPOIRequest('opposition')}
                className="w-full py-1.5 rounded-xl bg-[#141822] hover:bg-[#252f40] text-amber-200 border border-[#c5a059] font-cinzel text-[10px] tracking-wider uppercase font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Hand className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Offer POI (15s)</span>
              </button>
            </div>
          )}

          {/* Footer Classical Tag */}
          <div className="text-center pt-2.5 border-t border-[#c5a059]/20 mt-2">
            <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#8a6828] uppercase font-bold opacity-80">
              SCRUTINISE · CHALLENGE · REFINE · PROTECT
            </span>
          </div>
        </div>
      </main>

      {/* 4. Bottom Stepper Progress Bar */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center pb-2 pt-0.5 select-none">
        <div className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px]">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[1.5px] bg-[#c5a059]/30 z-0" />
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#886729] via-[#c5a059] to-[#ebd08c] z-0 transition-all duration-500 ease-out"
            style={{ width: `calc((100% - 32px) * ${progressPercent / 100})` }}
          />

          {/* 6 Speeches */}
          <div className="relative z-10 flex items-center justify-between w-full px-2">
            {speakingOrder.map((sp, idx) => {
              const isActive = idx === currentIndex;
              const isSpCompleted = sp.hasSpoken && !isActive;

              return (
                <button
                  key={sp.id}
                  onClick={() => onSelectIndex(idx)}
                  className="group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  {isActive ? (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-6 h-6 rounded-full bg-[#c5a059]/40 animate-progress-ping pointer-events-none" />
                      <div className="w-5 h-5 rounded-full border-2 border-[#121620] flex items-center justify-center bg-[#faf7f2] shadow-sm">
                        <span className="font-cinzel text-[9px] font-extrabold text-[#121620]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ) : isSpCompleted ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#c5a059] border border-white flex items-center justify-center shadow-xs" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-[#9e917d] group-hover:bg-[#121620] transition-colors" />
                  )}

                  <span className="font-cinzel text-[8px] font-bold text-[#5a4825] mt-1 tracking-wider uppercase">
                    {sp.roleAbbr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inscribed Bottom Pedestals */}
        <div className="w-full flex items-center justify-between px-6 sm:px-12 mt-1 opacity-50 select-none pointer-events-none">
          <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.25em] font-extrabold text-[#3a2c16]">
            SCIENCE · HUMANITY · A BRIGHTER TOMORROW
          </span>
          <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.25em] font-extrabold text-[#3a2c16]">
            IDEAS TODAY · A KINDER TOMORROW
          </span>
        </div>
      </div>
    </div>
  );
};
