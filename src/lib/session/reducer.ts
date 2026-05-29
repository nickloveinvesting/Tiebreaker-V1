import { SessionState, SessionAction } from './types';

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_SWIPE_P1':
      return { 
        ...state, 
        phase: 'SWIPE_P1', 
        deck: action.deck,
        eatMode: action.eatMode,
        swipes: {},
      };
    case 'SWIPE':
      return {
        ...state,
        swipes: {
          ...state.swipes,
          [action.playerId]: {
            ...state.swipes[action.playerId],
            [action.optionId]: action.vote
          }
        }
      };
    case 'UNDO_SWIPE':
      const playerSwipes = { ...(state.swipes[action.playerId] || {}) };
      delete playerSwipes[action.optionId];
      return {
        ...state,
        swipes: {
          ...state.swipes,
          [action.playerId]: playerSwipes
        }
      };
    case 'NEXT_PHASE':
      if (state.phase === 'SWIPE_P1') return { ...state, phase: 'HANDOFF' };
      if (state.phase === 'HANDOFF') return { ...state, phase: 'SWIPE_P2' };
      if (state.phase === 'SWIPE_P2') return { ...state, phase: 'COMPUTE' };
      if (state.phase === 'COMPUTE') {
        if (state.matches.length === 1) return { ...state, phase: 'RESULT_SINGLE', finalPick: state.matches[0] };
        // We shouldn't automatically transition to GAME for length != 1 anymore without SELECT_GAME
        // But for fallback:
        return { ...state, phase: 'GAME' };
      }
      if (state.phase === 'RESULT_SINGLE') return { ...state, phase: 'FINAL' };
      if (state.phase === 'GAME') return { ...state, phase: 'GAME_PLAY' };
      if (state.phase === 'GAME_PLAY') return { ...state, phase: 'GAME_RESULT' }; // Not directly used usually
      if (state.phase === 'GAME_RESULT') return { ...state, phase: 'FINAL' };
      if (state.phase === 'FINAL') return { ...state, phase: 'DONE' };
      return state;
    case 'START_P2_SWIPING':
      return { ...state, phase: 'SWIPE_P2' };
    case 'COMPUTE_MATCHES':
      return { ...state, matches: action.matches, phase: 'COMPUTE' };
    case 'START_GAME':
      return { ...state, candidateSet: action.candidateSet, phase: 'GAME' };
    case 'SELECT_GAME':
      return { ...state, gamePlayed: action.game, candidateSet: state.matches.length > 1 ? state.matches : state.deck, phase: 'GAME', gameRound: 1 };
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
