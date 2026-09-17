import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  SkipForward, 
  Clock, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import type { Speaker, TimerStatus, POIState } from '../types/debate';
import { formatTime } from '../utils/time';
import { playTactileClick } from '../utils/audio';
import { 
  GoldDiamond, 
  ChronometerLaurelBase, 
  NeoclassicalMotionCartouche 
} from './ClassicalDecors';
import { POIPanel } from './POIPanel';
import { Header } from './Header';
import { ExtravagantPodium } from './ExtravagantPodium';

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
  const isPOIActive = poiState.status === 'active';

  // Motion editing modal
  const [isEditingMotion, setIsEditingMotion] = useState(false);
  const [motionInput, setMotionInput] = useState(motion);
  const motionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Time editing modal inside clock face
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [minStr, setMinStr] = useState('');
  const [secStr, setSecStr] = useState('');
  const minInputRef = useRef<HTMLInputElement>(null);

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
  const radius = 270;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(1, totalDuration);
  const fraction = Math.max(0, Math.min(1, timeRemaining / safeTotal));
  const strokeDashoffset = circumference * (1 - fraction);

  const minuteTicks = Array.from({ length: 60 }, (_, i) => {
    const tickAngle = (i * 6 - 90) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const innerR = radius - (isMajor ? 11 : 6);
    const outerR = radius + (isMajor ? 11 : 6);
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
      {/* 1. Header Bar with Centered Stable Mode Switcher */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onOpenShortcuts={onOpenShortcuts}
        onOpenRules={onOpenRules}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        screenMode="grand_final"
        onSelectScreenMode={onSelectScreenMode}
      />

      {/* 2. Top Grand Header: ROUND 4 · GRAND FINAL · THE MOTION BEFORE THE HOUSE */}
      <section className="relative z-20 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 text-center my-0.5 select-none flex flex-col items-center">
        {/* Hairline Round 4 Tag */}
        <div className="flex items-center gap-2 mb-0.5 opacity-85">
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
        <div className="flex items-center gap-2 mb-1 opacity-90">
          <div className="h-[0.5px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#c5a059]" />
          <GoldDiamond className="w-2 h-2 opacity-90" />
          <span className="font-cinzel text-[9px] tracking-[0.3em] font-extrabold uppercase shimmer-gold-text">
            THE MOTION BEFORE THE HOUSE
          </span>
          <GoldDiamond className="w-2 h-2 opacity-90" />
          <div className="h-[0.5px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#c5a059]" />
        </div>

        {/* Editable Motion Display */}
        {isEditingMotion ? (
          <div className="w-full max-w-4xl bg-[#faf7f2]/98 backdrop-blur-md border-2 border-[#c5a059] rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200 mt-1">
            <span className="block text-[11px] font-cinzel uppercase tracking-[0.25em] text-[#7c5f27] font-bold mb-2 text-center">
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
              className="w-full bg-white border border-[#c5a059]/50 rounded-2xl p-3.5 font-serif-display text-xl sm:text-2xl md:text-3xl text-[#0a0e17] text-center italic font-semibold leading-snug outline-none resize-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all shadow-inner"
            />
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setIsEditingMotion(false)}
                className="px-5 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-cinzel text-xs uppercase font-bold cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3.5 h-3.5 inline mr-1" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMotion}
                className="px-6 py-1.5 rounded-full bg-[#141820] hover:bg-[#283244] text-white font-cinzel text-xs uppercase font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5 text-amber-300 inline mr-1" /> Apply Motion
              </button>
            </div>
          </div>
        ) : (
          <NeoclassicalMotionCartouche
            onClick={handleOpenEditMotion}
            className="mt-1"
          >
            <p className="font-serif-display text-xl sm:text-2xl md:text-3xl lg:text-[2.15rem] xl:text-[2.45rem] text-[#0a0e17] font-semibold italic text-center max-w-4xl leading-tight transition-transform group-hover:scale-[1.01] drop-shadow-2xs px-2">
              <span className="text-[#c5a059] font-serif not-italic mr-1 text-2xl sm:text-3xl md:text-4xl select-none">“</span>
              {motion}
              <span className="text-[#c5a059] font-serif not-italic ml-1 text-2xl sm:text-3xl md:text-4xl select-none">”</span>
            </p>
            <span className="text-[10px] font-cinzel text-[#886729] font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center gap-1.5">
              <Edit3 className="w-3 h-3 text-[#c5a059]" /> Click to Edit Motion
            </span>
          </NeoclassicalMotionCartouche>
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

      {/* 3. Main Stage: Left Extravagant Podium, Pure Gold Chronometer, Right Extravagant Podium */}
      <main className="relative z-10 w-full flex-1 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-0 flex items-center justify-between">
        {/* Left Side: Extravagant Proposition Monument Podium */}
        <ExtravagantPodium
          teamType="proposition"
          teamName={propTeamName}
          onUpdateTeamName={onUpdatePropTeamName}
          speakers={propSpeakers}
          activeSpeakerId={activeSpeaker.id}
          isOpposingActiveSpeaker={activeSpeaker.team === 'opposition'}
          activeSpeakerTimeRemaining={activeSpeaker.timeRemaining}
          onCallPOI={() => onTriggerPOIRequest('proposition')}
          onSelectSpeaker={(id) => onSelectIndex(speakingOrder.findIndex((s) => s.id === id))}
          onUpdateSpeakerName={onUpdateSpeakerName}
        />

        {/* Center Arena: Pure Gold Metallic Chronometer & Symmetrical Control Deck */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-[760px] px-2">
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
                {/* 1. Grand Finale Metallic Antique Gold Base Track */}
                <linearGradient id="gfGrandGoldBaseTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d8c5a2" />
                  <stop offset="50%" stopColor="#ebe0cc" />
                  <stop offset="100%" stopColor="#bf9d55" />
                </linearGradient>

                {/* 2. Grand Finale 6-Stop Radiant Brushed Gold Active Progress Arc */}
                <linearGradient id="gfGrandGoldActiveArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a37c2e" />
                  <stop offset="20%" stopColor="#f5e09b" />
                  <stop offset="45%" stopColor="#d4af37" />
                  <stop offset="70%" stopColor="#fff1c2" />
                  <stop offset="85%" stopColor="#c5a059" />
                  <stop offset="100%" stopColor="#966c1b" />
                </linearGradient>

                {/* 3. Urgent Warning Gradient (Under 30s) */}
                <linearGradient id="gfGrandWarningArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                {/* 4. Glowing Gold Pearl Bead Medallion */}
                <radialGradient id="gfGoldPearlBead" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fff8e1" />
                  <stop offset="70%" stopColor="#dfb758" />
                  <stop offset="100%" stopColor="#966c1b" />
                </radialGradient>
              </defs>

              {/* Chronometer minute ticks */}
              <g opacity="0.32">
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

              {/* Inner and Outer Delicate Gold Hairline Concentric Guides */}
              <circle
                cx={center}
                cy={center}
                r={radius + strokeWidth / 2 + 5}
                fill="none"
                stroke="#c5a059"
                strokeWidth="1.2"
                opacity="0.5"
              />
              <circle
                cx={center}
                cy={center}
                r={radius - strokeWidth / 2 - 5}
                fill="none"
                stroke="#c5a059"
                strokeWidth="1"
                opacity="0.4"
              />

              {/* Classical 4-Point Star Jewel Accents at 3 and 9 o'clock */}
              <g transform={`translate(${center + radius + 15} ${center})`}>
                <polygon points="0,-4 3,0 0,4 -3,0" fill="#c5a059" opacity="0.8" />
              </g>
              <g transform={`translate(${center - radius - 15} ${center})`}>
                <polygon points="0,-4 3,0 0,4 -3,0" fill="#c5a059" opacity="0.8" />
              </g>

              {/* Etched Classical Roman Numeral Markers */}
              <text x={center} y={center - radius + 32} textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel', Georgia, serif" fontSize="16" fontWeight="bold" fill="#755f36" opacity="0.85">XII</text>
              <text x={center + radius - 32} y={center + 1} textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel', Georgia, serif" fontSize="16" fontWeight="bold" fill="#755f36" opacity="0.85">III</text>
              <text x={center} y={center + radius - 30} textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel', Georgia, serif" fontSize="16" fontWeight="bold" fill="#755f36" opacity="0.85">VI</text>
              <text x={center - radius + 32} y={center + 1} textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel', Georgia, serif" fontSize="16" fontWeight="bold" fill="#755f36" opacity="0.85">IX</text>

              {/* Background circle track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#gfGrandGoldBaseTrack)"
                strokeWidth={strokeWidth}
                className="opacity-65"
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
                      ? 'url(#gfGrandWarningArc)'
                      : 'url(#gfGrandGoldActiveArc)'
                  }
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.5s ease' }}
                />
              </g>

              {/* Glowing Gold Medallion Pearl Bead */}
              {fraction > 0.003 && (
                <g
                  transform={`rotate(${fraction * 360} ${center} ${center})`}
                  style={{ transition: 'transform 0.3s linear' }}
                >
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth + 5}
                    fill="#e0b85a"
                    opacity="0.35"
                  />
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth / 2 + 5}
                    fill="#141822"
                    stroke="#c5a059"
                    strokeWidth="2"
                  />
                  <circle
                    cx={center}
                    cy={center - radius}
                    r={strokeWidth / 2 + 2}
                    fill="url(#gfGoldPearlBead)"
                  />
                  <circle
                    cx={center - 2}
                    cy={center - radius - 2}
                    r="2"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                </g>
              )}
            </svg>

            {/* Centered High-Contrast Onyx Numerals & Status */}
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
                  {/* High-Contrast Numerals (Deep Onyx #0a0d14) */}
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
                          : 'text-[#0a0d14] drop-shadow-xs'
                      }`}
                    >
                      {formatTime(timeRemaining)}
                    </div>
                  </button>

                  {/* Elegant Status Subtitle with Gold Diamond Divider */}
                  <div className="mt-1 flex flex-col items-center">
                    <span className="font-cinzel text-xs sm:text-sm tracking-[0.25em] font-bold text-[#353e4d] uppercase">
                      {isCompleted
                        ? 'TIME EXPIRED'
                        : isPOIActive
                        ? 'POI IN PROGRESS · 15S MAX'
                        : !isRunning
                        ? 'TIMER PAUSED'
                        : 'SPEAKING TIME'}
                    </span>
                    <div className="mt-1 flex items-center justify-center gap-2 opacity-85">
                      <div className="h-[0.5px] w-8 bg-gradient-to-r from-transparent to-[#c5a059]" />
                      <GoldDiamond className="w-2.5 h-2.5" />
                      <div className="h-[0.5px] w-8 bg-gradient-to-l from-transparent to-[#c5a059]" />
                    </div>
                  </div>

                  {/* Sleek High-Contrast Quick Adjust Buttons Bar */}
                  <div 
                    className="relative z-30 flex items-center justify-center gap-1 mt-2 bg-[#fdfaf5]/90 border border-[#c5a059]/45 rounded-full px-2 py-0.5 shadow-2xs backdrop-blur-xs transition-transform duration-300 hover:scale-[1.02]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, -60)}
                      title="-1 minute"
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-gray-50 text-[#12161d] border border-[#c5a059]/35 text-[11px] font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[38px]"
                    >
                      -1m
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, -30)}
                      title="-30 seconds"
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-gray-50 text-[#12161d] border border-[#c5a059]/35 text-[11px] font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[40px]"
                    >
                      -30s
                    </button>
                    <div className="h-3 w-[1px] bg-[#c5a059]/40 mx-0.5" />
                    <button
                      type="button"
                      onClick={handleOpenEditTime}
                      title="Edit Time"
                      className="px-2.5 py-0.5 rounded-full bg-[#161e2b] hover:bg-[#253245] text-amber-200 border border-[#c5a059] text-[11px] font-cinzel font-bold shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-2.5 h-2.5 text-[#c5a059]" />
                      <span>Edit Time</span>
                    </button>
                    <div className="h-3 w-[1px] bg-[#c5a059]/40 mx-0.5" />
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, 30)}
                      title="+30 seconds"
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-gray-50 text-[#12161d] border border-[#c5a059]/35 text-[11px] font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[40px]"
                    >
                      +30s
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdjust(e, 60)}
                      title="+1 minute"
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-gray-50 text-[#12161d] border border-[#c5a059]/35 text-[11px] font-cinzel font-extrabold shadow-2xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer min-w-[38px]"
                    >
                      +1m
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Monumental Symmetrical Dual Laurel Base */}
          <div className="relative -mt-10 sm:-mt-12 z-0 flex justify-center pointer-events-none select-none">
            <ChronometerLaurelBase className="w-[330px] sm:w-[390px] md:w-[440px] h-[75px] sm:h-[90px] drop-shadow-sm opacity-95" />
          </div>

          {/* Symmetrical 3-Button Control Deck on the Marble Steps */}
          <div className="flex items-center justify-center gap-8 sm:gap-11 mt-1">
            {/* Reset */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onReset}
                title="Reset timer (R)"
                className="group w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#fdfaf5] hover:bg-white border border-[#c5a059]/50 shadow-sm hover:shadow-md flex items-center justify-center text-[#18202d] transition-all duration-200 active:scale-90 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
              </button>
              <span className="font-cinzel text-[10px] tracking-widest text-[#5a6476] uppercase font-semibold">
                Reset
              </span>
            </div>

            {/* Play / Pause with Radiant Gold Aura Ring */}
            <div className="flex flex-col items-center gap-1 relative">
              {isRunning && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-radar-ripple pointer-events-none" />
              )}
              <button
                onClick={onStartPause}
                title={isRunning ? 'Pause timer (Space)' : 'Start timer (Space)'}
                className={`relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 ring-2 ring-[#c5a059] shadow-[0_0_28px_rgba(197,160,89,0.55)] ${
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
                className={`group w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  hasNextSpeaker
                    ? 'bg-[#fdfaf5] hover:bg-white border border-[#c5a059]/50 shadow-sm hover:shadow-md text-[#18202d] cursor-pointer'
                    : 'bg-[#e2ddd5]/40 border border-black/5 text-[#9ea7b5] cursor-not-allowed opacity-50'
                }`}
              >
                <SkipForward className={`w-5 h-5 transition-transform duration-300 ${hasNextSpeaker ? 'group-hover:translate-x-0.5' : ''}`} />
              </button>
              <span className="font-cinzel text-[10px] tracking-widest text-[#5a6476] uppercase font-semibold">
                Next
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Extravagant Opposition Monument Podium */}
        <ExtravagantPodium
          teamType="opposition"
          teamName={oppTeamName}
          onUpdateTeamName={onUpdateOppTeamName}
          speakers={oppSpeakers}
          activeSpeakerId={activeSpeaker.id}
          isOpposingActiveSpeaker={activeSpeaker.team === 'proposition'}
          activeSpeakerTimeRemaining={activeSpeaker.timeRemaining}
          onCallPOI={() => onTriggerPOIRequest('opposition')}
          onSelectSpeaker={(id) => onSelectIndex(speakingOrder.findIndex((s) => s.id === id))}
          onUpdateSpeakerName={onUpdateSpeakerName}
        />
      </main>

      {/* 4. High-Visibility Bottom Stepper on the Classical Floor */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center pb-2.5 pt-0.5 select-none">
        <div className="relative flex items-center justify-center w-full max-w-[460px] sm:max-w-[540px] bg-[#fcfaf5]/90 backdrop-blur-md border border-[#c5a059]/45 rounded-full px-4 sm:px-6 py-2 shadow-sm">
          {/* Connecting line across discs */}
          <div className="absolute top-[18px] sm:top-[20px] left-8 right-8 h-[1.5px] bg-[#c5a059]/40 z-0" />
          <div
            className="absolute top-[18px] sm:top-[20px] left-8 h-[2px] bg-gradient-to-r from-[#886729] via-[#c5a059] to-[#ebd08c] z-0 transition-all duration-500 ease-out"
            style={{ width: `calc((100% - 64px) * ${progressPercent / 100})` }}
          />

          {/* 6 Speeches (01 through 06 with Clear Numbers & Roles) */}
          <div className="relative z-10 flex items-center justify-between w-full">
            {speakingOrder.map((sp, idx) => {
              const isActive = idx === currentIndex;
              const isSpCompleted = sp.hasSpoken && !isActive;

              return (
                <button
                  key={sp.id}
                  onClick={() => onSelectIndex(idx)}
                  className="group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer transition-transform hover:scale-108 active:scale-95 px-1"
                >
                  {/* Numbered Circular Badge */}
                  {isActive ? (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#c5a059]/40 animate-progress-ping pointer-events-none" />
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#121620] flex items-center justify-center bg-gradient-to-b from-[#f7e6b5] to-[#c5a059] shadow-md">
                        <span className="font-cinzel text-[10px] font-black text-[#121620]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ) : isSpCompleted ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e8ded0] border border-[#c5a059] flex items-center justify-center shadow-xs">
                      <span className="font-cinzel text-[9px] font-bold text-[#69542a]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-[#c5a059]/50 flex items-center justify-center shadow-2xs group-hover:border-[#121620] transition-colors">
                      <span className="font-cinzel text-[9px] font-bold text-[#443825]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  {/* Centered Diamond Accent & Role */}
                  <div className="flex flex-col items-center mt-1">
                    <span className={`text-[6px] sm:text-[7px] leading-none ${isActive ? 'text-[#8d6928]' : 'text-[#a18c66]'}`}>
                      ◆
                    </span>
                    <span className={`font-cinzel text-[8px] sm:text-[9px] mt-0.5 tracking-wider uppercase ${
                      isActive ? 'font-black text-[#121620]' : 'font-bold text-[#4c3e29]'
                    }`}>
                      {sp.roleAbbr}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
