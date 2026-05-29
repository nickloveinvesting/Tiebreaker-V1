import { useReducer, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../lib/store';
import { Player, FoodOption, WatchItem, Decision } from '../lib/types';
import { sessionReducer, computeMatches } from '../lib/session/reducer';
import { SessionState, SessionAction } from '../lib/session/types';
import { buildFoodDeck, buildWatchDeck } from '../lib/session/deckBuilder';
import { v4 as uuidv4 } from 'uuid';
import AppHeader from '../components/layout/AppHeader';
import confetti from 'canvas-confetti';

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
      const genres = Array.from(new Set((options as WatchItem[]).filter(o => o.active).map(o => o.genre)));
      const deck = genres.map(g => `__cat__${g}`).sort(() => Math.random() - 0.5);
      dispatch({ type: 'START_MACRO_P1', deck });
    }
  }, [domain, options, state.phase]);

  useEffect(() => {
    if (state.phase === 'GAME_RESULT') {
       const wColor = players.find(p => p.id === state.winnerId)?.color || '#1A1A1A';
       confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [wColor, '#ffffff', '#1A1A1A'],
          disableForReducedMotion: true
       });
    }
  }, [state.phase, state.winnerId, players]);

  const handleConfigureEat = (mode: 'cook' | 'out') => {
    const relevant = (options as FoodOption[]).filter(o => o.active && (o.mode === mode || o.mode === 'both'));
    const cuisines = Array.from(new Set(relevant.map(o => o.cuisine)));
    const deck = cuisines.map(c => `__cat__${c}`).sort(() => Math.random() - 0.5);
    dispatch({ type: 'START_MACRO_P1', deck, eatMode: mode });
  };

  const handleFinish = async () => {
    // Save decision
    if (state.finalPick && players.length >= 2) {
      const decision: Decision = {
        id: uuidv4(),
        date: new Date().toISOString(),
        domain: state.domain,
        mode: state.eatMode,
        deck: state.deck || [],
        swipes: state.microSwipes || {},
        matches: state.microMatches || [],
        resolution: (state.microMatches && state.microMatches.length === 1) ? 'single_match' : ((state.microMatches && state.microMatches.length === 0) ? 'no_match_game' : 'tiebreak_game'),
        gamePlayed: (state.microMatches && state.microMatches.length !== 1) ? state.gamePlayed : undefined,
        winnerId: state.winnerId,
        finalPick: state.finalPick,
      };
      await store.addDecision(decision);
    }
    navigate('/');
  };

  const macroOptions = useMemo<(FoodOption | WatchItem)[]>(() => {
    if (domain === 'eat') {
      const eatOptions = options as FoodOption[];
      const relevant = eatOptions.filter(o => o.active && (state.eatMode ? (o.mode === state.eatMode || o.mode === 'both') : true));
      const cuisines = Array.from(new Set(relevant.map(o => o.cuisine)));
      return cuisines.map(c => ({
        id: `__cat__${c}`,
        name: c,
        cuisine: c,
        mode: state.eatMode || 'both',
        emoji: '🍽️',
        active: true
      }) as FoodOption);
    } else {
      const watchOptions = options as WatchItem[];
      const relevant = watchOptions.filter(o => o.active);
      const genres = Array.from(new Set(relevant.map(o => o.genre)));
      return genres.map(g => ({
        id: `__cat__${g}`,
        title: g,
        type: 'movie / show',
        genre: g,
        posterUrl: '🍿',
        active: true
      }) as WatchItem);
    }
  }, [options, domain, state.eatMode]);

  const allAvailableMicroOptions = useMemo(() => {
    // Determine which categories matched
    const matchedCategories = (state.macroMatches || []).map(id => id.replace('__cat__', ''));
    
    if (domain === 'eat') {
      const eatOptions = options as FoodOption[];
      let valid = eatOptions.filter(o => o.active && (state.eatMode ? (o.mode === state.eatMode || o.mode === 'both') : true));
      // filter by matched categories
      if (matchedCategories.length > 0) {
        valid = valid.filter(o => matchedCategories.includes(o.cuisine));
      }
      return valid;
    } else {
      const watchOptions = options as WatchItem[];
      let valid = watchOptions.filter(o => o.active);
      if (matchedCategories.length > 0) {
        valid = valid.filter(o => matchedCategories.includes(o.genre));
      }
      return valid;
    }
  }, [options, domain, state.eatMode, state.macroMatches]);

  return (
    <div className="flex-1 flex flex-col h-full bg-cream z-50">
      <AppHeader title={'Decide: ' + domain} backTo="/" />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {state.phase === 'CONFIGURE' && domain === 'eat' && (
          <ConfigurePhase onSelect={handleConfigureEat} />
        )}
        
        {state.phase === 'SWIPE_MACRO_P1' && (
          <SwipingPhase 
            playerId={players[0]?.id}
            playerName={players[0]?.name}
            playerColor={players[0]?.color}
            deck={state.macroDeck!}
            options={macroOptions}
            onComplete={() => dispatch({ type: 'NEXT_PHASE' })}
            onSwipe={(id, vote) => dispatch({ type: 'SWIPE_MACRO', playerId: players[0]?.id, optionId: id, vote })}
            onUndo={(id) => dispatch({ type: 'UNDO_MACRO', playerId: players[0]?.id, optionId: id })}
          />
        )}

        {state.phase === 'HANDOFF_MACRO' && (
          <HandoffPhase 
            nextPlayerName={players[1]?.name} 
            nextPlayerColor={players[1]?.color}
            onReady={() => dispatch({ type: 'NEXT_PHASE' })} 
          />
        )}

        {state.phase === 'SWIPE_MACRO_P2' && (
          <SwipingPhase 
            playerId={players[1]?.id}
            playerName={players[1]?.name}
            playerColor={players[1]?.color}
            deck={state.macroDeck!}
            options={macroOptions}
            onComplete={() => {
              const p1 = players[0]?.id;
              const p2 = players[1]?.id;
              const matches = state.macroDeck!.filter(id => state.macroSwipes![p1]?.[id] === 'yes' && state.macroSwipes![p2]?.[id] === 'yes');
              dispatch({ type: 'COMPUTE_MACRO_MATCHES', matches });
            }}
            onSwipe={(id, vote) => dispatch({ type: 'SWIPE_MACRO', playerId: players[1]?.id, optionId: id, vote })}
            onUndo={(id) => dispatch({ type: 'UNDO_MACRO', playerId: players[1]?.id, optionId: id })}
          />
        )}

        {state.phase === 'COMPUTE_MACRO' && (
           <ComputePhase 
             isMacro={true}
             matches={state.macroMatches || []} 
             options={macroOptions}
             onNext={() => {
                if (state.macroMatches && state.macroMatches.length > 0) {
                  // Build micro deck and slice 10 
                  const shuffled = [...allAvailableMicroOptions].sort(() => Math.random() - 0.5);
                  const first10 = shuffled.slice(0, 10).map(o => o.id);
                  const remaining = shuffled.slice(10).map(o => o.id);
                  dispatch({ type: 'START_MICRO_P1', deck: first10, remainingPool: remaining });
                } else {
                  dispatch({ type: 'RESTART' });
                }
             }} 
           />
        )}

        {state.phase === 'SWIPE_MICRO_P1' && (
           <SwipingPhase 
             playerId={players[0]?.id}
             playerName={players[0]?.name}
             playerColor={players[0]?.color}
             deck={state.microDeck!}
             options={options}
             onComplete={() => dispatch({ type: 'NEXT_PHASE' })}
             onSwipe={(id, vote) => dispatch({ type: 'SWIPE_MICRO', playerId: players[0]?.id, optionId: id, vote })}
             onUndo={(id) => dispatch({ type: 'UNDO_MICRO', playerId: players[0]?.id, optionId: id })}
           />
        )}

        {state.phase === 'HANDOFF_MICRO' && (
           <HandoffPhase 
             nextPlayerName={players[1]?.name} 
             nextPlayerColor={players[1]?.color}
             onReady={() => dispatch({ type: 'NEXT_PHASE' })} 
           />
        )}

        {state.phase === 'SWIPE_MICRO_P2' && (
           <SwipingPhase 
             playerId={players[1]?.id}
             playerName={players[1]?.name}
             playerColor={players[1]?.color}
             deck={state.microDeck!}
             options={options}
             onComplete={() => {
               const p1 = players[0]?.id;
               const p2 = players[1]?.id;
               const matches = state.microDeck!.filter(id => state.microSwipes![p1]?.[id] === 'yes' && state.microSwipes![p2]?.[id] === 'yes');
               dispatch({ type: 'COMPUTE_MICRO_MATCHES', matches });
             }}
             onSwipe={(id, vote) => dispatch({ type: 'SWIPE_MICRO', playerId: players[1]?.id, optionId: id, vote })}
             onUndo={(id) => dispatch({ type: 'UNDO_MICRO', playerId: players[1]?.id, optionId: id })}
           />
        )}

        {state.phase === 'COMPUTE_MICRO' && (
           <ComputePhase 
             matches={state.microMatches || []} 
             options={options}
             onNext={(gamePicked) => {
               if (gamePicked && state.microMatches && state.microMatches.length > 1) {
                 dispatch({ type: 'SELECT_GAME', game: gamePicked, candidateSet: state.microMatches });
               } else {
                 dispatch({ type: 'NEXT_PHASE' });
               }
             }} 
           />
        )}

        {state.phase === 'RESULT_NO_MATCH' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-8">
             <div className="text-8xl mb-4">🤷‍♂️</div>
             <h2 className="text-4xl font-display font-black leading-tight tracking-tighter">No Matches</h2>
             <p className="text-xl font-medium">You couldn't agree on anything.</p>
             
             {state.remainingMicroPool && state.remainingMicroPool.length > 0 && (
                <button 
                  onClick={() => {
                    const first10 = state.remainingMicroPool!.slice(0, 10);
                    const remaining = state.remainingMicroPool!.slice(10);
                    dispatch({ type: 'START_NEXT_MICRO', deck: first10, remainingPool: remaining });
                  }}
                  className="w-full max-w-sm py-4 border-[4px] border-ink bg-white font-black text-xl uppercase tracking-wider rounded-[24px] shadow-[6px_6px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
                >
                  Show Next 10
                </button>
             )}

             <button 
               onClick={() => dispatch({ type: 'RESTART' })}
               className="w-full max-w-sm py-4 border-[4px] border-ink bg-transparent font-black text-xl uppercase tracking-wider rounded-[24px] shadow-[6px_6px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
             >
               Start Over
             </button>
           </div>
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
           <div key={state.gameRound} className="flex-1 flex flex-col">
             <GamePhase 
               gamePlayed={state.gamePlayed}
               players={players}
               onGameOver={(winnerId) => dispatch({ type: 'GAME_OVER', winnerId })}
               onDraw={() => dispatch({ type: 'GAME_DRAW' })}
             />
           </div>
        )}

        {state.phase === 'GAME_RESULT' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-8">
             <h2 className="text-5xl font-display font-black tracking-tighter">
               {players.find(p => p.id === state.winnerId)?.name} Wins!
             </h2>
             <p className="text-xl font-medium">Time to make the final call.</p>
             <button 
               onClick={() => dispatch({ type: 'NEXT_PHASE' })}
               className="w-full max-w-sm py-6 border-[4px] border-ink bg-white font-black text-xl uppercase tracking-wider rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
             >
               Choose Now
             </button>
             <button 
               onClick={() => {
                 const randomId = state.candidateSet![Math.floor(Math.random() * state.candidateSet!.length)];
                 dispatch({ type: 'SET_FINAL_PICK', optionId: randomId });
               }}
               className="w-full max-w-sm py-6 border-[3px] border-ink bg-coral text-white font-black text-lg uppercase tracking-wider rounded-[24px] shadow-[6px_6px_0_0_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
               title="Let fate decide"
             >
               Random Pick 🎲
             </button>
           </div>
        )}

        {state.phase === 'FINAL' && state.microMatches && state.microMatches.length !== 1 && (
           <FinalPhase 
             winnerId={state.winnerId!}
             players={players}
             options={options}
             optionId={state.finalPick}
             candidateSet={state.candidateSet || []}
             onPick={(id) => dispatch({ type: 'SET_FINAL_PICK', optionId: id })}
             onDone={handleFinish}
           />
        )}

      </div>
    </div>
  );
}
