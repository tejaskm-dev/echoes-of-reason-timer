import React, { useState, useEffect } from 'react';
import { RotateCcw, SkipForward, Hand, Edit2, Check, X, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import type { Speaker, TimerStatus, RoundStage, POIState } from '../types/debate';
import { formatTime } from '../utils/time';
import { GoldDiamond } from './ClassicalDecors';
import { playTactileClick } from '../utils/audio';

interface DebateTimerProps {
  activeSpeaker: Speaker;
  roundStage: RoundStage;
  propTeamName?: string;
  oppTeamName?: string;
  onSelectRound: (round: RoundStage) => void;
  timerStatus: TimerStatus;
  timeRemaining: number;
  totalDuration: number;
  poiState: POIState;
  onStartPause: () => void;
  onReset: () => void;
  onNextSpeaker: () => void;
  hasNextSpeaker: boolean;
  onUpdateTime: (newSeconds: number, newTotalDuration?: number) => void;
}

export const DebateTimer: React.FC<DebateTimerProps> = ({
  activeSpeaker,
  roundStage,
  propTeamName,
  oppTeamName,
  onSelectRound,
  timerStatus,
  timeRemaining,
  totalDuration,
  poiState,
  onStartPause,
  onReset,
  onNextSpeaker,
  hasNextSpeaker,
  onUpdateTime,
}) => {
  const isRunning = timerStatus === 'running';
  const isCompleted = timeRemaining <= 0;
  const isProp = activeSpeaker.team === 'proposition';
  const isPOIActive = poiState.status === 'active';

  // Timer editing state (using string states to prevent backspace lockup)
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [minStr, setMinStr] = useState('');
  const [secStr, setSecStr] = useState('');
  const minInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenEditTime = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isRunning) {
      onStartPause(); // Automatically pause when editing begins
    }
    const mins = Math.floor(timeRemaining / 60);
    const secs = Math.floor(timeRemaining % 60);
    setMinStr(String(mins));
    setSecStr(String(secs).padStart(2, '0'));
    setIsEditingTime(true);
  };

  // Auto-focus & select minutes when editor opens
  useEffect(() => {
    if (isEditingTime) {
      const timer = setTimeout(() => {
        minInputRef.current?.focus();
        minInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isEditingTime]);

  const handleApplyTime = React.useCallback(() => {
    const m = Math.max(0, parseInt(minStr, 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(secStr, 10) || 0));
    const total = Math.max(1, m * 60 + s);
    // Apply total as both the remaining time and the new total duration
    onUpdateTime(total, total);
    setIsEditingTime(false);
  }, [minStr, secStr, onUpdateTime]);

  const handleQuickAdjust = (e: React.MouseEvent, deltaSeconds: number) => {
    e.preventDefault();
    e.stopPropagation();
    playTactileClick();
    const next = Math.max(0, timeRemaining + deltaSeconds);
    // Before timer starts (idle), adjusting the time sets the total speech duration!
    const nextTotal = timerStatus === 'idle'
      ? next
      : (deltaSeconds > 0 ? totalDuration + deltaSeconds : totalDuration);
    onUpdateTime(next, nextTotal);
  };

  const handleSetPreset = (minutes: number, seconds: number) => {
    playTactileClick();
    setMinStr(String(minutes));
    setSecStr(String(seconds).padStart(2, '0'));
  };

  const adjustMinutes = (delta: number) => {
    const current = parseInt(minStr, 10) || 0;
    const next = Math.max(0, Math.min(99, current + delta));
    setMinStr(String(next));
  };

  const adjustSeconds = (delta: number) => {
    const current = parseInt(secStr, 10) || 0;
    let next = current + delta;
    if (next < 0) next = 59;
    if (next > 59) next = 0;
    setSecStr(String(next).padStart(2, '0'));
  };

  // Keyboard support during timer editing (Enter to save, Esc to cancel)
  useEffect(() => {
    if (!isEditingTime) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApplyTime();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditingTime(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingTime, handleApplyTime]);

  // Massive SVG circular progress calculation (taking 65-75% screen prominence)
  const size = 640;
  const center = size / 2; // 320
  const strokeWidth = 16;
  const radius = 276;
  const circumference = 2 * Math.PI * radius;

  const safeTotal = Math.max(1, totalDuration);
  const fraction = Math.max(0, Math.min(1, timeRemaining / safeTotal));
  const strokeDashoffset = circumference * (1 - fraction);

  // 60 minute chronometer ticks
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

  const roundOptions: RoundStage[] = [
    'Round 3: Semifinal',
    'Round 4: Grand Final',
    'Round 1: Qualifier',
    'Round 2: Qualifier',
  ];

  const handleNextRound = () => {
    const currentIdx = roundOptions.indexOf(roundStage);
    const nextIdx = (currentIdx + 1) % roundOptions.length;
    onSelectRound(roundOptions[nextIdx]);
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-0.5 px-2 w-full max-w-[860px] xl:max-w-[960px]">
      {/* 1. Single Compact Integrated Round & Active Speaker Headline */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-1">
        <button
          onClick={handleNextRound}
          title="Click to cycle rounds: Semifinal -> Grand Final -> Qualifier"
          className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full bg-[#e8e1d5]/90 hover:bg-[#efe9df] border border-white/80 shadow-xs btn-spring cursor-pointer group"
        >
          <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] font-bold text-[#5c4a28] uppercase">
            {roundStage}
          </span>
          <span className="ml-1 text-[10px] text-[#c5a059] opacity-70 group-hover:opacity-100">↻</span>
        </button>

        <span className="text-[#c5a059] opacity-60 font-serif text-xs">·</span>

        <h3 key={activeSpeaker.id} className="animate-numeral-crossfade font-cinzel text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-bold text-[#141820] flex items-center gap-1.5 text-center">
          <span className={isProp ? 'text-blue-950 font-extrabold' : 'text-rose-950 font-extrabold'}>
            {isProp
              ? `${(propTeamName || 'TEAM 1').toUpperCase()} · PROPOSITION`
              : `${(oppTeamName || 'TEAM 2').toUpperCase()} · OPPOSITION`}
          </span>
          <span className="text-[#c5a059] font-normal">·</span>
          <span className="text-[#2b3342]">{activeSpeaker.role.toUpperCase()}</span>
        </h3>
      </div>

      {/* 3. Massive Circular Timer Display (65-75% Dominant Central Focal Point) */}
      <div className="relative clock-dial-responsive flex items-center justify-center my-0.5">
        {/* Ambient Frosted Halo Face */}
        <div 
          className={`absolute inset-2 sm:inset-3 rounded-full clock-face-halo transition-all duration-700 pointer-events-none ${
            isPOIActive 
              ? 'ring-4 ring-rose-500/50 shadow-[0_0_60px_rgba(225,29,72,0.3)]' 
              : isRunning
              ? 'animate-halo-breathing'
              : 'shadow-[0_24px_60px_-12px_rgba(30,25,18,0.12)]'
          }`} 
        />

        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Proposition Royal Sapphire Gradient */}
            <linearGradient id="propTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="40%" stopColor="#1d4ed8" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            {/* Opposition Crimson Wine Gradient */}
            <linearGradient id="oppTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4c0519" />
              <stop offset="40%" stopColor="#be123c" />
              <stop offset="80%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>

            {/* Warning / Low time Gradient (< 30s) */}
            <linearGradient id="warningTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>

            {/* Jewel Bead Radial Glow Filter */}
            <filter id="luxuryBeadGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={isProp ? '#2563eb' : '#e11d48'} floodOpacity="0.8" />
              <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor={isProp ? '#60a5fa' : '#fb7185'} floodOpacity="0.4" />
            </filter>

            {/* Jewel Bead Gradient */}
            <radialGradient id="beadJewelGradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor={isProp ? '#93c5fd' : '#fecdd3'} />
              <stop offset="80%" stopColor={isProp ? '#2563eb' : '#e11d48'} />
              <stop offset="100%" stopColor={isProp ? '#1e3a8a' : '#881337'} />
            </radialGradient>
          </defs>

          {/* Delicate Minute Track Ticks (Chronometer Finish) */}
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

          {/* Inner hairline guide ring */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2 - 3}
            fill="none"
            stroke="#c5a059"
            strokeWidth="0.75"
            strokeDasharray="2, 6"
            opacity="0.35"
          />

          {/* Active progress countdown arc (Rotated from 12 o'clock) */}
          <g transform={`rotate(-90 ${center} ${center})`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={
                timeRemaining <= 30 && timeRemaining > 0
                  ? 'url(#warningTimerGradient)'
                  : isProp
                  ? 'url(#propTimerGradient)'
                  : 'url(#oppTimerGradient)'
              }
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
              }}
            />
          </g>

          {/* EXQUISITE LUXURY CHRONOMETER INDICATOR BEAD (Hardware GPU Accelerated Fluid Rotation) */}
          {fraction > 0.003 && (
            <g
              transform={`rotate(${fraction * 360} ${center} ${center})`}
              style={{
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Outer Radiant Glow Halo */}
              <circle
                cx={center}
                cy={center - radius}
                r={strokeWidth + 4}
                fill={isProp ? '#3b82f6' : '#e11d48'}
                opacity="0.28"
                filter="url(#luxuryBeadGlow)"
              />

              {/* Polished Metallic Bezel Ring */}
              <circle
                cx={center}
                cy={center - radius}
                r={strokeWidth / 2 + 5}
                fill="#ffffff"
                stroke="#c5a059"
                strokeWidth="2.5"
                filter="url(#luxuryBeadGlow)"
              />

              {/* Inner Radiant Chronometer Jewel Core */}
              <circle
                cx={center}
                cy={center - radius}
                r={strokeWidth / 2 + 1.5}
                fill="url(#beadJewelGradient)"
              />

              {/* Center Specular Glint Highlight */}
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

        {/* Center Timer Display & Interactive Adjuster */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Active POI Banner Inside Face if POI is running */}
          {isPOIActive && (
            <div className="mb-2 px-4 py-1 rounded-full bg-rose-900/90 text-amber-200 border border-amber-300/40 animate-pulse flex items-center gap-2 shadow-lg">
              <Hand className="w-4 h-4 text-amber-300" />
              <span className="font-cinzel text-xs tracking-widest uppercase font-bold">
                POI Active · 15s Max
              </span>
            </div>
          )}

          {/* TIMER NUMERALS OR INLINE TIME EDITOR */}
          {isEditingTime ? (
            <div className="flex flex-col items-center gap-2.5 p-4 sm:p-5 bg-[#faf7f2]/98 backdrop-blur-md rounded-3xl border-2 border-[#c5a059] shadow-2xl animate-in zoom-in-95 duration-200 w-[295px] sm:w-[330px]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="font-cinzel text-xs uppercase font-bold text-[#7a5c24] tracking-widest">
                  Edit Speaker Timer
                </span>
              </div>
              
              {/* Steppers & Numerals */}
              <div className="flex items-center justify-center gap-3 my-1">
                {/* Minutes Stepper */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => adjustMinutes(1)}
                    className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full transition-colors cursor-pointer"
                    title="Add 1 minute"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <input
                    ref={minInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={minStr}
                    onChange={(e) => setMinStr(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => {
                      if (!minStr) setMinStr('0');
                    }}
                    className="w-16 text-center text-4xl font-num font-bold bg-white border-2 border-[#c5a059]/60 rounded-xl py-1 text-[#12161d] outline-none focus:ring-2 focus:ring-[#c5a059] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => adjustMinutes(-1)}
                    className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full transition-colors cursor-pointer"
                    title="Subtract 1 minute"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-cinzel text-gray-500 uppercase font-bold tracking-wider mt-0.5">Mins</span>
                </div>

                <span className="text-4xl font-num font-bold text-[#c5a059] pb-6">:</span>

                {/* Seconds Stepper */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => adjustSeconds(5)}
                    className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full transition-colors cursor-pointer"
                    title="Add 5 seconds"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={secStr}
                    onChange={(e) => setSecStr(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => {
                      if (!secStr) {
                        setSecStr('00');
                      } else {
                        const val = Math.min(59, parseInt(secStr, 10) || 0);
                        setSecStr(String(val).padStart(2, '0'));
                      }
                    }}
                    className="w-16 text-center text-4xl font-num font-bold bg-white border-2 border-[#c5a059]/60 rounded-xl py-1 text-[#12161d] outline-none focus:ring-2 focus:ring-[#c5a059] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => adjustSeconds(-5)}
                    className="p-1 hover:bg-[#ede5d8] text-[#554325] rounded-full transition-colors cursor-pointer"
                    title="Subtract 5 seconds"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-cinzel text-gray-500 uppercase font-bold tracking-wider mt-0.5">Secs</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1 mt-0.5">
                {[
                  { label: '4:00 (Standard)', m: 4, s: 0 },
                  { label: '5:00', m: 5, s: 0 },
                  { label: '3:00', m: 3, s: 0 },
                  { label: '2:00', m: 2, s: 0 },
                  { label: '1:00', m: 1, s: 0 },
                  { label: '0:30', m: 0, s: 30 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSetPreset(p.m, p.s)}
                    className="px-2 py-0.5 text-[10px] font-cinzel font-semibold bg-[#ede5d8] hover:bg-[#dfd4c0] text-[#3b301c] rounded-md transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Save & Cancel */}
              <div className="flex items-center gap-2 mt-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsEditingTime(false)}
                  className="flex-1 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-cinzel text-xs uppercase font-semibold hover:bg-gray-100 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyTime}
                  className="flex-1 py-1.5 rounded-xl bg-[#12161d] text-white font-cinzel text-xs uppercase font-bold hover:bg-[#252f3e] flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" /> Apply
                </button>
              </div>
            </div>
          ) : (
            /* Clickable Numerals & Quick Adjustment Bar */
            <div className="relative z-20 flex flex-col items-center select-none">
              <button
                type="button"
                onClick={handleOpenEditTime}
                title="Click to manually edit speech time"
                className="cursor-pointer hover:opacity-90 hover:scale-[1.015] transition-all duration-300 outline-none block"
              >
                <div
                  key={activeSpeaker.id}
                  className={`font-num font-normal tracking-tight numerals-responsive select-none animate-numeral-crossfade ${
                    isCompleted
                      ? 'text-rose-600 animate-bounce'
                      : timeRemaining <= 30
                      ? 'text-amber-700 animate-pulse'
                      : isRunning
                      ? 'text-[#0a0e16] drop-shadow-xs'
                      : 'text-[#0e1219]'
                  }`}>
                  {formatTime(timeRemaining)}
                </div>
              </button>

              {/* Prominent Classical Quick Time Adjustment Controls */}
              <div 
                className="relative z-30 flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-3.5 bg-[#ede4d4]/95 border border-[#c5a059]/50 rounded-full px-2 py-1.5 shadow-sm backdrop-blur-xs transition-transform duration-300 hover:scale-[1.02]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* -1m */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdjust(e, -60)}
                  title="Subtract 1 minute (-1m)"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] hover:text-[#0a0d13] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-cinzel font-extrabold tracking-wider shadow-2xs hover:shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[42px] sm:min-w-[46px]"
                >
                  -1m
                </button>

                {/* -30s */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdjust(e, -30)}
                  title="Subtract 30 seconds (-30s)"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] hover:text-[#0a0d13] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-cinzel font-extrabold tracking-wider shadow-2xs hover:shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] sm:min-w-[48px]"
                >
                  -30s
                </button>

                <div className="h-4 w-[1px] bg-[#c5a059]/50 mx-0.5" />

                {/* Edit Time Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTactileClick();
                    handleOpenEditTime(e);
                  }}
                  title="Click to open manual MM:SS editor"
                  className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#161e2b] hover:bg-[#253245] text-amber-200 hover:text-amber-100 border border-[#c5a059] text-xs font-cinzel font-bold tracking-wider shadow-xs hover:shadow-md hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3 text-[#c5a059]" />
                  <span>Edit Time</span>
                </button>

                <div className="h-4 w-[1px] bg-[#c5a059]/50 mx-0.5" />

                {/* +30s */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdjust(e, 30)}
                  title="Add 30 seconds (+30s)"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] hover:text-[#0a0d13] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-cinzel font-extrabold tracking-wider shadow-2xs hover:shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] sm:min-w-[48px]"
                >
                  +30s
                </button>

                {/* +1m */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdjust(e, 60)}
                  title="Add 1 minute (+1m)"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#fdfbf7] hover:bg-white text-[#2a3342] hover:text-[#0a0d13] border border-[#c5a059]/40 hover:border-[#c5a059] text-xs font-cinzel font-extrabold tracking-wider shadow-2xs hover:shadow-xs hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[42px] sm:min-w-[46px]"
                >
                  +1m
                </button>
              </div>
            </div>
          )}

          {/* Subtitle label with Status */}
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

      {/* 4. Perfectly Centered 3-Button Control Deck (Bouncy Fluid Springs) */}
      <div className="flex items-center justify-center gap-8 sm:gap-11 mt-1 sm:mt-1.5">
        {/* Reset Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onReset}
            title="Reset timer to 04:00 (R)"
            className="group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#eae3d6]/85 hover:bg-white border border-white/80 shadow-xs hover:shadow-md flex items-center justify-center text-[#373f4e] hover:text-[#11151c] transition-all duration-200 active:scale-90 cursor-pointer"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
          </button>
          <span className="font-cinzel text-[10px] tracking-widest text-[#697384] uppercase font-semibold">
            Reset
          </span>
        </div>

        {/* Large Prominent Start / Pause Button (With Optically Centered Play Triangle & Radar Pulse Wave) */}
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
            aria-label={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <div className="flex items-center justify-center w-full h-full">
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              </div>
            ) : (
              /* Optically centered play triangle inside circle */
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

        {/* Next Speaker Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onNextSpeaker}
            disabled={!hasNextSpeaker}
            title={hasNextSpeaker ? 'Move to next speaker (N)' : 'Debate completed'}
            className={`group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
              hasNextSpeaker
                ? 'bg-[#eae3d6]/85 hover:bg-white border border-white/80 shadow-xs hover:shadow-md text-[#373f4e] hover:text-[#11151c] cursor-pointer'
                : 'bg-[#e2ddd5]/40 border border-black/5 text-[#9ea7b5] cursor-not-allowed opacity-50'
            }`}
            aria-label="Next Speaker"
          >
            <SkipForward className={`w-5 h-5 transition-transform duration-300 ${hasNextSpeaker ? 'group-hover:translate-x-0.5' : ''}`} />
          </button>
          <span className="font-cinzel text-[10px] tracking-widest text-[#697384] uppercase font-semibold">
            Next
          </span>
        </div>
      </div>
    </div>
  );
};
