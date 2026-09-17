// Web Audio API debate bell synthesizer

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const getSoundEnabled = () => soundEnabled;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Produces a rich, resonant acoustic debate bell chime
 */
export const playDebateBell = (frequency = 880, duration = 2.5) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic overtones for a brass bell sound
    const harmonics = [
      { freqMultiplier: 1.0, gain: 0.5, decay: duration },
      { freqMultiplier: 2.76, gain: 0.25, decay: duration * 0.7 },
      { freqMultiplier: 5.4, gain: 0.12, decay: duration * 0.4 },
      { freqMultiplier: 8.93, gain: 0.05, decay: duration * 0.2 },
    ];

    harmonics.forEach(({ freqMultiplier, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * freqMultiplier, now);

      gainNode.gain.setValueAtTime(0, now);
      // Fast attack strike
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.005);
      // Exponential natural bell decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch {
    // Audio context might be restricted before user interaction
  }
};

/**
 * Double bell ring for time expiration (00:00)
 */
export const playDoubleBell = () => {
  if (!soundEnabled) return;
  playDebateBell(880, 2.0);
  setTimeout(() => {
    playDebateBell(880, 3.0);
  }, 400);
};

/**
 * Subtle tactile click for moderator buttons
 */
export const playTactileClick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Silently continue
  }
};
