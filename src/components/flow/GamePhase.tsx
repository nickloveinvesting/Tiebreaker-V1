import { Player } from '../../lib/types';
import Connect4 from '../games/Connect4';
import Wordle from '../games/Wordle';
import Trivia from '../games/Trivia';
import { motion } from 'motion/react';

export default function GamePhase({ gamePlayed, players, onGameOver, onDraw }: { gamePlayed?: 'connect4' | 'wordle' | 'trivia', players: Player[], onGameOver: (winnerId: string) => void, onDraw: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-4 pt-8 h-full relative"
    >
      {gamePlayed === 'wordle' ? (
         <Wordle players={players} onWin={onGameOver} onDraw={onDraw} />
      ) : gamePlayed === 'trivia' ? (
         <Trivia players={players} onWin={onGameOver} />
      ) : (
         <Connect4 players={players} onWin={onGameOver} onDraw={onDraw} />
      )}
    </motion.div>
  );
}
