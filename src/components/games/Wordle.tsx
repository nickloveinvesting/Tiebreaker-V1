import { useState, useEffect } from 'react';
import { Player } from '../../lib/types';
import { AnimatePresence, motion } from 'motion/react';
import { clsx } from 'clsx';
import { Delete } from 'lucide-react';

const WORDS = ["APPLE", "HOUSE", "GRAPE", "CRANE", "TRAIN", "BEACH", "GHOST", "LASER", "PLANT", "HEART", "PIZZA", "TIGER", "WATER", "BRICK", "STORM", "CLOUD", "DANCE", "SMILE", "LEMON", "BREAD"];
const MAX_GUESSES = 6;

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Wordle({ players, onWin, onDraw }: { players: Player[], onWin: (playerId: string) => void, onDraw: () => void }) {
  const [targetWord, setTargetWord] = useState(getRandomWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  
  // 0 = Player 1 playing, 1 = Interim, 2 = Player 2 playing, 3 = Game Over
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [p1Score, setP1Score] = useState<number | null>(null);
  const [p2Score, setP2Score] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activePlayerIdx = phase === 0 ? 0 : 1;
  const activePlayer = players[activePlayerIdx];

  const handleChar = (char: string) => {
    if (isTransitioning || phase === 1 || phase === 3 || guesses.length >= MAX_GUESSES) return;
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + char);
    }
  };

  const handleBackspace = () => {
    if (isTransitioning || phase === 1 || phase === 3 || guesses.length >= MAX_GUESSES) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isTransitioning || phase === 1 || phase === 3 || guesses.length >= MAX_GUESSES) return;
    if (currentGuess.length !== 5) return; // Must be 5 letters

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Check Win for current round
    if (currentGuess === targetWord) {
      finishRound(newGuesses.length);
      return;
    }

    // Check Loss for current round
    if (newGuesses.length >= MAX_GUESSES) {
      finishRound(7); // 7 means failed
    }
  };

  const finishRound = (score: number) => {
    setIsTransitioning(true);
    if (phase === 0) {
      setP1Score(score);
      setTimeout(() => {
        setPhase(1);
        setIsTransitioning(false);
      }, 1500); // Wait a moment so they see their result
    } else if (phase === 2) {
      setP2Score(score);
      setTimeout(() => evaluateWinner(p1Score!, score), 1500);
    }
  };

  const evaluateWinner = (score1: number, score2: number) => {
    setPhase(3);
    setIsTransitioning(false);
    if (score1 < score2) {
      setWinner(players[0].id);
      setTimeout(() => onWin(players[0].id), 3000);
    } else if (score2 < score1) {
      setWinner(players[1].id);
      setTimeout(() => onWin(players[1].id), 3000);
    } else {
      setTimeout(onDraw, 3000);
    }
  };

  const startPlayer2 = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setPhase(2);
  };

  const getGuessStatuses = (guess: string) => {
    const statuses = Array(5).fill('absent');
    const targetChars = targetWord.split('');

    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetChars[i]) {
        statuses[i] = 'correct';
        targetChars[i] = '';
      }
    }

    for (let i = 0; i < 5; i++) {
      if (statuses[i] !== 'correct') {
        const charIdx = targetChars.indexOf(guess[i]);
        if (charIdx > -1) {
          statuses[i] = 'present';
          targetChars[charIdx] = '';
        }
      }
    }
    return statuses;
  };

  const getKeyStatus = (key: string) => {
    let bestStatus = 'empty';
    for (const guess of guesses) {
      const statuses = getGuessStatuses(guess);
      for (let i = 0; i < 5; i++) {
        if (guess[i] === key) {
          const st = statuses[i];
          if (st === 'correct') return 'correct';
          if (st === 'present' && bestStatus !== 'correct') bestStatus = 'present';
          if (st === 'absent' && bestStatus === 'empty') bestStatus = 'absent';
        }
      }
    }
    return bestStatus;
  };

  const KEYBOARD = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  if (phase === 1) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-8">
        <h2 className="text-4xl font-display font-black tracking-tighter text-center">
          {p1Score === 7 ? 'NO LUCK' : `GOT IT IN ${p1Score}`}
        </h2>
        <div className="flex flex-col items-center justify-center p-8 bg-white border-[4px] border-ink shadow-[8px_8px_0_0_#1A1A1A] rounded-[32px] text-center w-full max-w-[300px]">
           <div className="w-16 h-16 rounded-full border-[4px] border-ink mb-4 mx-auto" style={{ backgroundColor: players[1].color }} />
           <p className="font-black text-2xl uppercase tracking-widest leading-tight">
             {players[1].name}'s<br/>Turn
           </p>
           <p className="mt-2 text-ink/60 font-black uppercase text-sm">
             Beat {p1Score === 7 ? 'the board' : p1Score + ' guesses'}
           </p>
        </div>
        <button 
          onClick={startPlayer2}
          className="w-full max-w-[300px] mt-4 py-4 uppercase font-black tracking-widest bg-ink text-white rounded-full text-xl shadow-[6px_6px_0_0_#1A1A1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          I'm Ready
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto mt-4 gap-4 pb-4">
      <div className="flex justify-between w-full items-center px-4 shrink-0">
        <div className={clsx("transition-opacity flex flex-col items-center", activePlayerIdx === 0 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[0].color }} />
          <span className="text-xs font-black uppercase">{players[0].name}</span>
        </div>
        <div className="text-2xl font-display font-black tracking-tighter flex flex-col items-center">
          <div>WORDLE</div>
          {phase === 2 && p1Score !== null && (
            <div className="text-[10px] uppercase font-black text-ink/50 tracking-widest mt-0.5">
              To Beat: {p1Score === 7 ? 'X' : p1Score}
            </div>
          )}
        </div>
        <div className={clsx("transition-opacity flex flex-col items-center", activePlayerIdx === 1 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[1].color }} />
          <span className="text-xs font-black uppercase">{players[1].name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 justify-center w-full px-4 relative">
        {Array.from({ length: MAX_GUESSES }).map((_, i) => {
          const guess = guesses[i];
          const isCurrentrow = i === guesses.length;
          const displayStr = guess || (isCurrentrow ? currentGuess : "");
          let statuses = Array(5).fill('empty');
          if (guess) {
             statuses = getGuessStatuses(guess);
          }
          
          return (
            <div key={i} className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, j) => {
                const letter = displayStr[j] || "";
                const status = statuses[j];

                return (
                  <div 
                    key={j} 
                    className={clsx(
                      "w-12 h-12 flex items-center justify-center text-2xl font-black rounded-xl border-[3px] transition-all",
                      status === 'correct' ? "bg-green-500 border-green-600 text-white shadow-[4px_4px_0_0_#166534]" :
                      status === 'present' ? "bg-yellow-400 border-yellow-500 text-ink shadow-[4px_4px_0_0_#CA8A04]" :
                      status === 'absent' ? "bg-ink border-black text-white shadow-[4px_4px_0_0_#000000]" :
                      (letter ? "border-ink shadow-[4px_4px_0_0_#1A1A1A]" : "border-ink/20")
                    )}
                  >
                     <AnimatePresence mode="popLayout">
                        {letter && (
                          <motion.span
                             initial={{ scale: 0.5, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             key={letter + j}
                          >
                             {letter}
                          </motion.span>
                        )}
                     </AnimatePresence>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-center mt-2 opacity-100 transition-opacity">
        <div className="flex flex-col gap-2 w-full px-2">
          {KEYBOARD.map((row, i) => (
            <div key={i} className="flex justify-center gap-1 sm:gap-2">
              {row.map(key => {
                const isEnter = key === 'ENTER';
                const isBack = key === 'BACK';
                const status = (isEnter || isBack) ? 'empty' : getKeyStatus(key);
                
                return (
                  <button
                    key={key}
                    disabled={phase === 3}
                    onClick={() => {
                      if (isEnter) handleSubmit();
                      else if (isBack) handleBackspace();
                      else handleChar(key);
                    }}
                    className={clsx(
                      "h-12 flex items-center justify-center rounded-lg border-[3px] border-ink font-black shadow-[2px_2px_0_0_#1A1A1A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all",
                      status === 'correct' ? "bg-green-500 text-white" :
                      status === 'present' ? "bg-yellow-400 text-ink" :
                      status === 'absent' ? "bg-ink text-white" : "bg-cream text-ink",
                      (isEnter || isBack) ? "px-2 sm:px-4 text-[10px] sm:text-xs min-w-[2.5rem]" : "w-8 sm:w-10 text-sm"
                    )}
                  >
                    {isBack ? <Delete size={20} strokeWidth={3} /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {phase === 3 && winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="fixed bottom-1/2 translate-y-1/2 px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-full shadow-[8px_8px_0_0_#1A1A1A] z-50 text-center"
        >
          {players.find(p => p.id === winner)?.name} Wins
        </motion.div>
      )}
      {phase === 3 && !winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="fixed bottom-1/2 translate-y-1/2 px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] z-50 text-center text-xl"
        >
          DRAW
          <div className="text-sm mt-1 text-ink/70">Tiebreaker Incoming!</div>
        </motion.div>
      )}
    </div>
  );
}
