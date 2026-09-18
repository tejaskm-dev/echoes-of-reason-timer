import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MotionBanner } from './components/MotionBanner';
import { TeamPanel } from './components/TeamPanel';
import { DebateTimer } from './components/DebateTimer';
import { CrossExamPanel } from './components/CrossExamPanel';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Footer } from './components/Footer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DebateCompletedModal } from './components/DebateCompletedModal';
import { RulesModal } from './components/RulesModal';
import { GrandFinalScreen } from './components/GrandFinalScreen';
import type { Speaker, TimerStatus, RoundStage, DebateSegment } from './types/debate';
import {
  buildSegments,
  SEGMENT_SHORT_LABELS,
  SPEECH_DURATION,
} from './utils/segments';
import {
  playDebateBell,
  playDoubleBell,
  playTactileClick,
  setSoundEnabled as setAudioEngineSound,
} from './utils/audio';

// Six speakers in official Asian Parliamentary order. Timing lives on the
// segments built from this roster (3:00 speech, then 1:00 cross-questioning
// and 1:00 reply for the four main speeches) — see utils/segments.ts.
const INITIAL_SPEAKERS: Speaker[] = [
  {
    id: 'prop-1',
    team: 'proposition',
    number: 1,
    orderIndex: 1,
    role: 'Prime Minister',
    roleAbbr: 'PM',
    name: 'Speaker 1',
    hasCrossExam: true,
  },
  {
    id: 'opp-1',
    team: 'opposition',
    number: 1,
    orderIndex: 2,
    role: 'Leader of Opposition',
    roleAbbr: 'LO',
    name: 'Speaker 1',
    hasCrossExam: true,
  },
  {
    id: 'prop-2',
    team: 'proposition',
    number: 2,
    orderIndex: 3,
    role: 'Deputy Prime Minister',
    roleAbbr: 'DPM',
    name: 'Speaker 2',
    hasCrossExam: true,
  },
  {
    id: 'opp-2',
    team: 'opposition',
    number: 2,
    orderIndex: 4,
    role: 'Deputy Leader of Opp',
    roleAbbr: 'DLO',
    name: 'Speaker 2',
    hasCrossExam: true,
  },
  {
    id: 'opp-3',
    team: 'opposition',
    number: 3,
    orderIndex: 5,
    role: 'Opposition Closing',
    roleAbbr: 'Opp Closing',
    name: 'Speaker 3',
    hasCrossExam: false,
  },
  {
    id: 'prop-3',
    team: 'proposition',
    number: 3,
    orderIndex: 6,
    role: 'Proposition Closing',
    roleAbbr: 'Prop Closing',
    name: 'Speaker 3',
    hasCrossExam: false,
  },
];

export default function App() {
  // Screen Mode: 'semifinals' | 'grand_final'
  const [screenMode, setScreenMode] = useState<'semifinals' | 'grand_final'>('semifinals');

  // Debate Round Stage & Editable Topic Motion (Defaults to Semifinal 2: Utopia vs She He He)
  const [roundStage, setRoundStage] = useState<RoundStage>('Round 3: Semifinal');
  const [motion, setMotion] = useState<string>(
    'This house would allow open borders—permitting anyone to migrate and work in any country, with no restrictions on citizenship or labor market access.'
  );
  const [propTeamName, setPropTeamName] = useState<string>('Team Utopia');
  const [oppTeamName, setOppTeamName] = useState<string>('Team She He He');

  // Grand Final state (Defaults to Team Utopia vs Team She He He)
  const [grandFinalMotion, setGrandFinalMotion] = useState<string>(
    'This house would allow open borders—permitting anyone to migrate and work in any country, with no restrictions on citizenship or labor market access.'
  );
  const [gfPropTeamName, setGfPropTeamName] = useState<string>('Team Utopia');
  const [gfOppTeamName, setGfOppTeamName] = useState<string>('Team She He He');

  const handleSelectScreenMode = useCallback((mode: 'semifinals' | 'grand_final') => {
    playTactileClick();
    setScreenMode(mode);
    if (mode === 'grand_final') {
      setRoundStage('Round 4: Grand Final');
    } else {
      setRoundStage('Round 3: Semifinal');
    }
  }, []);

  const handleSelectRound = useCallback((stage: RoundStage) => {
    playTactileClick();
    setRoundStage(stage);
    if (stage === 'Round 4: Grand Final') {
      setScreenMode('grand_final');
    } else {
      setScreenMode('semifinals');
    }
  }, []);

  // Roster (identity only) and the 14-segment running order that carries all timing
  const [speakingOrder, setSpeakingOrder] = useState<Speaker[]>(INITIAL_SPEAKERS);
  const [segments, setSegments] = useState<DebateSegment[]>(() => buildSegments(INITIAL_SPEAKERS));
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);

  // Timer State
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);

  // Active segment and the speaker it belongs to
  const activeSegment = segments[currentSegmentIndex] ?? segments[0];
  const activeSpeaker =
    speakingOrder.find((s) => s.id === activeSegment.speakerId) ?? speakingOrder[0];

  const nextSegment: DebateSegment | undefined = segments[currentSegmentIndex + 1];

  // "Q&A" / "Reply" while still on the same speaker, then "Next Speaker", and
  // "Conclude" on the final phase so the debate can actually be closed out.
  const nextSegmentLabel = useMemo(() => {
    if (!nextSegment) return 'Conclude';
    return nextSegment.speakerId === activeSegment.speakerId
      ? SEGMENT_SHORT_LABELS[nextSegment.kind]
      : 'Next Speaker';
  }, [nextSegment, activeSegment.speakerId]);

  // Advancing stays available on the last phase (it concludes the debate) and
  // only switches off once that final phase has been run.
  const canAdvance = Boolean(nextSegment) || !activeSegment.hasRun;

  // Cross-questioning and reply take the motion's slot while they run
  const isQuestionPhase = activeSegment.kind !== 'speech';

  // Ref tracking for precision timestamp calculation & the phase warning bell
  const lastTickRef = useRef<number | null>(null);
  const rungWarningRef = useRef<boolean>(false);

  // Latest segments, so moderator handlers stay stable across timer ticks
  const segmentsRef = useRef(segments);
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Sound toggle sync
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      setAudioEngineSound(next);
      return next;
    });
  }, []);

  /**
   * The warning bell fires one minute out on a 3:00 speech and thirty seconds
   * out on the 1:00 cross-questioning and reply phases.
   */
  const warningThresholdFor = (totalDuration: number) => (totalDuration >= 120 ? 60 : 30);

  // Update a segment's remaining time & (optionally) its configured length
  const updateSegmentTime = useCallback(
    (segmentId: string, time: number, newTotalDuration?: number) => {
      const clampedTime = Math.max(0, Math.round(time));
      setSegments((prev) =>
        prev.map((seg) => {
          if (seg.id !== segmentId) return seg;
          const updatedTotal =
            newTotalDuration !== undefined
              ? Math.max(clampedTime, Math.round(newTotalDuration))
              : Math.max(seg.totalDuration, clampedTime);
          return {
            ...seg,
            timeRemaining: clampedTime,
            totalDuration: updatedTotal,
            // Putting time back on a phase re-arms it, so Reset genuinely lets
            // a phase be re-run (including the final one, to re-open the recap)
            hasRun: clampedTime === 0,
          };
        })
      );
      // If setting positive time on completed, restore timer to paused/idle
      if (clampedTime > 0) {
        setTimerStatus((curr) => (curr === 'completed' ? 'paused' : curr));
      }
      // Re-arm the warning bell if adjusted back above its threshold
      const target = segmentsRef.current.find((seg) => seg.id === segmentId);
      const effectiveTotal = newTotalDuration ?? target?.totalDuration ?? clampedTime;
      if (clampedTime > warningThresholdFor(effectiveTotal)) {
        rungWarningRef.current = false;
      }
    },
    []
  );

  // Update a speaker's name
  const updateSpeakerName = useCallback((speakerId: string, newName: string) => {
    setSpeakingOrder((prev) =>
      prev.map((s) => (s.id === speakerId ? { ...s, name: newName } : s))
    );
  }, []);

  // Re-arm the warning bell whenever the floor moves to a new segment
  useEffect(() => {
    rungWarningRef.current = false;
  }, [currentSegmentIndex]);

  // High-Precision Segment Timer Loop
  useEffect(() => {
    if (timerStatus !== 'running') {
      lastTickRef.current = null;
      return;
    }

    lastTickRef.current = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const delta = lastTickRef.current ? (now - lastTickRef.current) / 1000 : 1;
      lastTickRef.current = now;

      setSegments((prevSegments) => {
        const current = prevSegments[currentSegmentIndex];
        if (!current) return prevSegments;

        const prevTime = current.timeRemaining;
        const newTime = Math.max(0, prevTime - delta);
        const threshold = warningThresholdFor(current.totalDuration);

        // Single warning chime as the phase enters its final stretch
        if (
          prevTime > threshold &&
          newTime <= threshold &&
          current.totalDuration > threshold &&
          !rungWarningRef.current
        ) {
          rungWarningRef.current = true;
          playDebateBell(current.kind === 'speech' ? 880 : 760, 1.6);
        }

        // Double bell at 00:00 - phase expired
        if (newTime === 0 && prevTime > 0) {
          setTimerStatus('completed');
          playDoubleBell();
        }

        return prevSegments.map((seg, idx) =>
          idx === currentSegmentIndex
            ? { ...seg, timeRemaining: newTime, hasRun: newTime === 0 ? true : seg.hasRun }
            : seg
        );
      });
    }, 200);

    return () => clearInterval(interval);
  }, [timerStatus, currentSegmentIndex]);

  // Moderator Controls: Start / Pause
  const handleStartPause = useCallback(() => {
    playTactileClick();
    if (timerStatus === 'running') {
      setTimerStatus('paused');
      return;
    }
    const current = segmentsRef.current[currentSegmentIndex];
    // Restarting an expired phase puts its full time back on the clock
    if (current && current.timeRemaining <= 0) {
      updateSegmentTime(current.id, current.totalDuration, current.totalDuration);
    }
    setTimerStatus('running');
  }, [timerStatus, currentSegmentIndex, updateSegmentTime]);

  // Moderator Controls: Reset the current phase to its full length
  const handleReset = useCallback(() => {
    playTactileClick();
    const current = segmentsRef.current[currentSegmentIndex];
    if (!current) return;
    setTimerStatus('idle');
    updateSegmentTime(current.id, current.totalDuration, current.totalDuration);
    rungWarningRef.current = false;
  }, [currentSegmentIndex, updateSegmentTime]);

  // Moderator Controls: advance through the running order one phase at a time
  const handleNextSegment = useCallback(() => {
    playTactileClick();
    // Mark the phase just finished as run
    setSegments((prev) =>
      prev.map((seg, idx) => (idx === currentSegmentIndex ? { ...seg, hasRun: true } : seg))
    );

    const all = segmentsRef.current;
    if (currentSegmentIndex < all.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIndex);
      setTimerStatus('idle');
      const upcoming = all[nextIndex];
      // Re-entering a phase that already ran puts its full time back
      if (upcoming.timeRemaining === 0) {
        updateSegmentTime(upcoming.id, upcoming.totalDuration, upcoming.totalDuration);
      }
    } else {
      // All 14 phases done — the debate is over
      setTimerStatus('completed');
      setIsCompletedModalOpen(true);
    }
  }, [currentSegmentIndex, updateSegmentTime]);

  const handlePrevSegment = useCallback(() => {
    if (currentSegmentIndex === 0) return;
    playTactileClick();
    setTimerStatus('idle');
    setCurrentSegmentIndex(currentSegmentIndex - 1);
  }, [currentSegmentIndex]);

  // Jump straight to a phase from a stepper bead
  const handleSelectSegmentIndex = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= segmentsRef.current.length || idx === currentSegmentIndex) return;
      playTactileClick();
      setTimerStatus('idle');
      setCurrentSegmentIndex(idx);
    },
    [currentSegmentIndex]
  );

  // Jump to a speaker's first unfinished phase (podium row click)
  const handleSelectSpeaker = useCallback(
    (speakerId: string) => {
      const own = segmentsRef.current
        .map((seg, idx) => ({ seg, idx }))
        .filter(({ seg }) => seg.speakerId === speakerId);
      if (own.length === 0) return;
      const target = own.find(({ seg }) => !seg.hasRun) ?? own[0];
      handleSelectSegmentIndex(target.idx);
    },
    [handleSelectSegmentIndex]
  );

  // Restart Entire Debate
  const handleRestartDebate = useCallback(() => {
    playTactileClick();
    setSpeakingOrder(INITIAL_SPEAKERS);
    setSegments(buildSegments(INITIAL_SPEAKERS));
    setCurrentSegmentIndex(0);
    setTimerStatus('idle');
    setIsCompletedModalOpen(false);
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleStartPause();
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
        case 'KeyN':
          e.preventDefault();
          if (canAdvance) {
            handleNextSegment();
          }
          break;
        case 'KeyB':
          e.preventDefault();
          handlePrevSegment();
          break;
        case 'Escape':
          e.preventDefault();
          if (isShortcutsOpen) {
            setIsShortcutsOpen(false);
          } else if (isRulesOpen) {
            setIsRulesOpen(false);
          } else if (isCompletedModalOpen) {
            setIsCompletedModalOpen(false);
          }
          break;
        case 'KeyM':
          e.preventDefault();
          toggleSound();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleStartPause,
    handleReset,
    handleNextSegment,
    handlePrevSegment,
    toggleSound,
    canAdvance,
    isShortcutsOpen,
    isRulesOpen,
    isCompletedModalOpen,
  ]);

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Proposition & Opposition speakers for the team podiums
  const propSpeakers = speakingOrder
    .filter((s) => s.team === 'proposition')
    .sort((a, b) => a.number - b.number);
  const oppSpeakers = speakingOrder
    .filter((s) => s.team === 'opposition')
    .sort((a, b) => a.number - b.number);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* 1. Semifinals Mode View */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            screenMode === 'semifinals' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="h-screen max-h-screen w-full exact-clone-bg flex flex-col justify-between overflow-hidden selection:bg-[#c5a059]/30">
            {/* Header with Classical Branding, Discreet Controls & Mode Switcher */}
            <Header
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenRules={() => setIsRulesOpen(true)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              screenMode={screenMode}
              onSelectScreenMode={handleSelectScreenMode}
            />

            {/* Grand Heraldic Motion Banner — yields to the phase banner during
                cross-questioning and reply, so nothing is ever overlaid */}
            {isQuestionPhase ? (
              <CrossExamPanel
                activeSegment={activeSegment}
                activeSpeaker={activeSpeaker}
                nextSegmentLabel={nextSegmentLabel}
                onAdvance={handleNextSegment}
              />
            ) : (
              <MotionBanner
                motion={motion}
                onUpdateMotion={setMotion}
                onSelectMatchPreset={(preset) => {
                  setMotion(preset.motion);
                  setPropTeamName(preset.propTeam);
                  setOppTeamName(preset.oppTeam);
                }}
              />
            )}

            {/* Main Debate Stage: Massive Centered Timer with Symmetrical Podiums */}
            <main className="w-full flex-1 max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-0 flex flex-col justify-center items-center">
              <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 xl:gap-8">
                {/* Left Edge Podium: Proposition */}
                <div className="podium-responsive shrink-0 flex justify-center lg:justify-start order-2 lg:order-1">
                  <TeamPanel
                    teamType="proposition"
                    teamName={propTeamName}
                    teamSubtitle="PROPOSITION"
                    speakers={propSpeakers}
                    segments={segments}
                    activeSegment={activeSegment}
                    activeSpeakerId={activeSpeaker.id}
                    onSelectSpeaker={handleSelectSpeaker}
                    onSelectSegment={(segmentId) =>
                      handleSelectSegmentIndex(segments.findIndex((s) => s.id === segmentId))
                    }
                    onUpdateSpeakerName={updateSpeakerName}
                  />
                </div>

                {/* Center Stage: Debate Timer */}
                <div className="flex-1 w-full max-w-[960px] xl:max-w-[1080px] 2xl:max-w-[1160px] flex flex-col items-center justify-center order-1 lg:order-2">
                  <DebateTimer
                    activeSpeaker={activeSpeaker}
                    activeSegment={activeSegment}
                    roundStage={roundStage}
                    propTeamName={propTeamName}
                    oppTeamName={oppTeamName}
                    onSelectRound={handleSelectRound}
                    timerStatus={timerStatus}
                    timeRemaining={activeSegment.timeRemaining}
                    totalDuration={activeSegment.totalDuration || SPEECH_DURATION}
                    onStartPause={handleStartPause}
                    onReset={handleReset}
                    onNextSegment={handleNextSegment}
                    canAdvance={canAdvance}
                    nextSegmentLabel={nextSegmentLabel}
                    onUpdateTime={(newTime, newTotal) =>
                      updateSegmentTime(activeSegment.id, newTime, newTotal)
                    }
                  />

                  {/* Stepper directly below timer */}
                  <div className="w-full mt-0.5">
                    <ProgressIndicator
                      speakingOrder={speakingOrder}
                      segments={segments}
                      currentSegmentIndex={currentSegmentIndex}
                      onSelectIndex={handleSelectSegmentIndex}
                    />
                  </div>
                </div>

                {/* Right Edge Podium: Opposition */}
                <div className="podium-responsive shrink-0 flex justify-center lg:justify-end order-3">
                  <TeamPanel
                    teamType="opposition"
                    teamName={oppTeamName}
                    teamSubtitle="OPPOSITION"
                    speakers={oppSpeakers}
                    segments={segments}
                    activeSegment={activeSegment}
                    activeSpeakerId={activeSpeaker.id}
                    onSelectSpeaker={handleSelectSpeaker}
                    onSelectSegment={(segmentId) =>
                      handleSelectSegmentIndex(segments.findIndex((s) => s.id === segmentId))
                    }
                    onUpdateSpeakerName={updateSpeakerName}
                  />
                </div>
              </div>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>

        {/* 2. Grand Finale Mode View */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            screenMode === 'grand_final' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <GrandFinalScreen
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onSelectScreenMode={handleSelectScreenMode}
            motion={grandFinalMotion}
            onUpdateMotion={setGrandFinalMotion}
            propTeamName={gfPropTeamName}
            oppTeamName={gfOppTeamName}
            onUpdatePropTeamName={setGfPropTeamName}
            onUpdateOppTeamName={setGfOppTeamName}
            speakingOrder={speakingOrder}
            segments={segments}
            currentSegmentIndex={currentSegmentIndex}
            onSelectIndex={handleSelectSegmentIndex}
            onSelectSpeaker={handleSelectSpeaker}
            onUpdateSpeakerName={updateSpeakerName}
            onUpdateSegmentTime={updateSegmentTime}
            timerStatus={timerStatus}
            onStartPause={handleStartPause}
            onReset={handleReset}
            onNextSegment={handleNextSegment}
            canAdvance={canAdvance}
            nextSegmentLabel={nextSegmentLabel}
          />
        </div>
      </div>

      {/* Shared Modals */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <DebateCompletedModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        onRestartDebate={handleRestartDebate}
        speakers={speakingOrder}
        segments={segments}
      />
    </>
  );
}
