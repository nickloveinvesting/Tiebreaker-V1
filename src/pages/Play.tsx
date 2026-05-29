import { useReducer, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../lib/store';
import { Player, FoodOption, WatchItem, Decision } from '../lib/types';
import { sessionReducer, computeMatches } from '../lib/session/reducer';
import { SessionState, SessionAction } from '../lib/session/types';
import { buildFoodDeck, buildWatchDeck } from '../lib/session/deckBuilder';
import { v4 as uuidv4 } from 'uuid';
import AppHeader from '../components/layout/AppHeader';

import ConfigurePhase from '../components/flow/ConfigurePhase';
import SwipingPhase from '../components/flow/SwipingPhase';
import HandoffPhase from '../components/flow/HandoffPhase';
import ComputePhase from '../components/flow/ComputePhase';
import GamePhase from '../components/flow/GamePhase';
import FinalPhase from '../components/flow/FinalPhase';

export default function Play() {
  const { domain } = useParams<{ domain: 'eat' | 'watch' }>();
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [options, setOptions] = useState<FoodOption[] | WatchItem[]>([]);
  const [pastDecisions, setPastDecisions] = useState<Decision[]>([]);
  
  const [state, dispatch] = useReducer(sessionReducer, {
    domain: domain as 'eat' | 'watch',
    phase: 'CONFIGURE',
    deck: [],
    swipes: {},
    matches: [],
  });

  useEffect(() => {
    async function loadData() {
      setPlayers(await store.getPlayers());
      setPastDecisions(await store.getDecisions());
      if (domain === 'eat') {
        setOptions(await store.getFoodOptions());
      } else {
        setOptions(await store.getWatchItems());
      }
    }
    loadData();
  }, [domain]);

  useEffect(() => {
    if (domain === 'watch' && options.length > 0 && state.phase === 'CONFIGURE') {
      // Auto-start watch since there's no mode configuration
      const deck = buildWatchDeck(options as WatchItem[], pastDecisions);
      dispatch({ type: 'START_SWIPE_P1', deck });
    }
  }, [domain, options, state.phase]);

  const handleConfigureEat = (mode: 'cook' | 'out') => {
    const deck = buildFoodDeck(options as FoodOption[], mode, pastDecisions);
    dispatch({ type: 'START_SWIPE_P1', deck, eatMode: mode });
  };

  const handleFinish = async () => {
    // Save decision
    if (state.finalPick && players.length >= 2) {
      const decision: Decision = {
        id: uuidv4(),
        date: new Date().toISOString(),
        domain: state.domain,
        mode: state.eatMode,
        deck: state.deck,
        swipes: state.swipes,
        matches: state.matches,
        resolution: state.matches.length === 1 ? 'single_match' : (state.matches.length === 0 ? 'no_match_game' : 'tiebreak_game'),
        gamePlayed: state.matches.length !== 1 ? state.gamePlayed : undefined,
        winnerId: state.winnerId,
        finalPick: state.finalPick,
      };
      await store.addDecision(decision);
    }
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-cream z-50">
      <AppHeader title={'Decide: ' + domain} backTo="/" />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {state.phase === 'CONFIGURE' && domain === 'eat' && (
          <ConfigurePhase onSelect={handleConfigureEat} />
        )}
        
        {state.phase === 'SWIPE_P1' && (
          <SwipingPhase 
            playerId={players[0]?.id}
            playerName={players[0]?.name}
            playerColor={players[0]?.color}
            deck={state.deck}
            options={options}
            onComplete={() => dispatch({ type: 'NEXT_PHASE' })}
            onSwipe={(id, vote) => dispatch({ type: 'SWIPE', playerId: players[0]?.id, optionId: id, vote })}
          />
        )}

        {state.phase === 'HANDOFF' && (
          <HandoffPhase 
            nextPlayerName={players[1]?.name} 
            nextPlayerColor={players[1]?.color}
            onReady={() => dispatch({ type: 'NEXT_PHASE' })} 
          />
        )}

        {state.phase === 'SWIPE_P2' && (
          <SwipingPhase 
            playerId={players[1]?.id}
            playerName={players[1]?.name}
            playerColor={players[1]?.color}
            deck={state.deck}
            options={options}
            onComplete={() => {
              // Calculate matches before next phase
              const p1 = players[0]?.id;
              const p2 = players[1]?.id;
              const matches = state.deck.filter(id => state.swipes[p1][id] === 'yes' && state.swipes[p2][id] === 'yes');
              dispatch({ type: 'COMPUTE_MATCHES', matches });
            }}
            onSwipe={(id, vote) => dispatch({ type: 'SWIPE', playerId: players[1]?.id, optionId: id, vote })}
          />
        )}

        {state.phase === 'COMPUTE' && (
           <ComputePhase 
             matches={state.matches} 
             options={options}
             onNext={(gamePicked) => {
               if (gamePicked) {
                 dispatch({ type: 'SELECT_GAME', game: gamePicked });
               } else {
                 dispatch({ type: 'NEXT_PHASE' });
               }
             }} 
           />
        )}

        {state.phase === 'RESULT_SINGLE' && (
           <FinalPhase 
             optionId={state.finalPick!} 
             options={options}
             winnerId={null}
             players={players}
             onDone={handleFinish}
           />
        )}

        {state.phase === 'GAME' && (
           <GamePhase 
             gamePlayed={state.gamePlayed}
             players={players}
             onGameOver={(winnerId) => dispatch({ type: 'GAME_OVER', winnerId })}
             onDraw={() => dispatch({ type: 'GAME_DRAW' })}
           />
        )}

        {state.phase === 'GAME_RESULT' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-8">
             <h2 className="text-5xl font-display font-black tracking-tighter">
               {players.find(p => p.id === state.winnerId)?.name} Wins!
             </h2>
             <p className="text-xl font-medium">Time to make the final call.</p>
             <button 
               onClick={() => dispatch({ type: 'NEXT_PHASE' })}
               className="w-full py-6 border-[4px] border-ink bg-white font-black text-xl uppercase tracking-wider rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
             >
               Choose Now
             </button>
           </div>
        )}

        {state.phase === 'FINAL' && state.matches.length !== 1 && (
           <FinalPhase 
             winnerId={state.winnerId!}
             players={players}
             options={options}
             candidateSet={state.matches.length > 1 ? state.matches : state.deck}
             onPick={(id) => dispatch({ type: 'SET_FINAL_PICK', optionId: id })}
             onDone={handleFinish}
           />
        )}

      </div>
    </div>
  );
}
