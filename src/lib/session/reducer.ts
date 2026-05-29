import { SessionState, SessionAction } from './types';

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_MACRO_P1':
      return { 
        ...state, 
        phase: 'SWIPE_MACRO_P1', 
        macroDeck: action.deck,
        eatMode: action.eatMode !== undefined ? action.eatMode : state.eatMode,
        macroSwipes: {},
      };
    case 'SWIPE_MACRO':
      return {
        ...state,
        macroSwipes: {
          ...state.macroSwipes,
          [action.playerId]: {
            ...(state.macroSwipes?.[action.playerId] || {}),
            [action.optionId]: action.vote
          }
        }
      };
    case 'UNDO_MACRO': {
      const playerSwipes = { ...(state.macroSwipes?.[action.playerId] || {}) };
      delete playerSwipes[action.optionId];
      return {
        ...state,
        macroSwipes: {
          ...state.macroSwipes,
          [action.playerId]: playerSwipes
        }
      };
    }
    case 'COMPUTE_MACRO_MATCHES':
      return { ...state, macroMatches: action.matches, phase: 'COMPUTE_MACRO' };

    case 'START_MICRO_P1':
    case 'START_NEXT_MICRO':
      return {
        ...state,
        phase: 'SWIPE_MICRO_P1',
        microDeck: action.deck,
        remainingMicroPool: action.remainingPool,
        microSwipes: {},
      };
      
    case 'SWIPE_MICRO':
      return {
        ...state,
        microSwipes: {
          ...state.microSwipes,
          [action.playerId]: {
            ...(state.microSwipes?.[action.playerId] || {}),
            [action.optionId]: action.vote
          }
        }
      };
      
    case 'UNDO_MICRO': {
      const playerSwipes = { ...(state.microSwipes?.[action.playerId] || {}) };
      delete playerSwipes[action.optionId];
      return {
        ...state,
        microSwipes: {
          ...state.microSwipes,
          [action.playerId]: playerSwipes
        }
      };
    }
      
    case 'COMPUTE_MICRO_MATCHES':
      return { ...state, microMatches: action.matches, phase: 'COMPUTE_MICRO' };

    case 'RESTART':
      return {
        ...state,
        phase: 'CONFIGURE',
        macroSwipes: {},
        microSwipes: {},
        macroDeck: [],
        microDeck: [],
        remainingMicroPool: [],
        matches: [],
        macroMatches: [],
        microMatches: [],
        winnerId: undefined,
        finalPick: undefined,
        candidateSet: []
      };

    case 'NEXT_PHASE':
      if (state.phase === 'SWIPE_MACRO_P1') return { ...state, phase: 'HANDOFF_MACRO' };
      if (state.phase === 'HANDOFF_MACRO') return { ...state, phase: 'SWIPE_MACRO_P2' };
      if (state.phase === 'SWIPE_MICRO_P1') return { ...state, phase: 'HANDOFF_MICRO' };
      if (state.phase === 'HANDOFF_MICRO') return { ...state, phase: 'SWIPE_MICRO_P2' };
      
      if (state.phase === 'COMPUTE_MACRO') {
        // Assume external logic triggers start micro or restart
        return state;
      }
      
      if (state.phase === 'COMPUTE_MICRO') {
        if (state.microMatches && state.microMatches.length === 1) {
          return { ...state, phase: 'RESULT_SINGLE', finalPick: state.microMatches[0] };
        }
        if (state.microMatches && state.microMatches.length === 0) {
          return { ...state, phase: 'RESULT_NO_MATCH' };
        }
        return { ...state, phase: 'GAME' };
      }
      
      if (state.phase === 'RESULT_SINGLE') return { ...state, phase: 'FINAL' };
      if (state.phase === 'GAME') return { ...state, phase: 'GAME_PLAY' };
      if (state.phase === 'GAME_PLAY') return { ...state, phase: 'GAME_RESULT' }; 
      if (state.phase === 'GAME_RESULT') return { ...state, phase: 'FINAL' };
      if (state.phase === 'FINAL') return { ...state, phase: 'DONE' };
      return state;

    case 'START_P2_MICRO_SWIPING':
      return { ...state, phase: 'SWIPE_MICRO_P2' };

    case 'SELECT_GAME':
      return { ...state, gamePlayed: action.game, candidateSet: action.candidateSet, phase: 'GAME', gameRound: 1 };
    case 'GAME_OVER':
      return { ...state, winnerId: action.winnerId, phase: 'GAME_RESULT' };
    case 'GAME_DRAW':
      return { ...state, phase: 'GAME', gameRound: (state.gameRound || 1) + 1 };
    case 'SET_FINAL_PICK':
      return { ...state, finalPick: action.optionId, phase: 'FINAL' };
    case 'FINISH':
      return { ...state, phase: 'DONE' };
    default:
      return state;
  }
}

export function computeMatches(swipes: Record<string, Record<string, 'yes' | 'no'>>, deck: string[]): string[] {
  const p1 = Object.keys(swipes)[0];
  const p2 = Object.keys(swipes)[1];
  if (!p1 || !p2) return [];

  const p1Swipes = swipes[p1];
  const p2Swipes = swipes[p2];

  return deck.filter(id => p1Swipes[id] === 'yes' && p2Swipes[id] === 'yes');
}
