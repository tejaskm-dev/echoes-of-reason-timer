export type TeamType = 'proposition' | 'opposition';

export type RoleAbbr = 'PM' | 'LO' | 'DPM' | 'DLO' | 'Opp Closing' | 'Prop Closing';

/**
 * A speech is split into up to three consecutively timed phases.
 *  - speech : the speaker's own 3:00 address
 *  - cross  : 1:00 in which the opposing bench cross-questions the speaker
 *  - reply  : 1:00 in which the speaker answers, uninterrupted
 *
 * Closing speeches (Opp Closing, Prop Closing) run straight through and
 * therefore only ever own a `speech` segment.
 */
export type SegmentKind = 'speech' | 'cross' | 'reply';

export interface Speaker {
  id: string;
  team: TeamType;
  number: number; // 1, 2, or 3 within team
  orderIndex: number; // 1 to 6 in speaking order
  role: string; // e.g. "Prime Minister"
  roleAbbr: RoleAbbr;
  name: string;
  /** Closings take no questions, so only the four main speeches carry cross-questioning. */
  hasCrossExam: boolean;
}

/** One independently timed block of the debate. Segments own all timing state. */
export interface DebateSegment {
  id: string; // `${speakerId}:${kind}`
  speakerId: string;
  kind: SegmentKind;
  orderIndex: number; // 1 to 14 across the whole debate
  timeRemaining: number; // seconds
  totalDuration: number; // configured length of this segment in seconds
  hasRun: boolean;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type RoundStage =
  | 'Round 1: Qualifier'
  | 'Round 2: Qualifier'
  | 'Round 3: Semifinal'
  | 'Round 4: Grand Final';

export interface MatchInfo {
  round: RoundStage;
  match: string;
  motion?: string;
}
