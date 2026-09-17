import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { MotionBanner } from './components/MotionBanner';
import { TeamPanel } from './components/TeamPanel';
import { DebateTimer } from './components/DebateTimer';
import { POIPanel } from './components/POIPanel';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Footer } from './components/Footer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DebateCompletedModal } from './components/DebateCompletedModal';
import { RulesModal } from './components/RulesModal';
import { GrandFinalScreen } from './components/GrandFinalScreen';
import type { Speaker, TimerStatus, POIState, RoundStage, TeamType } from './types/debate';
import { 
  playDebateBell, 
  playDoubleBell, 
  playTactileClick, 
  setSoundEnabled as setAudioEngineSound 
} from './utils/audio';

const SPEAKER_DURATION = 240; // 4 minutes
const POI_DURATION = 15; // 15 seconds

// Initial 6 speakers ordered in Asian Parliamentary Speaking Flow (per rules PDF)
const INITIAL_SPEAKERS: Speaker[] = [
  {
    id: 'prop-1',
    team: 'proposition',
    number: 1,
    orderIndex: 1,
    role: 'Prime Minister',
    roleAbbr: 'PM',
    name: 'Speaker 1',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
  {
    id: 'opp-1',
    team: 'opposition',
    number: 1,
    orderIndex: 2,
    role: 'Leader of Opposition',
    roleAbbr: 'LO',
    name: 'Speaker 1',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
  {
    id: 'prop-2',
    team: 'proposition',
    number: 2,
    orderIndex: 3,
    role: 'Deputy Prime Minister',
    roleAbbr: 'DPM',
    name: 'Speaker 2',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
  {
    id: 'opp-2',
    team: 'opposition',
    number: 2,
    orderIndex: 4,
    role: 'Deputy Leader of Opp',
    roleAbbr: 'DLO',
    name: 'Speaker 2',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
  {
    id: 'opp-3',
    team: 'opposition',
    number: 3,
    orderIndex: 5,
    role: 'Opposition Closing',
    roleAbbr: 'Opp Closing',
    name: 'Speaker 3',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
  {
    id: 'prop-3',
    team: 'proposition',
    number: 3,
    orderIndex: 6,
    role: 'Proposition Closing',
    roleAbbr: 'Prop Closing',
    name: 'Speaker 3',
    timeRemaining: SPEAKER_DURATION,
    totalDuration: SPEAKER_DURATION,
    hasSpoken: false,
    poisAccepted: 0,
  },
];

export default function App() {
  // Screen Mode: 'semifinals' | 'grand_final'
  const [screenMode, setScreenMode] = useState<'semifinals' | 'grand_final'>('semifinals');

  // Debate Round Stage & Editable Topic Motion (Defaults to Semifinals & Official Match 1)
  const [roundStage, setRoundStage] = useState<RoundStage>('Round 3: Semifinal');
  const [motion, setMotion] = useState<string>(
    'This house would let people legally erase specific traumatic memories if the technology existed.'
  );
  const [propTeamName, setPropTeamName] = useState<string>('Team Neutron');
  const [oppTeamName, setOppTeamName] = useState<string>('Team Futures');

  // Grand Final state (No preset questions, purely freeform custom entry for the finals)
  const [grandFinalMotion, setGrandFinalMotion] = useState<string>(
    'This House Believes That Scientific Truth Outweighs Societal Consensus'
  );
  const [gfPropTeamName, setGfPropTeamName] = useState<string>('Team 1');
  const [gfOppTeamName, setGfOppTeamName] = useState<string>('Team 2');

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

  // Speakers State in official flow
  const [speakingOrder, setSpeakingOrder] = useState<Speaker[]>(INITIAL_SPEAKERS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Timer State
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);

  // Active Speaker
  const activeSpeaker = speakingOrder[currentIndex];

  // POI State
  const [poiState, setPoiState] = useState<POIState>({
    status: 'idle',
    requestingTeam: activeSpeaker.team === 'proposition' ? 'opposition' : 'proposition',
    requestingSpeakerNumber: 1,
    timeRemaining: POI_DURATION,
  });

  // Ref tracking for precision timestamp calculation & 1-minute warning bell
  const lastTickRef = useRef<number | null>(null);
  const rungOneMinWarningRef = useRef<boolean>(false);

  // Sound toggle sync
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      setAudioEngineSound(next);
      return next;
    });
  }, []);

  // Update a speaker's remaining time & speech duration properly
  const updateSpeakerTime = useCallback((speakerId: string, time: number, newTotalDuration?: number) => {
    const clampedTime = Math.max(0, Math.round(time));
    setSpeakingOrder((prev) =>
      prev.map((s) => {
        if (s.id !== speakerId) return s;
        const updatedTotal = newTotalDuration !== undefined
          ? Math.max(clampedTime, Math.round(newTotalDuration))
          : Math.max(s.totalDuration || SPEAKER_DURATION, clampedTime);
        return {
          ...s,
          timeRemaining: clampedTime,
          totalDuration: updatedTotal,
          hasSpoken: clampedTime === 0,
        };
      })
    );
    // If setting positive time on completed, restore timer to paused/idle
    if (clampedTime > 0) {
      setTimerStatus((curr) => (curr === 'completed' ? 'paused' : curr));
    }
    // Reset warning bell flag if adjusted back above 60 seconds
    if (clampedTime > 60) {
      rungOneMinWarningRef.current = false;
    }
  }, []);

  // Update a speaker's name
  const updateSpeakerName = useCallback((speakerId: string, newName: string) => {
    setSpeakingOrder((prev) =>
      prev.map((s) => (s.id === speakerId ? { ...s, name: newName } : s))
    );
  }, []);

  // Reset 1-minute warning bell whenever speaker changes
  useEffect(() => {
    rungOneMinWarningRef.current = false;
  }, [currentIndex]);

  // 1. High-Precision Main Speaker Timer Loop
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

      setSpeakingOrder((prevSpeakers) => {
        const current = prevSpeakers[currentIndex];
        if (!current) return prevSpeakers;

        const prevTime = current.timeRemaining;
        const newTime = Math.max(0, prevTime - delta);

        // General 1-minute remaining warning bell (only if speech total is at least 2 minutes)
        if (prevTime > 60 && newTime <= 60 && (current.totalDuration || SPEAKER_DURATION) >= 120 && !rungOneMinWarningRef.current) {
          rungOneMinWarningRef.current = true;
          playDebateBell(880, 2.0);
        }

        // Double bell at 00:00 - time expired
        if (newTime === 0 && prevTime > 0) {
          setTimerStatus('completed');
          playDoubleBell();
        }

        return prevSpeakers.map((s, idx) =>
          idx === currentIndex
            ? { ...s, timeRemaining: newTime, hasSpoken: newTime === 0 ? true : s.hasSpoken }
            : s
        );
      });
    }, 200);

    return () => clearInterval(interval);
  }, [timerStatus, currentIndex]);

  // 2. High-Precision POI Timer Loop (Parallel, non-blocking)
  useEffect(() => {
    if (poiState.status !== 'active') return;

    let lastPoiTick = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastPoiTick) / 1000;
      lastPoiTick = now;

      setPoiState((prev) => {
        if (prev.status !== 'active') return prev;
        const newTime = Math.max(0, prev.timeRemaining - delta);

        if (newTime === 0 && prev.timeRemaining > 0) {
          // POI elapsed
          playDebateBell(660, 2.0);
          return {
            ...prev,
            status: 'idle',
            timeRemaining: POI_DURATION,
          };
        }

        return {
          ...prev,
          timeRemaining: newTime,
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [poiState.status]);

  // Moderator Controls: Start / Pause
  const handleStartPause = useCallback(() => {
    playTactileClick();
    if (timerStatus === 'running') {
      setTimerStatus('paused');
    } else {
      if (activeSpeaker.timeRemaining <= 0) {
        const targetDuration = activeSpeaker.totalDuration || SPEAKER_DURATION;
        updateSpeakerTime(activeSpeaker.id, targetDuration, targetDuration);
      }
      setTimerStatus('running');
    }
  }, [timerStatus, activeSpeaker, updateSpeakerTime]);

  // Moderator Controls: Reset
  const handleReset = useCallback(() => {
    playTactileClick();
    setTimerStatus('idle');
    const targetDuration = activeSpeaker.totalDuration || SPEAKER_DURATION;
    updateSpeakerTime(activeSpeaker.id, targetDuration, targetDuration);
    rungOneMinWarningRef.current = false;
  }, [activeSpeaker.id, activeSpeaker.totalDuration, updateSpeakerTime]);

  // Moderator Controls: Next Speaker (follows official Asian Parliamentary flow)
  const handleNextSpeaker = useCallback(() => {
    playTactileClick();
    // Mark current speaker as spoken
    setSpeakingOrder((prev) =>
      prev.map((s, idx) => (idx === currentIndex ? { ...s, hasSpoken: true } : s))
    );

    if (currentIndex < speakingOrder.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimerStatus('idle');
      if (speakingOrder[nextIndex].timeRemaining === 0) {
        const nextDuration = speakingOrder[nextIndex].totalDuration || SPEAKER_DURATION;
        updateSpeakerTime(speakingOrder[nextIndex].id, nextDuration, nextDuration);
      }
    } else {
      // Completed all 6 speeches!
      setTimerStatus('completed');
      setIsCompletedModalOpen(true);
    }
  }, [currentIndex, speakingOrder, updateSpeakerTime]);

  // Direct Speaker Selection by ID
  const handleSelectSpeaker = useCallback(
    (speakerId: string) => {
      const idx = speakingOrder.findIndex((s) => s.id === speakerId);
      if (idx !== -1 && idx !== currentIndex) {
        playTactileClick();
        setTimerStatus('idle');
        setCurrentIndex(idx);
      }
    },
    [speakingOrder, currentIndex]
  );

  // POI Controls - Can be called by either team!
  const handleTriggerPOIRequest = useCallback(
    (callingTeam: TeamType) => {
      playDebateBell(700, 1.2);
      setPoiState({
        status: 'requested',
        requestingTeam: callingTeam,
        requestingSpeakerNumber: 1,
        timeRemaining: POI_DURATION,
      });
    },
    []
  );

  // Direct quick-trigger POI
  const handleQuickPOI = useCallback(() => {
    const opposingTeam: TeamType = activeSpeaker.team === 'proposition' ? 'opposition' : 'proposition';
    handleTriggerPOIRequest(opposingTeam);
  }, [activeSpeaker.team, handleTriggerPOIRequest]);

  const handleAllowPOI = useCallback(() => {
    playDebateBell(880, 2.5); // Clear brass chime
    // Increment speaker's accepted POI counter to track compliance with rule
    setSpeakingOrder((prev) =>
      prev.map((s, idx) => (idx === currentIndex ? { ...s, poisAccepted: s.poisAccepted + 1 } : s))
    );
    setPoiState((prev) => ({
      ...prev,
      status: 'active',
      timeRemaining: POI_DURATION,
    }));
  }, [currentIndex]);

  const handleDeclinePOI = useCallback(() => {
    playTactileClick();
    setPoiState((prev) => ({
      ...prev,
      status: 'idle',
      timeRemaining: POI_DURATION,
    }));
  }, []);

  const handleEndPOI = useCallback(() => {
    playTactileClick();
    setPoiState((prev) => ({
      ...prev,
      status: 'idle',
      timeRemaining: POI_DURATION,
    }));
  }, []);

  // Restart Entire Debate
  const handleRestartDebate = useCallback(() => {
    playTactileClick();
    setSpeakingOrder(
      INITIAL_SPEAKERS.map((s) => ({
        ...s,
        timeRemaining: s.totalDuration || SPEAKER_DURATION,
        totalDuration: s.totalDuration || SPEAKER_DURATION,
        hasSpoken: false,
        poisAccepted: 0,
      }))
    );
    setCurrentIndex(0);
    setTimerStatus('idle');
    setPoiState({
      status: 'idle',
      requestingTeam: 'opposition',
      requestingSpeakerNumber: 1,
      timeRemaining: POI_DURATION,
    });
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
          if (currentIndex < speakingOrder.length - 1) {
            handleNextSpeaker();
          }
          break;
        case 'KeyP':
          e.preventDefault();
          if (poiState.status === 'idle') {
            handleQuickPOI();
          } else if (poiState.status === 'requested') {
            handleAllowPOI();
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (poiState.status !== 'idle') {
            handleEndPOI();
          } else if (isShortcutsOpen) {
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
    handleNextSpeaker,
    handleQuickPOI,
    handleAllowPOI,
    handleEndPOI,
    toggleSound,
    currentIndex,
    speakingOrder.length,
    poiState.status,
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

            {/* Grand Heraldic Motion Banner */}
            <MotionBanner
              motion={motion}
              onUpdateMotion={setMotion}
              onSelectMatchPreset={(preset) => {
                setMotion(preset.motion);
                setPropTeamName(preset.propTeam);
                setOppTeamName(preset.oppTeam);
              }}
            />

            {/* Prominent POI HUD Overlay */}
            <POIPanel
              poiState={poiState}
              activeSpeaker={activeSpeaker}
              roundStage={roundStage}
              onAllowPOI={handleAllowPOI}
              onDeclinePOI={handleDeclinePOI}
              onEndPOI={handleEndPOI}
            />

            {/* Main Debate Stage: Massive Centered Timer with Symmetrical Podiums */}
            <main className="w-full flex-1 max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-0.5 flex flex-col justify-center items-center">
              <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 xl:gap-8">
                {/* Left Edge Podium: Proposition */}
                <div className="podium-responsive shrink-0 flex justify-center lg:justify-start order-2 lg:order-1">
                  <TeamPanel
                    teamType="proposition"
                    teamName={propTeamName}
                    teamSubtitle="PROPOSITION"
                    speakers={propSpeakers}
                    activeSpeakerId={activeSpeaker.id}
                    isOpposingActiveSpeaker={activeSpeaker.team === 'opposition'}
                    activeSpeakerTimeRemaining={activeSpeaker.timeRemaining}
                    onCallPOI={() => handleTriggerPOIRequest('proposition')}
                    onSelectSpeaker={handleSelectSpeaker}
                    onUpdateSpeakerName={updateSpeakerName}
                  />
                </div>

                {/* Center Stage: Debate Timer */}
                <div className="flex-1 w-full max-w-[960px] xl:max-w-[1080px] 2xl:max-w-[1160px] flex flex-col items-center justify-center order-1 lg:order-2">
                  <DebateTimer
                    activeSpeaker={activeSpeaker}
                    roundStage={roundStage}
                    propTeamName={propTeamName}
                    oppTeamName={oppTeamName}
                    onSelectRound={handleSelectRound}
                    timerStatus={timerStatus}
                    timeRemaining={activeSpeaker.timeRemaining}
                    totalDuration={activeSpeaker.totalDuration || SPEAKER_DURATION}
                    poiState={poiState}
                    onStartPause={handleStartPause}
                    onReset={handleReset}
                    onNextSpeaker={handleNextSpeaker}
                    hasNextSpeaker={currentIndex < speakingOrder.length - 1}
                    onUpdateTime={(newTime, newTotal) => updateSpeakerTime(activeSpeaker.id, newTime, newTotal)}
                  />

                  {/* Stepper directly below timer */}
                  <div className="w-full mt-1.5 sm:mt-2">
                    <ProgressIndicator
                      speakingOrder={speakingOrder}
                      currentIndex={currentIndex}
                      onSelectIndex={(idx) => {
                        playTactileClick();
                        setTimerStatus('idle');
                        setCurrentIndex(idx);
                      }}
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
                    activeSpeakerId={activeSpeaker.id}
                    isOpposingActiveSpeaker={activeSpeaker.team === 'proposition'}
                    activeSpeakerTimeRemaining={activeSpeaker.timeRemaining}
                    onCallPOI={() => handleTriggerPOIRequest('opposition')}
                    onSelectSpeaker={handleSelectSpeaker}
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
            currentIndex={currentIndex}
            onSelectIndex={(idx) => {
              playTactileClick();
              setTimerStatus('idle');
              setCurrentIndex(idx);
            }}
            onUpdateSpeakerName={updateSpeakerName}
            onUpdateSpeakerTime={updateSpeakerTime}
            timerStatus={timerStatus}
            onStartPause={handleStartPause}
            onReset={handleReset}
            onNextSpeaker={handleNextSpeaker}
            hasNextSpeaker={currentIndex < speakingOrder.length - 1}
            poiState={poiState}
            onTriggerPOIRequest={handleTriggerPOIRequest}
            onAllowPOI={handleAllowPOI}
            onDeclinePOI={handleDeclinePOI}
            onEndPOI={handleEndPOI}
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
      />
    </>
  );
}
