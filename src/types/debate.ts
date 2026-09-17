export type TeamType = 'proposition' | 'opposition';

export type RoleAbbr = 'PM' | 'LO' | 'DPM' | 'DLO' | 'Opp Closing' | 'Prop Closing';

export interface Speaker {
  id: string;
  team: TeamType;
  number: number; // 1, 2, or 3 within team
  orderIndex: number; // 1 to 6 in speaking order
  role: string; // e.g. "Prime Minister"
  roleAbbr: RoleAbbr;
  name: string;
  timeRemaining: number; // in seconds (240 = 4 mins)
  totalDuration: number; // total duration of speech in seconds (defaults to 240)
  hasSpoken: boolean;
  poisAccepted: number; // Rule: Must accept at least one POI per speech in PM, LO, DPM, DLO
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type POIStatus = 'idle' | 'requested' | 'active';

export interface POIState {
  status: POIStatus;
  requestingTeam: TeamType;
  requestingSpeakerNumber: number;
  timeRemaining: number; // in seconds (15 = 15s)
}

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
