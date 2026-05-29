export type SessionPhase = 
  | 'CONFIGURE'
  | 'SWIPE_P1'
  | 'HANDOFF'
  | 'SWIPE_P2'
  | 'COMPUTE'
  | 'RESULT_SINGLE'
  | 'GAME'
  | 'GAME_PLAY'
  | 'GAME_RESULT'
  | 'FINAL'
  | 'DONE';

export type SessionState = {
  domain: 'eat' | 'watch';
  phase: SessionPhase;
  deck: string[];
  swipes: Record<string, Record<string, 'yes' | 'no'>>;
  matches: string[];
  winnerId?: string;
  finalPick?: string;
  eatMode?: 'cook' | 'out'; // If eat
  candidateSet?: string[]; // The items they are picking from after the game
  gamePlayed?: 'connect4' | 'wordle' | 'trivia';
  gameRound?: number;
};

export type SessionAction =
  | { type: 'START_SWIPE_P1'; deck: string[], eatMode?: 'cook' | 'out' }
  | { type: 'SWIPE'; playerId: string; optionId: string; vote: 'yes' | 'no' }
  | { type: 'NEXT_PHASE' }
  | { type: 'START_P2_SWIPING' }
  | { type: 'COMPUTE_MATCHES'; matches: string[] }
  | { type: 'START_GAME'; candidateSet: string[] } // Full deck or matches
  | { type: 'SELECT_GAME'; game: 'connect4' | 'wordle' | 'trivia' }
  | { type: 'GAME_OVER'; winnerId: string }
  | { type: 'GAME_DRAW' }
  | { type: 'UNDO_SWIPE'; playerId: string; optionId: string }
  | { type: 'SET_FINAL_PICK'; optionId: string }
  | { type: 'FINISH' };
