import type { DebateSegment, SegmentKind, Speaker } from '../types/debate';

/** Official durations from the Echoes of Reason rules (Modified Asian Parliamentary). */
export const SPEECH_DURATION = 180; // 3 minutes
export const CROSS_DURATION = 60; // 1 minute of cross-questioning
export const REPLY_DURATION = 60; // 1 minute of uninterrupted reply

export const SEGMENT_DURATIONS: Record<SegmentKind, number> = {
  speech: SPEECH_DURATION,
  cross: CROSS_DURATION,
  reply: REPLY_DURATION,
};

/** Order the phases always run in within a single speech. */
export const SEGMENT_SEQUENCE: SegmentKind[] = ['speech', 'cross', 'reply'];

export const SEGMENT_LABELS: Record<SegmentKind, string> = {
  speech: 'Speech',
  cross: 'Cross-Questioning',
  reply: 'Reply',
};

export const SEGMENT_SHORT_LABELS: Record<SegmentKind, string> = {
  speech: 'Speech',
  cross: 'Q&A',
  reply: 'Reply',
};

/** Single-glyph marks for the compact steppers and podium pips. */
export const SEGMENT_GLYPHS: Record<SegmentKind, string> = {
  speech: 'S',
  cross: 'Q',
  reply: 'R',
};

export const makeSegment = (
  speaker: Speaker,
  kind: SegmentKind,
  orderIndex: number
): DebateSegment => ({
  id: `${speaker.id}:${kind}`,
  speakerId: speaker.id,
  kind,
  orderIndex,
  timeRemaining: SEGMENT_DURATIONS[kind],
  totalDuration: SEGMENT_DURATIONS[kind],
  hasRun: false,
});

/**
 * Expands the six-speaker roster into the full running order of the debate:
 * 4 main speeches x (speech + cross + reply) + 2 closings = 14 segments, 26 minutes.
 */
export const buildSegments = (speakers: Speaker[]): DebateSegment[] => {
  const segments: DebateSegment[] = [];
  speakers.forEach((speaker) => {
    const kinds: SegmentKind[] = speaker.hasCrossExam ? SEGMENT_SEQUENCE : ['speech'];
    kinds.forEach((kind) => {
      segments.push(makeSegment(speaker, kind, segments.length + 1));
    });
  });
  return segments;
};

export const segmentsForSpeaker = (segments: DebateSegment[], speakerId: string): DebateSegment[] =>
  segments.filter((seg) => seg.speakerId === speakerId);

/**
 * The segment a speaker's podium row should display: the one currently on the
 * clock if this speaker holds the floor, otherwise their first unfinished
 * segment, falling back to their last so a finished speaker shows 0:00.
 */
export const speakerDisplaySegment = (
  segments: DebateSegment[],
  speakerId: string,
  activeSegmentId?: string
): DebateSegment | undefined => {
  const own = segmentsForSpeaker(segments, speakerId);
  if (own.length === 0) return undefined;
  const active = own.find((seg) => seg.id === activeSegmentId);
  if (active) return active;
  return own.find((seg) => !seg.hasRun) ?? own[own.length - 1];
};

/** A speaker is done once every segment they own has been run. */
export const isSpeakerComplete = (segments: DebateSegment[], speakerId: string): boolean => {
  const own = segmentsForSpeaker(segments, speakerId);
  return own.length > 0 && own.every((seg) => seg.hasRun);
};

export const totalScheduledSeconds = (segments: DebateSegment[]): number =>
  segments.reduce((sum, seg) => sum + seg.totalDuration, 0);

export const totalElapsedSeconds = (segments: DebateSegment[]): number =>
  segments.reduce((sum, seg) => sum + (seg.totalDuration - seg.timeRemaining), 0);

/**
 * Who is actually holding the floor. During cross-questioning the opposing
 * bench asks the questions; during the speech and the reply it is the speaker.
 */
export const floorHolderTeam = (speaker: Speaker, kind: SegmentKind) =>
  kind === 'cross'
    ? speaker.team === 'proposition'
      ? 'opposition'
      : 'proposition'
    : speaker.team;

/** Formats a whole-debate duration as e.g. "26 minutes" / "4:30". */
export const formatMinutes = (seconds: number): string => {
  const mins = Math.round(seconds / 60);
  return `${mins} minute${mins === 1 ? '' : 's'}`;
};
