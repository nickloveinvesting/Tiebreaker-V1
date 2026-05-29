import { useState, useEffect } from 'react';
import { Player } from '../../lib/types';
import { AnimatePresence, motion } from 'motion/react';
import { clsx } from 'clsx';
import { Delete } from 'lucide-react';

const WORDS = ["APPLE", "HOUSE", "GRAPE", "CRANE", "TRAIN", "BEACH", "GHOST", "LASER", "PLANT", "HEART", "PIZZA", "TIGER", "WATER", "BRICK"];
const MAX_GUESSES = 6;

export default function Wordle({ players, onWin, onDraw }: { players: Player[], onWin: (playerId: string) => void, onDraw: () => void }) {
  const [targetWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [winner, setWinner] = useState<string | null>(null);

  const currentPlayerIdx = guesses.length % players.length;
  const currentPlayer = players[currentPlayerIdx];

  const handleChar = (char: string) => {
    if (winner || guesses.length >= MAX_GUESSES) return;
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + char);
    }
  };

  const handleBackspace = () => {
    if (winner || guesses.length >= MAX_GUESSES) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (winner || guesses.length >= MAX_GUESSES) return;
    if (currentGuess.length !== 5) return; // Must be 5 letters

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === targetWord) {
      setWinner(currentPlayer.id);
      setTimeout(() => onWin(currentPlayer.id), 2000);
      return;
    }

    if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(onDraw, 2000);
    }
  };

  const getLetterStatus = (letter: string, index: number, guess: string) => {
    if (targetWord[index] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const KEYBOARD = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto mt-4 gap-4 pb-4">
      <div className="flex justify-between w-full items-center px-4 shrink-0">
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 0 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[0].color }} />
          <span className="text-xs font-black uppercase">{players[0].name}</span>
        </div>
        <div className="text-2xl font-display font-black tracking-tighter">
          {winner ? 'WINNER!' : 'WORDLE'}
        </div>
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 1 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[1].color }} />
          <span className="text-xs font-black uppercase">{players[1].name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 justify-center w-full px-4">
        {Array.from({ length: MAX_GUESSES }).map((_, i) => {
          const guess = guesses[i];
          const isCurrentrow = i === guesses.length;
          const displayStr = guess || (isCurrentrow ? currentGuess : "");
          
          return (
            <div key={i} className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, j) => {
                const letter = displayStr[j] || "";
                let status = 'empty';
                if (guess) {
                  status = getLetterStatus(letter, j, guess);
                }

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

      <div className="w-full flex justify-center mt-2">
        <div className="flex flex-col gap-2 w-full px-2">
          {KEYBOARD.map((row, i) => (
            <div key={i} className="flex justify-center gap-1 sm:gap-2">
              {row.map(key => {
                const isEnter = key === 'ENTER';
                const isBack = key === 'BACK';
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (isEnter) handleSubmit();
                      else if (isBack) handleBackspace();
                      else handleChar(key);
                    }}
                    className={clsx(
                      "h-12 bg-cream flex items-center justify-center rounded-lg border-[3px] border-ink font-black shadow-[2px_2px_0_0_#1A1A1A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all",
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
      
      {winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="fixed bottom-1/2 translate-y-1/2 px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-full shadow-[8px_8px_0_0_#1A1A1A] z-50 text-center"
        >
          {players.find(p => p.id === winner)?.name} Wins
        </motion.div>
      )}
      {!winner && guesses.length >= MAX_GUESSES && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="fixed bottom-1/2 translate-y-1/2 px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A] z-50 text-center text-xl"
        >
          DRAW
          <div className="text-sm">Word was {targetWord}</div>
        </motion.div>
      )}
    </div>
  );
}
