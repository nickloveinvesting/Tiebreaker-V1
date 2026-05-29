export type SessionPhase = 
  | 'CONFIGURE'
  | 'SWIPE_MACRO_P1'
  | 'HANDOFF_MACRO'
  | 'SWIPE_MACRO_P2'
  | 'COMPUTE_MACRO'
  | 'SWIPE_MICRO_P1'
  | 'HANDOFF_MICRO'
  | 'SWIPE_MICRO_P2'
  | 'COMPUTE_MICRO'
  | 'RESULT_SINGLE'
  | 'RESULT_NO_MATCH'
  | 'GAME'
  | 'GAME_PLAY'
  | 'GAME_RESULT'
  | 'FINAL'
  | 'DONE';

export type SessionState = {
  domain: 'eat' | 'watch';
  phase: SessionPhase;
  
  // Backwards compatibility or specific
  deck: string[]; 
  swipes: Record<string, Record<string, 'yes' | 'no'>>;
  matches: string[];

  // Macro
  macroDeck?: string[];
  macroSwipes?: Record<string, Record<string, 'yes' | 'no'>>;
  macroMatches?: string[];
  
  // Micro
  microDeck?: string[];
  remainingMicroPool?: string[];
  microSwipes?: Record<string, Record<string, 'yes' | 'no'>>;
  microMatches?: string[];
  
  winnerId?: string;
  finalPick?: string;
  eatMode?: 'cook' | 'out'; // If eat
  candidateSet?: string[]; // The items they are picking from after the game
  gamePlayed?: 'connect4' | 'wordle' | 'trivia';
  gameRound?: number;
};

export type SessionAction =
  | { type: 'START_MACRO_P1'; deck: string[], eatMode?: 'cook' | 'out' }
  | { type: 'SWIPE_MACRO'; playerId: string; optionId: string; vote: 'yes' | 'no' }
  | { type: 'UNDO_MACRO'; playerId: string; optionId: string }
  | { type: 'COMPUTE_MACRO_MATCHES'; matches: string[] }
  | { type: 'START_MICRO_P1'; deck: string[], remainingPool: string[] }
  | { type: 'START_P2_MICRO_SWIPING' }
  | { type: 'SWIPE_MICRO'; playerId: string; optionId: string; vote: 'yes' | 'no' }
  | { type: 'UNDO_MICRO'; playerId: string; optionId: string }
  | { type: 'COMPUTE_MICRO_MATCHES'; matches: string[] }
  | { type: 'START_NEXT_MICRO'; deck: string[], remainingPool: string[] }
  | { type: 'RESTART' }
  | { type: 'NEXT_PHASE' }
  | { type: 'SELECT_GAME'; game: 'connect4' | 'wordle' | 'trivia'; candidateSet: string[] }
  | { type: 'GAME_OVER'; winnerId: string }
  | { type: 'GAME_DRAW' }
  | { type: 'SET_FINAL_PICK'; optionId: string }
  | { type: 'FINISH' };
