import { useState } from 'react';
import { Player } from '../../lib/types';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { HelpCircle } from 'lucide-react';

const QUESTIONS = [
  { q: "What is the capital of France?", a: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
  { q: "Which planet is known as the Red Planet?", a: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { q: "What is the largest ocean on Earth?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { q: "How many continents are there?", a: ["5", "6", "7", "8"], correct: 2 },
  { q: "Which animal is the tallest in the world?", a: ["Elephant", "Giraffe", "Ostrich", "Kangaroo"], correct: 1 },
  { q: "What is the hardest natural substance on Earth?", a: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
  { q: "How many colors are in a rainbow?", a: ["5", "6", "7", "8"], correct: 2 },
  { q: "Which country is home to the kangaroo?", a: ["South Africa", "Australia", "New Zealand", "Brazil"], correct: 1 },
  { q: "Who wrote 'Romeo and Juliet'?", a: ["Mark Twain", "Charles Dickens", "William Shakespeare", "Jane Austen"], correct: 2 },
  { q: "What is the main geometric shape of a Yield sign?", a: ["Circle", "Triangle", "Square", "Octagon"], correct: 1 }
].sort(() => 0.5 - Math.random());

export default function Trivia({ players, onWin }: { players: Player[], onWin: (id: string) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ [players[0].id]: 0, [players[1].id]: 0 });
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const currentQ = QUESTIONS[qIndex % QUESTIONS.length];
  const currentPlayer = players[currentPlayerIdx];

  const handleSelect = (idx: number) => {
    if (isRevealing || winner) return;
    setSelectedOption(idx);
    setIsRevealing(true);

    const isCorrect = idx === currentQ.correct;
    const newScores = { ...scores };
    if (isCorrect) {
      newScores[currentPlayer.id] += 1;
      setScores(newScores);
    }

    setTimeout(() => {
      // Check for win condition: 3 points
      if (newScores[currentPlayer.id] >= 3) {
        setWinner(currentPlayer.id);
        setTimeout(() => onWin(currentPlayer.id), 2000);
        return;
      }

      setIsRevealing(false);
      setSelectedOption(null);
      setQIndex(prev => prev + 1);
      setCurrentPlayerIdx(prev => (prev + 1) % players.length);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto mt-4 gap-6 pb-4">
      <div className="flex justify-between w-full items-center px-4 shrink-0">
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 0 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1 flex items-center justify-center font-black text-white" style={{ backgroundColor: players[0].color }}>
            {scores[players[0].id]}
          </div>
          <span className="text-xs font-black uppercase">{players[0].name}</span>
        </div>
        <div className="text-2xl font-display font-black tracking-tighter flex flex-col items-center">
          First to 3
        </div>
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 1 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1 flex items-center justify-center font-black text-white" style={{ backgroundColor: players[1].color }}>
            {scores[players[1].id]}
          </div>
          <span className="text-xs font-black uppercase">{players[1].name}</span>
        </div>
      </div>

      <div className="flex-1 w-full px-4 flex flex-col items-center justify-center gap-8 relative h-full">
        <div 
          className="w-full bg-white border-[4px] border-ink rounded-[32px] p-8 shadow-[12px_12px_0_0_#1A1A1A] text-center"
        >
          <HelpCircle size={48} className="mx-auto mb-4 text-ink opacity-20" />
          <h2 className="text-2xl font-display font-black leading-tight tracking-tight">
            {currentQ.q}
          </h2>
        </div>

        <div className="w-full flex flex-col gap-3">
          {currentQ.a.map((ans, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQ.correct === idx;
            
            let bgClass = "bg-white hover:bg-black/5";
            let borderClass = "border-ink";
            
            if (isRevealing) {
              if (isCorrect) {
                bgClass = "bg-green-500 text-white";
                borderClass = "border-green-600";
              } else if (isSelected) {
                bgClass = "bg-red-500 text-white";
                borderClass = "border-red-600";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isRevealing}
                className={clsx(
                  "w-full p-4 border-[4px] rounded-[24px] font-black text-xl text-left transition-all",
                  bgClass, borderClass,
                  (!isRevealing && isSelected) ? "translate-y-[2px] translate-x-[2px] shadow-none" : "shadow-[6px_6px_0_0_#1A1A1A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                )}
              >
                {ans}
              </button>
            );
          })}
        </div>
      </div>

      {winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="fixed bottom-1/2 translate-y-1/2 px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-full shadow-[12px_12px_0_0_#1A1A1A] z-50 text-center"
        >
          {players.find(p => p.id === winner)?.name} Wins!
        </motion.div>
      )}
    </div>
  );
}
